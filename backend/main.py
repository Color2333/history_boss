from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json
from typing import List, Dict, Any, Optional
import os
import httpx
import traceback
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str = "sk-q9H8wqyhhHxcut658fFfE242Db5b4071B653E5Af3e61FfE3"
    OPENAI_API_BASE: str = "https://api.oaipro.com"

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

def get_db_connection():
    """创建数据库连接并设置返回行为为字典"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# 确保 AI_GENERATED_CONTENT 表存在
def init_ai_content_table():
    conn = get_db_connection()
    try:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS AI_GENERATED_CONTENT (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            person_id INTEGER NOT NULL,
            content_type TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.commit()
    except Exception as e:
        print(f"Error initializing AI_GENERATED_CONTENT table: {e}")
    finally:
        conn.close()

# 初始化表
init_ai_content_table()

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
    """获取历史人物的 AI 生成内容"""
    try:
        conn = get_db_connection()
        query = """
        SELECT content
        FROM AI_GENERATED_CONTENT
        WHERE person_id = ? AND content_type = ?
        ORDER BY updated_at DESC
        LIMIT 1
        """
        
        row = conn.execute(query, (person_id, content_type)).fetchone()
        conn.close()
        
        if not row:
            raise HTTPException(status_code=404, detail=f"未找到ID为{person_id}的人物的{content_type}内容")
            
        return {"content": row["content"]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")

def build_prompt(person: dict, content_type: str) -> str:
    """
    构建AI提示词
    :param person: 人物信息字典
    :param content_type: 内容类型 ('biography' 或 'resume')
    :return: 构建好的提示词
    """
    # 基本信息
    basic_info = person.get('basic_info', {})
    basic_info_text = f"""
姓名：{basic_info.get('name_chn', '未知')}
朝代：{basic_info.get('dynasty', '未知')}
生卒年：{basic_info.get('birth_year', '未知')} - {basic_info.get('death_year', '未知')}
"""

    # 主要经历
    offices = person.get('offices', [])
    office_text = "\n主要经历：\n"
    if offices:
        for office in offices:
            office_text += f"- {office.get('first_year', '')} {office.get('office_name', '')}\n"
    else:
        office_text += "暂无记录\n"

    # 成就
    achievements = person.get('achievements', [])
    achievement_text = "\n主要成就：\n"
    if achievements:
        for achievement in achievements:
            achievement_text += f"- {achievement}\n"
    else:
        achievement_text += "暂无记录\n"

    # 考试记录
    entries = person.get('entries', [])
    entry_text = "\n考试记录：\n"
    if entries:
        for entry in entries:
            entry_text += f"- {entry.get('year', '')} {entry.get('entry_desc', '')}\n"
    else:
        entry_text += "暂无记录\n"

    # 社会地位
    statuses = person.get('statuses', [])
    status_text = "\n社会地位：\n"
    if statuses:
        for status in statuses:
            status_text += f"- {status.get('status_desc', '')}\n"
    else:
        status_text += "暂无记录\n"

    # 相关文本
    texts = person.get('texts', [])
    text_text = "\n相关文本：\n"
    if texts:
        for text in texts:
            text_text += f"- {text.get('title', '')}: {text.get('content', '')[:100]}...\n"
    else:
        text_text += "暂无记录\n"

    # 根据内容类型构建不同的提示词
    if content_type == 'biography':
        return f"""请根据以下历史人物的信息，撰写一篇简短的传记。要求：
1. 语言精炼，重点突出
2. 突出人物的性格特点和重要事迹
3. 结合历史背景进行分析
4. 适当引用史料佐证
5. 字数严格控制在200字以内

{basic_info_text}
{office_text}
{achievement_text}
{entry_text}
{status_text}
{text_text}
"""

    elif content_type == 'resume':
        return f"""请根据以下历史人物的信息，撰写一份简短的现代简历。要求：
1. 采用现代简历格式
2. 突出关键成就和能力
3. 使用现代职场语言
4. 包含教育背景、工作经历、主要成就等部分
5. 字数严格控制在200字以内

{basic_info_text}
{office_text}
{achievement_text}
{entry_text}
{status_text}
{text_text}
"""

    else:
        raise ValueError(f"不支持的内容类型: {content_type}")

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
    """生成历史人物的 AI 内容"""
    conn = None
    try:
        conn = get_db_connection()
        
        # 检查是否已存在内容且不需要重新生成
        if not force_regenerate:
            existing = conn.execute(
                "SELECT content FROM AI_GENERATED_CONTENT WHERE person_id = ? AND content_type = ? ORDER BY updated_at DESC LIMIT 1",
                (person_id, content_type)
            ).fetchone()
            
            if existing:
                return {"content": existing["content"]}
        
        # 获取人物信息
        person_data = get_person_by_id(person_id)
        if not person_data:
            raise HTTPException(status_code=404, detail=f"未找到ID为{person_id}的人物")
        
        # 使用 AI 生成内容
        generated_content = await generate_ai_content(person_id, content_type)
        
        # 保存生成的内容到数据库
        conn.execute(
            """
            INSERT INTO AI_GENERATED_CONTENT (person_id, content_type, content)
            VALUES (?, ?, ?)
            """,
            (person_id, content_type, generated_content["content"])
        )
        conn.commit()
        
        return generated_content
    
    except Exception as e:
        print(f"Error in generate_person_ai_content: {str(e)}")
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"生成内容失败: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.post("/api/admin/save-to-boss-db")
def save_to_boss_db(
    person_id: int = Query(..., description="人物ID"),
    content_type: str = Query(..., description="内容类型: 'biography' 或 'resume'"),
    content: str = Query(..., description="内容")
):
    """将AI生成的内容保存到boss.db数据库"""
    try:
        # 连接到boss.db数据库
        boss_db_path = "data/boss.db"
        
        # 检查数据库文件是否存在，如果不存在则创建
        if not os.path.exists(boss_db_path):
            conn = sqlite3.connect(boss_db_path)
            conn.execute("""
            CREATE TABLE IF NOT EXISTS AI_GENERATED_CONTENT (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                person_id INTEGER NOT NULL,
                content_type TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)
            conn.commit()
            conn.close()
        
        # 连接到boss.db数据库
        conn = sqlite3.connect(boss_db_path)
        
        # 检查是否已存在内容
        existing = conn.execute(
            "SELECT id FROM AI_GENERATED_CONTENT WHERE person_id = ? AND content_type = ?",
            (person_id, content_type)
        ).fetchone()
        
        if existing:
            # 更新现有内容
            conn.execute(
                """
                UPDATE AI_GENERATED_CONTENT 
                SET content = ?, updated_at = CURRENT_TIMESTAMP
                WHERE person_id = ? AND content_type = ?
                """,
                (content, person_id, content_type)
            )
        else:
            # 插入新内容
            conn.execute(
                """
                INSERT INTO AI_GENERATED_CONTENT (person_id, content_type, content)
                VALUES (?, ?, ?)
                """,
                (person_id, content_type, content)
            )
        
        conn.commit()
        conn.close()
        
        return {"message": "内容已成功保存到boss.db数据库"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"保存到boss.db失败: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)