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

def build_prompt(person: dict, content_type: str) -> str:
    """
    构建AI提示词
    :param person: 人物信息
    :param content_type: 内容类型 ('biography' 或 'resume')
    :return: 提示词
    """
    basic_info = person.get('basic_info', {})
    name = basic_info.get('name_chn', '')
    dynasty = basic_info.get('dynasty', '')
    birth_year = basic_info.get('birth_year', '')
    death_year = basic_info.get('death_year', '')
    gender = basic_info.get('gender', '')
    
    # 获取生平事件
    events = []
    for event in person.get('events', []):
        year = event.get('year', '')
        desc = event.get('event_desc', '')
        if year and desc:
            events.append(f"{year}年：{desc}")
    
    # 获取社会关系
    relationships = []
    for rel in person.get('social_relations', []):
        rel_type = rel.get('relation_type', '')
        rel_name = rel.get('name_chn', '')
        if rel_type and rel_name:
            relationships.append(f"{rel_type}：{rel_name}")
    
    # 获取著作
    works = []
    for text in person.get('texts', []):
        title = text.get('title', '')
        if title:
            works.append(title)
    
    if content_type == 'biography':
        return f"""请为以下历史人物撰写一篇简短的传记（不超过200字）：

姓名：{name}
朝代：{dynasty}
生卒年：{birth_year}-{death_year}
性别：{gender}

生平事件：
{chr(10).join(events)}

社会关系：
{chr(10).join(relationships)}

著作：
{chr(10).join(works)}

要求：
1. 使用现代白话文
2. 突出重要事迹和贡献
3. 语言简洁流畅
4. 避免使用过于口语化的表达
5. 保持客观中立的语气
6. 不要使用HTML标签
7. 使用半角标点符号
8. 每个段落之间用换行符分隔"""
    else:  # resume
        return f"""请为以下历史人物制作一份现代简历，以JSON格式返回（不超过200字）：

姓名：{name}
朝代：{dynasty}
生卒年：{birth_year}-{death_year}
性别：{gender}

生平事件：
{chr(10).join(events)}

社会关系：
{chr(10).join(relationships)}

著作：
{chr(10).join(works)}

要求：
1. 返回格式必须是合法的JSON
2. JSON结构如下：
{{
    "basic_info": {{
        "name": "姓名",
        "dynasty": "朝代",
        "birth_death": "生卒年",
        "gender": "性别"
    }},
    "education": [
        {{
            "year": "年份",
            "type": "教育类型",
            "description": "详细描述"
        }}
    ],
    "work_experience": [
        {{
            "period": "时间段",
            "position": "职位",
            "description": "工作内容"
        }}
    ],
    "achievements": [
        "成就1",
        "成就2"
    ],
    "skills": [
        "技能1",
        "技能2"
    ]
}}
3. 使用现代职业术语
4. 突出管理能力和领导才能
5. 语言简洁专业
6. 确保JSON格式正确，可以被解析"""

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
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "你是一个专业的历史人物传记和现代简历撰写专家。"},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 500,  # 限制token数量以确保输出简短
                    "temperature": 0.7
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
        
        # 构建提示词
        prompt = build_prompt(person, content_type)
        
        # 调用AI API
        content = await call_ai_api(prompt)
        
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
                "gpt-4",  # 当前使用的模型版本
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
                """, (person_id, generation_id, json.dumps({"content": content})))
            
            conn.commit()
            
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
            
            if draft:
                cursor.execute("""
                    UPDATE ai_resumes
                    SET content = ?, status = 'published', published_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (json.dumps({"content": request.content}), draft['id']))
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
                """, (person_id, person_id, json.dumps({"content": request.content})))
            
        conn.commit()
        return {"message": "内容保存成功"}
        
    except Exception as e:
        print(f"保存到BOSS数据库时出错: {str(e)}")
        traceback.print_exc()  # 打印详细的错误堆栈
        raise HTTPException(status_code=500, detail=f"保存到BOSS数据库时出错: {str(e)}")
    finally:
        conn.close()

async def call_ai_api(prompt: str) -> str:
    """
    调用AI API生成内容
    :param prompt: 提示词
    :return: 生成的内容
    """
    try:
        response = await async_client.post(
            "/v1/chat/completions",
            json={
                "model": "gpt-4",
                "messages": [
                    {"role": "system", "content": "你是一个专业的历史人物传记和现代简历撰写专家。"},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500,  # 限制token数量以确保输出简短
                "temperature": 0.7
            }
        )
        response.raise_for_status()
        result = response.json()

        # 检查响应
        if not result.get("choices"):
            raise ValueError("AI API返回的响应格式不正确")

        content = result["choices"][0]["message"]["content"].strip()
        if not content:
            raise ValueError("AI生成的内容为空")

        return content

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)