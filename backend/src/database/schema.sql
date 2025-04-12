-- AI 生成的人物内容表
CREATE TABLE IF NOT EXISTS AI_GENERATED_CONTENT (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER NOT NULL,
    content_type TEXT NOT NULL, -- 'biography' 或 'resume'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES BIOG_MAIN(c_personid)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_ai_content_person_id ON AI_GENERATED_CONTENT(person_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_type ON AI_GENERATED_CONTENT(content_type); 