from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json
from typing import List, Dict, Any, Optional
import os
import httpx
import traceback
from pydantic_settings import BaseSettings
from pydantic import BaseModel
import aiosqlite
import logging

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    OPENAI_API_KEY: str = "sk-q9H8wqyhhHxcut658fFfE242Db5b4071B653E5Af3e61FfE3"
    OPENAI_API_BASE: str = "https://api.oaipro.com"

class ContentSaveRequest(BaseModel):
    content: str

settings = Settings()

app = FastAPI(title="历史人物查询系统API", description="基于CBDB数据的历史人物查询API")

# 添加CORS中间件，允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置为特定的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库文件路径
DB_PATH = "data/data.db"
BOSS_DB_PATH = "data/boss.db"

# API 配置
OAIPRO_API_BASE = "https://api.oaipro.com"
OAIPRO_API_KEY = "sk-q9H8wqyhhHxcut658fFfE242Db5b4071B653E5Af3e61FfE3"
MODEL_NAME = "gpt-4-turbo"  # 使用最新的Claude 3.5 Sonnet模型

# 创建 httpx 客户端
async_client = httpx.AsyncClient(
    base_url=OAIPRO_API_BASE,
    headers={
        "Authorization": f"Bearer {OAIPRO_API_KEY}",
        "Content-Type": "application/json"
    },
    timeout=60.0  # 增加超时时间到60秒
)

# 检查数据库文件是否存在
if not os.path.exists(DB_PATH):
    raise Exception(f"数据库文件不存在: {DB_PATH}")
if not os.path.exists(BOSS_DB_PATH):
    raise Exception(f"BOSS数据库文件不存在: {BOSS_DB_PATH}")

def get_db_connection():
    """创建数据库连接并设置返回行为为字典"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_boss_db_connection():
    """创建BOSS数据库连接并设置返回行为为字典"""
    conn = sqlite3.connect(BOSS_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# 确保 AI 内容表存在
def init_ai_content_tables():
    conn = get_boss_db_connection()
    try:
        # 创建AI生成记录表
        conn.execute("""
        CREATE TABLE IF NOT EXISTS ai_content_generations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            person_id INTEGER NOT NULL,
            content_type VARCHAR(20) NOT NULL,
            prompt TEXT NOT NULL,
            model_version VARCHAR(50) NOT NULL,
            parameters JSON,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # 创建AI传记表
        conn.execute("""
        CREATE TABLE IF NOT EXISTS ai_biographies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            person_id INTEGER NOT NULL,
            generation_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            version INTEGER NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'draft',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            published_at TIMESTAMP,
            view_count INTEGER DEFAULT 0,
            FOREIGN KEY (generation_id) REFERENCES ai_content_generations(id)
        )
        """)
        
        # 创建AI简历表
        conn.execute("""
        CREATE TABLE IF NOT EXISTS ai_resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            person_id INTEGER NOT NULL,
            generation_id INTEGER NOT NULL,
            template_id INTEGER NOT NULL,
            content JSON NOT NULL,
            version INTEGER NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'draft',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            published_at TIMESTAMP,
            view_count INTEGER DEFAULT 0,
            FOREIGN KEY (generation_id) REFERENCES ai_content_generations(id)
        )
        """)
        
        # 创建简历模板表
        conn.execute("""
        CREATE TABLE IF NOT EXISTS resume_templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            structure JSON NOT NULL,
            style_config JSON,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """)
        
        # 插入默认简历模板（如果不存在）
        conn.execute("""
        INSERT OR IGNORE INTO resume_templates (id, name, description, structure, style_config)
        VALUES (
            1,
            '现代简约模板',
            '简洁现代的简历模板，适合展示历史人物的生平事迹',
            '{
                "sections": [
                    {
                        "id": "basic_info",
                        "title": "基本信息",
                        "type": "text"
                    },
                    {
                        "id": "life_events",
                        "title": "生平大事",
                        "type": "timeline"
                    },
                    {
                        "id": "achievements",
                        "title": "主要成就",
                        "type": "list"
                    },
                    {
                        "id": "historical_impact",
                        "title": "历史影响",
                        "type": "text"
                    }
                ]
            }',
            '{
                "theme": "modern",
                "layout": "single-column",
                "typography": {
                    "font_family": "system-ui",
                    "heading_size": "large",
                    "text_size": "medium"
                }
            }'
        )
        """)
        
        conn.commit()
    except Exception as e:
        print(f"Error initializing AI content tables: {e}")
    finally:
        conn.close()

# 初始化表
init_ai_content_tables()

def init_db():
    """初始化数据库表"""
    conn = get_db_connection()
    try:
        # 创建AI内容表
        conn.execute("""
        CREATE TABLE IF NOT EXISTS ai_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            person_id TEXT NOT NULL,
            content_type TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(person_id, content_type)
        )
        """)
        conn.commit()
    except Exception as e:
        print(f"初始化数据库时发生错误: {str(e)}")
        raise
    finally:
        conn.close()

# 在应用启动时初始化数据库
init_db()

# 检查API密钥是否有效
async def check_api_key():
    try:
        print(f"正在检查API密钥有效性...")
        response = await async_client.get("/v1/models")
        print(f"API密钥检查响应: {response.status_code}")
        if response.status_code == 200:
            print("API密钥有效")
            return True
        else:
            print(f"API密钥无效: {response.text}")
            return False
    except Exception as e:
        print(f"检查API密钥时出错: {str(e)}")
        return False

# 在应用启动时检查API密钥
@app.on_event("startup")
async def startup_event():
    api_key_valid = await check_api_key()
    if not api_key_valid:
        print("警告: API密钥无效或无法连接到API服务")

@app.get("/")
def read_root():
    """API根路由"""
    return {"message": "欢迎使用历史人物查询系统API", "version": "1.0.0"}

@app.get("/api/person/{person_id}")
def get_person_by_id(person_id: int):
    """根据ID获取历史人物的所有相关信息"""
    try:
        conn = get_db_connection()
        result = {}
        
        # 1. 获取基本信息
        basic_info = conn.execute(
            """
            SELECT bm.*, d.c_dynasty_chn 
            FROM BIOG_MAIN bm
            LEFT JOIN DYNASTIES d ON bm.c_dy = d.c_dy
            WHERE bm.c_personid = ?
            """, 
            (person_id,)
        ).fetchone()
        
        if not basic_info:
            conn.close()
            raise HTTPException(status_code=404, detail=f"未找到ID为{person_id}的人物")
            
        result["basic_info"] = {
            "personid": basic_info["c_personid"],
            "name": basic_info["c_name"],
            "name_chn": basic_info["c_name_chn"],
            "dynasty": basic_info["c_dynasty_chn"],
            "dynasty_id": basic_info["c_dy"],
            "gender": "女" if basic_info["c_female"] == 1 else "男",
            "birth_year": basic_info["c_birthyear"],
            "death_year": basic_info["c_deathyear"],
            "death_age": basic_info["c_death_age"],
            "index_year": basic_info["c_index_year"],
            "surname": basic_info["c_surname_chn"],
            "mingzi": basic_info["c_mingzi_chn"]
        }
        
        # 2. 获取别名信息
        alt_names = conn.execute(
            """
            SELECT ad.*, ac.c_name_type_desc, ac.c_name_type_desc_chn
            FROM ALTNAME_DATA ad
            LEFT JOIN ALTNAME_CODES ac ON ad.c_alt_name_type_code = ac.c_name_type_code
            WHERE ad.c_personid = ?
            """, 
            (person_id,)
        ).fetchall()
        
        result["alt_names"] = [{
            "alt_name": row["c_alt_name"],
            "alt_name_chn": row["c_alt_name_chn"],
            "type": row["c_name_type_desc_chn"],
            "type_code": row["c_alt_name_type_code"]
        } for row in alt_names]
        
        # 3. 获取亲属关系
        kin_relations = conn.execute(
            """
            SELECT kd.*, bm.c_name_chn AS c_kin_name_chn, kc.c_kinrel_chn
            FROM KIN_DATA kd
            LEFT JOIN BIOG_MAIN bm ON kd.c_kin_id = bm.c_personid
            LEFT JOIN KINSHIP_CODES kc ON kd.c_kin_code = kc.c_kincode
            WHERE kd.c_personid = ?
            """, 
            (person_id,)
        ).fetchall()
        
        result["kin_relations"] = [{
            "kin_id": row["c_kin_id"],
            "kin_name": row["c_kin_name_chn"],
            "relation": row["c_kinrel_chn"],
            "relation_code": row["c_kin_code"]
        } for row in kin_relations]
        
        # 4. 获取社会关系
        social_relations = conn.execute(
            """
            SELECT ad.*, bm.c_name_chn AS c_assoc_name_chn, ac.c_assoc_desc_chn
            FROM ASSOC_DATA ad
            LEFT JOIN BIOG_MAIN bm ON ad.c_assoc_id = bm.c_personid
            LEFT JOIN ASSOC_CODES ac ON ad.c_assoc_code = ac.c_assoc_code
            WHERE ad.c_personid = ?
            """, 
            (person_id,)
        ).fetchall()
        
        result["social_relations"] = [{
            "assoc_id": row["c_assoc_id"],
            "assoc_name": row["c_assoc_name_chn"],
            "relation": row["c_assoc_desc_chn"],
            "relation_code": row["c_assoc_code"],
            "year": row["c_assoc_year"]
        } for row in social_relations]
        
        # 5. 获取地址信息
        addresses = conn.execute(
            """
            SELECT bad.*, ac.c_name_chn AS c_addr_name_chn, bac.c_addr_desc_chn
            FROM BIOG_ADDR_DATA bad
            LEFT JOIN ADDRESSES ac ON bad.c_addr_id = ac.c_addr_id
            LEFT JOIN BIOG_ADDR_CODES bac ON bad.c_addr_type = bac.c_addr_type
            WHERE bad.c_personid = ?
            """, 
            (person_id,)
        ).fetchall()
        
        result["addresses"] = [{
            "addr_id": row["c_addr_id"],
            "addr_name": row["c_addr_name_chn"],
            "addr_type": row["c_addr_desc_chn"],
            "addr_type_code": row["c_addr_type"],
            "first_year": row["c_firstyear"],
            "last_year": row["c_lastyear"]
        } for row in addresses]
        
        # 6. 获取官职信息
        offices = conn.execute(
            """
            SELECT pod.*, oc.c_office_chn, atc.c_appt_type_desc_chn, aoc.c_assume_office_desc_chn
            FROM POSTED_TO_OFFICE_DATA pod
            LEFT JOIN OFFICE_CODES oc ON pod.c_office_id = oc.c_office_id
            LEFT JOIN APPOINTMENT_TYPE_CODES atc ON pod.c_appt_type_code = atc.c_appt_type_code
            LEFT JOIN ASSUME_OFFICE_CODES aoc ON pod.c_assume_office_code = aoc.c_assume_office_code
            WHERE pod.c_personid = ?
            """, 
            (person_id,)
        ).fetchall()
        
        result["offices"] = [{
            "office_id": row["c_office_id"],
            "office_name": row["c_office_chn"],
            "first_year": row["c_firstyear"],
            "last_year": row["c_lastyear"],
            "appointment_type": row["c_appt_type_desc_chn"],
            "assume_office": row["c_assume_office_desc_chn"]
        } for row in offices]
        
        # 7. 获取入仕信息
        entries = conn.execute(
            """
            SELECT ed.*, ec.c_entry_desc_chn
            FROM ENTRY_DATA ed
            LEFT JOIN ENTRY_CODES ec ON ed.c_entry_code = ec.c_entry_code
            WHERE ed.c_personid = ?
            """, 
            (person_id,)
        ).fetchall()
        
        result["entries"] = [{
            "entry_code": row["c_entry_code"],
            "entry_desc": row["c_entry_desc_chn"],
            "year": row["c_year"],
            "age": row["c_age"],
            "attempt_count": row["c_attempt_count"],
            "exam_rank": row["c_exam_rank"]
        } for row in entries]
        
        # 8. 获取社会地位
        statuses = conn.execute(
            """
            SELECT sd.*, sc.c_status_desc_chn
            FROM STATUS_DATA sd
            LEFT JOIN STATUS_CODES sc ON sd.c_status_code = sc.c_status_code
            WHERE sd.c_personid = ?
            """, 
            (person_id,)
        ).fetchall()
        
        result["statuses"] = [{
            "status_code": row["c_status_code"],
            "status_desc": row["c_status_desc_chn"],
            "first_year": row["c_firstyear"],
            "last_year": row["c_lastyear"],
            "supplement": row["c_supplement"]
        } for row in statuses]
        
        # 9. 获取著作信息
        texts = conn.execute(
            """
            SELECT btd.*, tc.c_title_chn, trc.c_role_desc_chn
            FROM BIOG_TEXT_DATA btd
            LEFT JOIN TEXT_CODES tc ON btd.c_textid = tc.c_textid
            LEFT JOIN TEXT_ROLE_CODES trc ON btd.c_role_id = trc.c_role_id
            WHERE btd.c_personid = ?
            """, 
            (person_id,)
        ).fetchall()
        
        result["texts"] = [{
            "text_id": row["c_textid"],
            "title": row["c_title_chn"],
            "role": row["c_role_desc_chn"],
            "year": row["c_year"]
        } for row in texts]
        
        conn.close()
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")

@app.get("/api/search")
def search_persons(
    name: Optional[str] = Query(None, description="根据姓名搜索"),
    dynasty_id: Optional[int] = Query(None, description="朝代ID"),
    birth_year_from: Optional[int] = Query(None, description="出生年份范围起点"),
    birth_year_to: Optional[int] = Query(None, description="出生年份范围终点"),
    address_id: Optional[int] = Query(None, description="地址ID"),
    limit: int = Query(20, description="结果数量限制"),
    offset: int = Query(0, description="结果偏移量")
):
    """搜索历史人物"""
    try:
        conn = get_db_connection()
        query_parts = ["SELECT bm.*, d.c_dynasty_chn FROM BIOG_MAIN bm LEFT JOIN DYNASTIES d ON bm.c_dy = d.c_dy WHERE 1=1"]
        params = []

        # 添加搜索条件
        if name:
            query_parts.append("AND (bm.c_name_chn LIKE ? OR bm.c_name LIKE ? OR bm.c_mingzi_chn LIKE ? OR bm.c_surname_chn LIKE ?)")
            pattern = f"%{name}%"
            params.extend([pattern, pattern, pattern, pattern])
            
        if dynasty_id:
            query_parts.append("AND bm.c_dy = ?")
            params.append(dynasty_id)
            
        if birth_year_from:
            query_parts.append("AND (bm.c_birthyear >= ? OR bm.c_birthyear IS NULL)")
            params.append(birth_year_from)
            
        if birth_year_to:
            query_parts.append("AND (bm.c_birthyear <= ? OR bm.c_birthyear IS NULL)")
            params.append(birth_year_to)
            
        if address_id:
            query_parts.append("""AND bm.c_personid IN (
                SELECT c_personid FROM BIOG_ADDR_DATA WHERE c_addr_id = ?
            )""")
            params.append(address_id)
            
        # 添加分页
        query_parts.append("LIMIT ? OFFSET ?")
        params.extend([limit, offset])
        
        # 执行查询
        query = " ".join(query_parts)
        rows = conn.execute(query, params).fetchall()
        
        # 获取总记录数
        count_query_parts = query_parts[:-1]  # 移除LIMIT部分
        count_params = params[:-2]  # 移除limit和offset参数
        count_query = f"SELECT COUNT(*) as total FROM ({' '.join(count_query_parts)})"
        total_count = conn.execute(count_query, count_params).fetchone()["total"]
        
        # 格式化结果
        results = []
        for row in rows:
            results.append({
                "personid": row["c_personid"],
                "name": row["c_name"],
                "name_chn": row["c_name_chn"],
                "dynasty": row["c_dynasty_chn"],
                "dynasty_id": row["c_dy"],
                "gender": "女" if row["c_female"] == 1 else "男",
                "birth_year": row["c_birthyear"],
                "death_year": row["c_deathyear"],
                "death_age": row["c_death_age"],
                "index_year": row["c_index_year"],
                "surname": row["c_surname_chn"],
                "mingzi": row["c_mingzi_chn"]
            })
        
        conn.close()
        return {
            "total": total_count,
            "offset": offset,
            "limit": limit,
            "results": results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"搜索失败: {str(e)}")

@app.get("/api/dynasties")
def get_dynasties():
    """获取所有朝代信息"""
    try:
        conn = get_db_connection()
        dynasties = conn.execute(
            "SELECT * FROM DYNASTIES ORDER BY c_sort"
        ).fetchall()
        
        result = [{
            "dynasty_id": row["c_dy"],
            "dynasty": row["c_dynasty"],
            "dynasty_chn": row["c_dynasty_chn"],
            "start_year": row["c_start"],
            "end_year": row["c_end"],
            "sort": row["c_sort"]
        } for row in dynasties]
        
        conn.close()
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取朝代信息失败: {str(e)}")

@app.get("/api/person/{person_id}/activities")
def get_person_activities(person_id: int):
    """获取历史人物的活动轨迹"""
    try:
        conn = get_db_connection()
        query = """
        SELECT 
            bm.c_name_chn AS name,
            ac.c_name_chn AS location_name,
            bac.c_addr_desc_chn AS relation_type,
            ba.c_firstyear AS first_year,
            ba.c_lastyear AS last_year,
            ac.x_coord AS longitude,
            ac.y_coord AS latitude,
            CASE 
                WHEN ac.c_name_chn LIKE '%府' OR ac.c_name_chn LIKE '%省' THEN 
                    REPLACE(REPLACE(ac.c_name_chn, '府', ''), '省', '')
                WHEN ac.c_name_chn LIKE '%县' THEN 
                    REPLACE(ac.c_name_chn, '县', '')
                WHEN ac.c_name_chn LIKE '%州' THEN 
                    REPLACE(ac.c_name_chn, '州', '')
                ELSE ac.c_name_chn
            END AS search_name
        FROM BIOG_ADDR_DATA ba
        JOIN BIOG_MAIN bm ON ba.c_personid = bm.c_personid
        JOIN ADDR_CODES ac ON ba.c_addr_id = ac.c_addr_id
        JOIN BIOG_ADDR_CODES bac ON ba.c_addr_type = bac.c_addr_type
        WHERE ba.c_personid = ?
        UNION
        SELECT 
            bm.c_name_chn AS name,
            ac.c_name_chn AS location_name,
            '任职地点' AS relation_type,
            po.c_firstyear AS first_year,
            po.c_lastyear AS last_year,
            ac.x_coord AS longitude,
            ac.y_coord AS latitude,
            CASE 
                WHEN ac.c_name_chn LIKE '%府' OR ac.c_name_chn LIKE '%省' THEN 
                    REPLACE(REPLACE(ac.c_name_chn, '府', ''), '省', '')
                WHEN ac.c_name_chn LIKE '%县' THEN 
                    REPLACE(ac.c_name_chn, '县', '')
                WHEN ac.c_name_chn LIKE '%州' THEN 
                    REPLACE(ac.c_name_chn, '州', '')
                ELSE ac.c_name_chn
            END AS search_name
        FROM POSTED_TO_ADDR_DATA pa
        JOIN POSTING_DATA pd ON pa.c_posting_id = pd.c_posting_id
        JOIN POSTED_TO_OFFICE_DATA po ON pa.c_posting_id = po.c_posting_id
        JOIN BIOG_MAIN bm ON pd.c_personid = bm.c_personid
        JOIN ADDR_CODES ac ON pa.c_addr_id = ac.c_addr_id
        WHERE pd.c_personid = ?
        ORDER BY first_year
        """
        
        rows = conn.execute(query, (person_id, person_id)).fetchall()
        
        if not rows:
            conn.close()
            raise HTTPException(status_code=404, detail=f"未找到ID为{person_id}的人物的活动轨迹")
            
        result = [dict(row) for row in rows]
        conn.close()
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")

@app.get("/api/person/{person_id}/ai-content")
def get_person_ai_content(person_id: int, content_type: str = Query(..., description="内容类型: 'biography' 或 'resume'")):
    """获取历史人物的AI生成内容"""
    try:
        conn = get_boss_db_connection()
        
        # 根据内容类型从相应表获取最新版本的已发布内容
        if content_type == 'biography':
            result = conn.execute("""
                SELECT b.content, b.version, b.status
                FROM ai_biographies b
                WHERE b.person_id = ? AND b.status = 'published'
                ORDER BY b.version DESC
                LIMIT 1
            """, (person_id,)).fetchone()
        else:  # resume
            result = conn.execute("""
                SELECT r.content, r.version, r.status
                FROM ai_resumes r
                WHERE r.person_id = ? AND r.status = 'published'
                ORDER BY r.version DESC
                LIMIT 1
            """, (person_id,)).fetchone()
            
        if not result:
            return {"content": "", "version": 0, "status": "not_found"}
            
        # 对于简历内容，确保返回的是有效的JSON
        if content_type == 'resume':
            try:
                # 尝试解析内容
                content = result['content']
                if isinstance(content, str):
                    content = json.loads(content)
                # 如果内容被包装在content字段中，提取出来
                if isinstance(content, dict) and 'content' in content:
                    content = content['content']
                # 确保内容是有效的JSON字符串
                if isinstance(content, dict):
                    content = json.dumps(content, ensure_ascii=False)
                return {
                    "content": content,
                    "version": result['version'],
                    "status": result['status']
                }
            except json.JSONDecodeError as e:
                print(f"解析简历JSON失败: {str(e)}")
                return {"content": "", "version": 0, "status": "error"}
        else:
            return {
                "content": result['content'],
                "version": result['version'],
                "status": result['status']
            }
        
    except Exception as e:
        print(f"获取AI内容时出错: {str(e)}")
        raise HTTPException(status_code=500, detail=f"获取AI内容时出错: {str(e)}")
    finally:
        conn.close()

def format_life_events(person: dict) -> str:
    """格式化生平大事"""
    events = []
    # 官职经历
    for office in person.get('offices', []):
        period = f"{office['first_year']}-{office['last_year']}" if office['first_year'] and office['last_year'] else "未知年份"
        events.append(f"{period}：担任{office['office_name']}，{office['appointment_type']}")
    
    # 地址变迁
    for addr in person.get('addresses', []):
        period = f"{addr['first_year']}-{addr['last_year']}" if addr['first_year'] and addr['last_year'] else "未知年份"
        events.append(f"{period}：{addr['addr_type']}于{addr['addr_name']}")
    
    return "\n".join(events) if events else "无记录"

def format_achievements(person: dict) -> str:
    """格式化主要成就"""
    achievements = []
    
    # 从官职中提取成就
    for office in person.get('offices', []):
        if office['office_name']:
            achievements.append(f"担任{office['office_name']}，{office['appointment_type']}")
    
    # 从著作中提取成就
    for text in person.get('texts', []):
        if text['title']:
            achievements.append(f"著有《{text['title']}》")
    
    return "\n".join(achievements) if achievements else "无记录"

def format_social_relations(person: dict) -> str:
    """格式化社会关系"""
    relations = []
    
    # 亲属关系
    for kin in person.get('kin_relations', []):
        if kin['kin_name'] and kin['relation']:
            relations.append(f"{kin['relation']}：{kin['kin_name']}")
    
    # 社会关系
    for social in person.get('social_relations', []):
        if social['assoc_name'] and social['relation']:
            year = f"（{social['year']}年）" if social['year'] else ""
            relations.append(f"{social['relation']}{year}：{social['assoc_name']}")
    
    return "\n".join(relations) if relations else "无记录"

def format_texts(person: dict) -> str:
    """格式化著作信息"""
    texts = []
    for text in person.get('texts', []):
        if text['title']:
            role = f"（{text['role']}）" if text['role'] else ""
            year = f"（{text['year']}年）" if text['year'] else ""
            texts.append(f"《{text['title']}》{role}{year}")
    
    return "\n".join(texts) if texts else "无记录"

def build_prompt(person: dict, content_type: str) -> str:
    """构建AI内容生成的提示词"""
    if content_type == 'resume':
        return f"""请将以下历史人物信息转化为一份有趣的现代职场简历。要求使用JSON格式，包含以下字段：

{{
    "modern_title": {{
        "position": "现代职位名称（可以幽默）",
        "company": "现代公司/组织名称（可以玩梗）",
        "industry": "所属行业（可以创新）"
    }},
    "personal_branding": {{
        "tagline": "有趣的个人品牌标语",
        "summary": "幽默的个人简介"
    }},
    "core_competencies": [
        {{
            "skill": "技能名称（可以玩梗）",
            "description": "有趣的技能描述"
        }}
    ],
    "career_highlights": [
        {{
            "period": "时间段",
            "title": "职位名称（可以幽默）",
            "company": "公司/组织名称（可以玩梗）",
            "achievement": "主要成就（用现代职场黑话）",
            "easter_egg": "历史梗（必须有趣）"
        }}
    ],
    "modern_achievements": [
        {{
            "title": "成就标题（可以玩梗）",
            "description": "成就描述（用现代语言）",
            "impact": "影响力描述（可以幽默）"
        }}
    ],
    "leadership_style": {{
        "style": "领导风格（可以幽默）",
        "approach": "管理方法（用现代语言）",
        "philosophy": "管理哲学（可以玩梗）"
    }},
    "personal_interests": [
        {{
            "interest": "兴趣名称（可以幽默）",
            "description": "兴趣描述（用现代语言）"
        }}
    ],
    "easter_eggs": [
        {{
            "type": "梗的类型",
            "content": "有趣的历史梗现代诠释",
            "icon": "<!-- 这里可以放[人物标志物]的icon -->"
        }}
    ]
}}

历史人物信息：
姓名：{person['basic_info']['name_chn']}
朝代：{person['basic_info']['dynasty']}
性别：{person['basic_info']['gender']}
生卒年：{person['basic_info']['birth_year']} - {person['basic_info']['death_year']}

生平大事：
{format_life_events(person)}

主要成就：
{format_achievements(person)}

社会关系：
{format_social_relations(person)}

著作：
{format_texts(person)}

特殊要求：
1. 身份反差：
   - 将历史身份转化为现代职位（如皇帝→霸道总裁，将军→安保顾问）
   - 保留标志性特征但现代化（如拿破仑的三角帽→时尚单品收藏家）

2. 语言风格：
   - 大量使用现代职场黑话和网络用语
   - 保持幽默感和创意性
   - 适当使用梗和双关语
   - 所有内容必须使用简体中文

3. 彩蛋设计：
   - 每个部分都要包含1-2个历史梗
   - 用现代职场语言重新诠释历史事件
   - 添加人物标志物的现代诠释

4. 特别说明：
   - 如果有负面历史，用幽默的方式处理
   - 为女性历史人物添加"打破玻璃天花板"的表述
   - 技术型人物重点突出"颠覆性创新"
   - 确保所有内容既有趣又不会过于戏谑
   - 必须使用简体中文，不要使用繁体字

5. 格式要求：
   - 使用半角标点符号
   - 确保JSON格式正确，可以被解析
   - 适当使用换行和缩进提高可读性
   - 所有文字必须使用简体中文"""
    else:
        return f"""请根据以下历史人物信息，生成一份严谨的传记。要求：
1. 语言庄重典雅
2. 突出历史贡献
3. 详述重要事件
4. 客观评价功过

历史人物信息：
姓名：{person['basic_info']['name_chn']}
朝代：{person['basic_info']['dynasty']}
性别：{person['basic_info']['gender']}
生卒年：{person['basic_info']['birth_year']} - {person['basic_info']['death_year']}

生平大事：
{format_life_events(person)}

主要成就：
{format_achievements(person)}

社会关系：
{format_social_relations(person)}

著作：
{format_texts(person)}

特殊要求：
1. 叙事风格：
   - 采用严谨的史学笔法
   - 注重史实的准确性
   - 保持客观的叙述态度

2. 内容结构：
   - 按时间顺序展开
   - 重点突出历史贡献
   - 详述重要历史事件

3. 评价标准：
   - 客观评价历史功过
   - 分析历史影响
   - 总结历史地位

4. 史料运用：
   - 注重史料的可靠性
   - 适当引用历史记载
   - 注明重要史实来源

5. 语言要求：
   - 使用规范的书面语
   - 避免口语化表达
   - 保持庄重的语气"""

def save_ai_content(person_id: str, content_type: str, content: str) -> None:
    """保存AI生成的内容到数据库"""
    conn = get_db_connection()
    try:
        # 检查是否已存在记录
        existing = conn.execute(
            "SELECT id FROM ai_content WHERE person_id = ? AND content_type = ?",
            (person_id, content_type)
        ).fetchone()

        if existing:
            # 更新现有记录
            conn.execute("""
                UPDATE ai_content 
                SET content = ?, updated_at = CURRENT_TIMESTAMP
                WHERE person_id = ? AND content_type = ?
            """, (content, person_id, content_type))
        else:
            # 插入新记录
            conn.execute("""
                INSERT INTO ai_content (person_id, content_type, content)
                VALUES (?, ?, ?)
            """, (person_id, content_type, content))

        conn.commit()
    except Exception as e:
        print(f"保存AI内容时发生错误: {str(e)}")
        conn.rollback()
        raise
    finally:
        conn.close()

async def generate_ai_content(person_id: str, content_type: str) -> dict:
    try:
        # 获取人物信息
        person = get_person_by_id(person_id)
        if not person:
            raise HTTPException(status_code=404, detail=f"未找到ID为 {person_id} 的人物")

        # 构建提示词
        prompt = build_prompt(person, content_type)

        # 调用AI API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.OPENAI_API_BASE}/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": MODEL_NAME,
                    "messages": [
                        {
                            "role": "system",
                            "content": "你是一个专业的历史人物简历生成助手，擅长将历史人物的生平事迹转化为现代职场简历。你需要保持专业性，同时加入适当的创意元素。"
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                },
                timeout=30.0
            )
            response.raise_for_status()
            result = response.json()

        # 检查响应
        if not result.get("choices"):
            raise ValueError("AI API返回的响应格式不正确")

        content = result["choices"][0]["message"]["content"].strip()
        if not content:
            raise ValueError("AI生成的内容为空")

        # 保存到数据库
        save_ai_content(person_id, content_type, content)

        return {
            "status": "success",
            "content": content
        }

    except httpx.HTTPStatusError as e:
        print(f"AI API HTTP错误: {str(e)}")
        print(f"响应状态码: {e.response.status_code}")
        print(f"响应内容: {e.response.text}")
        raise HTTPException(
            status_code=500,
            detail=f"AI API调用失败: HTTP {e.response.status_code}"
        )

    except httpx.RequestError as e:
        print(f"AI API请求错误: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"AI API请求失败: {str(e)}"
        )

    except json.JSONDecodeError as e:
        print(f"AI API响应解析错误: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="AI API响应格式错误"
        )

    except ValueError as e:
        print(f"AI内容生成错误: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        print(f"AI内容生成时发生未知错误: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"生成失败: {str(e)}"
        )

@app.post("/api/person/{person_id}/ai-content")
async def generate_person_ai_content(
    person_id: int, 
    content_type: str = Query(..., description="内容类型: 'biography' 或 'resume'"),
    force_regenerate: bool = Query(False, description="是否强制重新生成")
):
    """生成历史人物的AI内容"""
    try:
        # 获取人物信息
        person = get_person_by_id(person_id)
        if not person:
            raise HTTPException(status_code=404, detail=f"未找到ID为{person_id}的人物")
        
        print(f"开始生成{content_type}，人物ID: {person_id}, 姓名: {person['basic_info']['name_chn']}")
        
        # 构建提示词
        prompt = build_prompt(person, content_type)
        
        # 调用AI API
        content = await call_ai_api(prompt)
        
        print(f"AI生成内容长度: {len(content)}")
        print(f"内容前100个字符: {content[:100]}")
        
        # 验证生成的内容
        if content_type == 'resume':
            try:
                # 尝试解析JSON
                print("尝试解析JSON...")
                # 清理内容，移除可能的markdown代码块标记和多余空白
                content = content.replace("```json", "").replace("```", "").strip()
                
                # 尝试找到JSON内容的开始和结束
                start_idx = content.find('{')
                end_idx = content.rfind('}')
                
                if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
                    print(f"找到JSON内容范围: {start_idx} - {end_idx}")
                    content = content[start_idx:end_idx+1]
                else:
                    print("未找到有效的JSON内容范围")
                    raise ValueError("未找到有效的JSON内容")
                
                # 解析JSON
                resume_data = json.loads(content)
                print("JSON解析成功")
                
                # 验证必要字段
                required_fields = ['modern_title', 'personal_branding', 'core_competencies', 
                                 'career_highlights', 'modern_achievements', 'leadership_style']
                for field in required_fields:
                    if field not in resume_data:
                        print(f"缺少必要字段: {field}")
                        raise ValueError(f"缺少必要字段: {field}")
                
                # 验证字段内容不为空
                if not resume_data['modern_title'].get('position') or not resume_data['personal_branding'].get('tagline'):
                    print("关键字段内容为空")
                    raise ValueError("关键字段内容为空")
                
                # 确保所有字符串都是简体中文
                resume_data = ensure_simplified_chinese(resume_data)
                
                # 如果验证通过，格式化JSON
                content = json.dumps(resume_data, ensure_ascii=False, indent=2)
                print("简历内容验证成功")
            except json.JSONDecodeError as e:
                print(f"JSON解析错误: {str(e)}")
                # 如果解析失败，使用备用模板
                print("使用备用模板")
                resume_data = create_backup_resume_template(person)
                content = json.dumps(resume_data, ensure_ascii=False, indent=2)
            except ValueError as e:
                print(f"简历内容验证失败: {str(e)}")
                # 如果验证失败，使用备用模板
                print(f"简历内容验证失败: {str(e)}，使用备用模板")
                resume_data = create_backup_resume_template(person)
                content = json.dumps(resume_data, ensure_ascii=False, indent=2)
        
        # 保存生成记录
        conn = get_boss_db_connection()
        try:
            # 插入生成记录
            cursor = conn.execute("""
                INSERT INTO ai_content_generations 
                (person_id, content_type, prompt, model_version, parameters)
                VALUES (?, ?, ?, ?, ?)
            """, (
                person_id,
                content_type,
                prompt,
                MODEL_NAME,
                json.dumps({"temperature": 0.7})
            ))
            generation_id = cursor.lastrowid
            
            # 根据内容类型保存到相应表
            if content_type == 'biography':
                conn.execute("""
                    INSERT INTO ai_biographies 
                    (person_id, generation_id, content, version, status)
                    VALUES (?, ?, ?, 1, 'draft')
                """, (person_id, generation_id, content))
            else:  # resume
                conn.execute("""
                    INSERT INTO ai_resumes 
                    (person_id, generation_id, template_id, content, version, status)
                    VALUES (?, ?, 1, ?, 1, 'draft')
                """, (person_id, generation_id, content))
            
            conn.commit()
            
            print(f"内容保存成功，生成ID: {generation_id}")
            
            return {
                "content": content,
                "generation_id": generation_id
            }
            
        except Exception as e:
            conn.rollback()
            print(f"保存AI内容时出错: {str(e)}")
            raise HTTPException(status_code=500, detail=f"保存AI内容时出错: {str(e)}")
        finally:
            conn.close()
            
    except Exception as e:
        print(f"生成AI内容时出错: {str(e)}")
        raise HTTPException(status_code=500, detail=f"生成AI内容时出错: {str(e)}")

def create_backup_resume_template(person: dict) -> dict:
    """创建备用简历模板，确保格式正确"""
    name = person['basic_info']['name_chn']
    dynasty = person['basic_info']['dynasty']
    gender = person['basic_info']['gender']
    birth_year = person['basic_info']['birth_year']
    death_year = person['basic_info']['death_year']
    
    # 根据朝代和性别确定现代职位
    position = "历史研究员"
    company = "历史研究所"
    industry = "文化研究"
    
    if dynasty == "唐":
        position = "文化创意总监"
        company = "大唐文化传媒有限公司"
        industry = "文化传媒"
    elif dynasty == "宋":
        position = "艺术总监"
        company = "宋韵艺术工作室"
        industry = "艺术设计"
    elif dynasty == "明":
        position = "战略顾问"
        company = "大明战略咨询公司"
        industry = "管理咨询"
    elif dynasty == "清":
        position = "文化传承专家"
        company = "大清文化传承中心"
        industry = "文化教育"
    
    if gender == "女":
        position = f"女性{position}"
    
    return {
        "modern_title": {
            "position": position,
            "company": company,
            "industry": industry
        },
        "personal_branding": {
            "tagline": f"{dynasty}朝{name}，{birth_year}-{death_year}",
            "summary": f"{name}，{dynasty}朝著名历史人物，生于{birth_year}年，卒于{death_year}年。"
        },
        "core_competencies": [
            {
                "skill": "历史研究",
                "description": "精通历史文献研究，能够从历史资料中提取有价值的信息"
            },
            {
                "skill": "文化传承",
                "description": "致力于传统文化的传承与创新，将历史智慧应用于现代"
            }
        ],
        "career_highlights": [
            {
                "period": f"{birth_year}-{death_year}",
                "title": position,
                "company": company,
                "achievement": f"作为{dynasty}朝重要历史人物，对历史发展产生了深远影响",
                "easter_egg": f"{name}的{position}之路"
            }
        ],
        "modern_achievements": [
            {
                "title": "历史贡献",
                "description": f"{name}在{dynasty}朝的历史贡献",
                "impact": "对后世产生了深远影响"
            }
        ],
        "leadership_style": {
            "style": "历史领导风格",
            "approach": "基于历史经验的管理方法",
            "philosophy": "传承历史智慧，创新现代管理"
        },
        "personal_interests": [
            {
                "interest": "历史研究",
                "description": "对历史文献和考古发现充满兴趣"
            }
        ],
        "easter_eggs": [
            {
                "type": "历史梗",
                "content": f"{name}的{dynasty}朝轶事",
                "icon": "<!-- 历史图标 -->"
            }
        ]
    }

def ensure_simplified_chinese(data):
    """确保所有字符串都是简体中文"""
    if isinstance(data, dict):
        return {k: ensure_simplified_chinese(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [ensure_simplified_chinese(item) for item in data]
    elif isinstance(data, str):
        # 这里可以添加繁简转换逻辑，如果需要的话
        # 目前只是确保字符串是有效的
        return data
    else:
        return data

@app.post("/api/person/{person_id}/ai-content/save")
def save_to_boss_db(
    person_id: int,
    content_type: str = Query(..., description="内容类型: 'biography' 或 'resume'"),
    request: ContentSaveRequest = Body(...)
):
    """保存AI内容到BOSS数据库"""
    try:
        conn = get_boss_db_connection()
        cursor = conn.cursor()
        
        # 更新内容状态为已发布
        if content_type == 'biography':
            # 获取最新的草稿版本
            draft = cursor.execute("""
                SELECT id, version FROM ai_biographies
                WHERE person_id = ? AND status = 'draft'
                ORDER BY version DESC LIMIT 1
            """, (person_id,)).fetchone()
            
            if draft:
                cursor.execute("""
                    UPDATE ai_biographies
                    SET content = ?, status = 'published', published_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (request.content, draft['id']))
            else:
                # 如果没有草稿，创建新记录
                cursor.execute("""
                    INSERT INTO ai_biographies 
                    (person_id, generation_id, content, version, status, published_at)
                    VALUES (?, 
                        (SELECT id FROM ai_content_generations 
                         WHERE person_id = ? AND content_type = 'biography' 
                         ORDER BY created_at DESC LIMIT 1),
                        ?, 1, 'published', CURRENT_TIMESTAMP)
                """, (person_id, person_id, request.content))
        else:  # resume
            # 获取最新的草稿版本
            draft = cursor.execute("""
                SELECT id, version FROM ai_resumes
                WHERE person_id = ? AND status = 'draft'
                ORDER BY version DESC LIMIT 1
            """, (person_id,)).fetchone()
            
            # 验证简历内容是否为有效的JSON
            try:
                resume_content = request.content
                if isinstance(resume_content, str):
                    resume_content = json.loads(resume_content)
                # 如果内容被包装在content字段中，提取出来
                if isinstance(resume_content, dict) and 'content' in resume_content:
                    resume_content = resume_content['content']
                # 验证必要字段
                required_fields = ['modern_title', 'personal_branding', 'core_competencies', 
                                 'career_highlights', 'modern_achievements', 'leadership_style']
                for field in required_fields:
                    if field not in resume_content:
                        raise ValueError(f"缺少必要字段: {field}")
                # 确保内容是有效的JSON字符串
                resume_content = json.dumps(resume_content, ensure_ascii=False)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="简历内容不是有效的JSON格式")
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))
            
            if draft:
                cursor.execute("""
                    UPDATE ai_resumes
                    SET content = ?, status = 'published', published_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (resume_content, draft['id']))
            else:
                # 如果没有草稿，创建新记录
                cursor.execute("""
                    INSERT INTO ai_resumes 
                    (person_id, generation_id, template_id, content, version, status, published_at)
                    VALUES (?, 
                        (SELECT id FROM ai_content_generations 
                         WHERE person_id = ? AND content_type = 'resume' 
                         ORDER BY created_at DESC LIMIT 1),
                        1, ?, 1, 'published', CURRENT_TIMESTAMP)
                """, (person_id, person_id, resume_content))
            
        conn.commit()
        return {"message": "内容保存成功"}
        
    except Exception as e:
        print(f"保存到BOSS数据库时出错: {str(e)}")
        traceback.print_exc()  # 打印详细的错误堆栈
        raise HTTPException(status_code=500, detail=f"保存到BOSS数据库时出错: {str(e)}")
    finally:
        conn.close()

async def call_ai_api(prompt: str) -> str:
    """调用AI API生成内容"""
    try:
        # 增加重试机制
        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                print(f"调用AI API (尝试 {retry_count+1}/{max_retries})...")
                
                # 对于简历类型，添加强制输出格式控制
                if "现代职场简历" in prompt:
                    print("检测到简历生成请求，添加强制输出格式控制")
                    # 在提示词末尾添加强制输出格式控制
                    prompt += "\n\n请严格按照以下格式输出，不要添加任何额外的文本或解释：\n```json\n{\n  \"modern_title\": {\n    \"position\": \"职位名称\",\n    \"company\": \"公司名称\",\n    \"industry\": \"行业\"\n  },\n  ...\n}\n```"
                
                response = await async_client.post(
                    "/v1/chat/completions",
                    json={
                        "model": MODEL_NAME,
                        "messages": [
                            {
                                "role": "system",
                                "content": "你是一个专业的历史人物内容生成助手。对于传记，你需要用严谨的史学笔法；对于简历，你需要将历史人物转化为有趣的现代职场人士，使用幽默和创意的方式展现。请确保生成的内容完整、有趣且符合要求。对于简历，你必须输出有效的JSON格式，不要添加任何额外的文本或解释。"
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.7,
                        "max_tokens": 2000
                    }
                )
                
                if response.status_code != 200:
                    print(f"API调用失败: {response.status_code}")
                    print(f"错误信息: {response.text}")
                    retry_count += 1
                    if retry_count == max_retries:
                        raise HTTPException(
                            status_code=500,
                            detail=f"AI API调用失败: HTTP {response.status_code}"
                        )
                    continue
                
                result = response.json()
                content = result["choices"][0]["message"]["content"].strip()
                
                print(f"API调用成功，返回内容长度: {len(content)}")
                
                # 验证生成的内容
                if not content or content.isspace():
                    print("生成的内容为空")
                    retry_count += 1
                    if retry_count == max_retries:
                        raise ValueError("AI生成的内容为空")
                    continue
                
                # 对于简历类型，尝试提取JSON部分
                if "现代职场简历" in prompt:
                    print("尝试提取JSON部分...")
                    # 查找JSON内容的开始和结束
                    start_idx = content.find('{')
                    end_idx = content.rfind('}')
                    
                    if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
                        print(f"找到JSON内容范围: {start_idx} - {end_idx}")
                        content = content[start_idx:end_idx+1]
                    else:
                        print("未找到有效的JSON内容范围")
                
                return content
                
            except httpx.RequestError as e:
                print(f"请求错误: {str(e)}")
                retry_count += 1
                if retry_count == max_retries:
                    raise
                continue
        
    except Exception as e:
        print(f"调用AI API时出错: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"调用AI API时出错: {str(e)}"
        )

@app.get("/api/recommended-resumes")
async def get_recommended_resumes():
    """获取推荐的历史人物简历"""
    try:
        # 获取最近生成的简历，使用DISTINCT确保每个person_id只返回一条记录
        query = """
            SELECT DISTINCT ar.person_id as id, ar.content
            FROM ai_resumes ar
            WHERE ar.status = 'published'
            ORDER BY ar.created_at DESC
            LIMIT 16
        """
        
        logger.info("Attempting to fetch recommended resumes")
        
        conn = get_boss_db_connection()
        try:
            cursor = conn.execute(query)
            rows = cursor.fetchall()
            logger.info(f"Found {len(rows)} recommended resumes")
            
            results = []
            for row in rows:
                try:
                    # 解析简历内容
                    resume_data = json.loads(row['content'])
                    
                    # 确保modern_title是对象
                    modern_title = resume_data.get('modern_title', {})
                    if isinstance(modern_title, str):
                        try:
                            modern_title = json.loads(modern_title)
                        except json.JSONDecodeError:
                            modern_title = {
                                'position': modern_title or '未知职位',
                                'company': '未知公司',
                                'industry': '未知行业'
                            }
                    
                    # 确保personal_branding是对象
                    personal_branding = resume_data.get('personal_branding', {})
                    if isinstance(personal_branding, str):
                        try:
                            personal_branding = json.loads(personal_branding)
                        except json.JSONDecodeError:
                            personal_branding = {
                                'tagline': personal_branding or '暂无标语',
                                'summary': '暂无简介'
                            }
                    
                    results.append({
                        'id': row['id'],
                        'name': resume_data.get('name', '未知姓名'),
                        'dynasty': resume_data.get('dynasty', '未知朝代'),
                        'modern_title': modern_title,
                        'personal_branding': personal_branding
                    })
                    logger.info(f"Successfully parsed resume for person {row['id']}")
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse resume content for person {row['id']}: {str(e)}")
                    # 使用默认值而不是跳过
                    results.append({
                        'id': row['id'],
                        'name': '未知姓名',
                        'dynasty': '未知朝代',
                        'modern_title': {
                            'position': '未知职位',
                            'company': '未知公司',
                            'industry': '未知行业'
                        },
                        'personal_branding': {
                            'tagline': '暂无标语',
                            'summary': '暂无简介'
                        }
                    })
                except Exception as e:
                    logger.error(f"Unexpected error processing resume for person {row['id']}: {str(e)}")
                    # 使用默认值而不是跳过
                    results.append({
                        'id': row['id'],
                        'name': '未知姓名',
                        'dynasty': '未知朝代',
                        'modern_title': {
                            'position': '未知职位',
                            'company': '未知公司',
                            'industry': '未知行业'
                        },
                        'personal_branding': {
                            'tagline': '暂无标语',
                            'summary': '暂无简介'
                        }
                    })
                    
            if not results:
                logger.warning("No valid resumes found")
                return []
                
            logger.info(f"Successfully processed {len(results)} resumes")
            return results
            
        except sqlite3.Error as e:
            logger.error(f"Database error while getting recommended resumes: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="数据库错误：获取推荐简历失败"
            )
        finally:
            conn.close()
            
    except Exception as e:
        logger.error(f"Error getting recommended resumes: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"获取推荐简历失败: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)