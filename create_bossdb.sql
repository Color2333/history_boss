-- AI 生成记录表
CREATE TABLE IF NOT EXISTS ai_content_generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER NOT NULL,
    content_type VARCHAR(20) NOT NULL,  -- 'biography' or 'resume'
    prompt TEXT NOT NULL,               -- 生成提示词
    model_version VARCHAR(50) NOT NULL, -- AI模型版本
    parameters JSON,                    -- 生成参数
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AI 传记表
CREATE TABLE IF NOT EXISTS ai_biographies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER NOT NULL,
    generation_id INTEGER NOT NULL,     -- 关联生成记录
    content TEXT NOT NULL,
    version INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft/published/archived
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    FOREIGN KEY (generation_id) REFERENCES ai_content_generations(id)
);

-- AI 简历表
CREATE TABLE IF NOT EXISTS ai_resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER NOT NULL,
    generation_id INTEGER NOT NULL,     -- 关联生成记录
    template_id INTEGER NOT NULL,
    content JSON NOT NULL,              -- 结构化数据
    version INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    FOREIGN KEY (generation_id) REFERENCES ai_content_generations(id)
);

-- 简历模板表
CREATE TABLE IF NOT EXISTS resume_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    structure JSON NOT NULL,  -- 定义简历结构
    style_config JSON,       -- UI样式配置
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 心愿单表
CREATE TABLE IF NOT EXISTS wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_name VARCHAR(100) NOT NULL,
    dynasty VARCHAR(50),
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending/approved/rejected/completed
    votes INTEGER DEFAULT 0,
    priority INTEGER DEFAULT 0,
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 热搜关键词表
CREATE TABLE IF NOT EXISTS trending_keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword VARCHAR(100) NOT NULL,
    search_count INTEGER DEFAULT 0,
    first_searched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_searched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_trending BOOLEAN DEFAULT false,
    category VARCHAR(50),              -- person/dynasty/event等分类
    related_person_id INTEGER          -- 关联的历史人物ID
);

-- 搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword VARCHAR(100) NOT NULL,
    searched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    result_count INTEGER,
    ip_address VARCHAR(50)             -- 使用IP地址代替用户ID
);

-- 插入默认简历模板
INSERT INTO resume_templates (name, description, structure, style_config) VALUES (
    '现代职场精英模板',
    '将历史人物转化为现代职场精英的趣味简历模板',
    '{
        "sections": [
            {
                "id": "modern_title",
                "title": "现代职位",
                "type": "text",
                "description": "将历史身份转化为现代职位（如：皇帝→CEO）"
            },
            {
                "id": "personal_branding",
                "title": "个人品牌",
                "type": "text",
                "description": "现代职业身份下的个人品牌定位"
            },
            {
                "id": "core_competencies",
                "title": "核心能力",
                "type": "list",
                "description": "将历史成就转化为现代职场技能"
            },
            {
                "id": "career_highlights",
                "title": "职业亮点",
                "type": "timeline",
                "description": "重要历史事件转化为职场成就"
            },
            {
                "id": "modern_achievements",
                "title": "现代成就",
                "type": "list",
                "description": "历史成就的现代诠释"
            },
            {
                "id": "leadership_style",
                "title": "领导风格",
                "type": "text",
                "description": "现代管理风格的描述"
            },
            {
                "id": "personal_interests",
                "title": "个人兴趣",
                "type": "text",
                "description": "历史特征的现代趣味转化"
            },
            {
                "id": "easter_eggs",
                "title": "特别备注",
                "type": "text",
                "description": "历史梗的现代职场诠释"
            }
        ]
    }',
    '{
        "theme": "modern-elite",
        "layout": "single-column",
        "typography": {
            "font_family": "system-ui",
            "heading_size": "large",
            "text_size": "medium"
        },
        "style_elements": {
            "modern_icons": true,
            "easter_egg_highlight": true,
            "professional_tone": true
        }
    }'
);