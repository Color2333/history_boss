# 历史人物查询系统 (History Boss)

一个基于 CBDB（中国历代人物传记数据库）的历史人物查询与展示系统，结合 AI 技术为历史人物生成现代风格的传记和简历。

![项目标志](frontend/public/vite.svg)

## 项目概述

历史人物查询系统（History Boss）是一个综合性的历史人物信息平台，致力于以现代化的方式展示历史人物信息。系统基于 CBDB 数据库，
通过 FastAPI 后端和 React 前端，为用户提供历史人物的信息检索、可视化展示、以及基于 AI 生成的个性化内容。

### 主要功能

- **历史人物检索**：通过姓名、朝代、年份等多维度搜索历史人物
- **详细人物信息**：展示历史人物的基本信息、生平事迹、社会关系、官职信息等
- **社会关系网络**：可视化展示历史人物之间的社会关系网络
- **活动轨迹地图**：在地图上展示历史人物的活动轨迹
- **AI 生成内容**：
  - 传记生成：自动生成严谨的历史人物传记
  - 现代简历：将历史人物以幽默创意的方式转化为现代职场人物的简历
- **管理后台**：提供内容管理和发布功能

## 技术架构

### 前端技术栈

- **框架**：React 18 + TypeScript 5
- **UI 组件**：Ant Design 5.0+
- **路由**：React Router v6
- **HTTP 客户端**：Axios
- **地图组件**：AMap (高德地图) 2.0
- **构建工具**：Vite 4.0+
- **状态管理**：React Context API

### 后端技术栈

- **框架**：FastAPI 0.110.0 (Python 3.9+)
- **数据库**：SQLite (CBDB + boss.db)
- **AI 生成**：OpenAI API (GPT-4)
- **HTTP 客户端**：httpx 0.27.0
- **环境变量**：python-dotenv 1.0.1

## 快速开始

### 前提条件

- Python 3.9+
- Node.js 16+
- 访问 CBDB 数据库的权限
- OpenAI API 密钥（用于 AI 内容生成）

### 安装步骤

#### 1. 克隆代码库

```bash
git clone https://github.com/your-username/history-boss.git
cd history-boss
```

#### 2. 设置后端

```bash
cd backend
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑.env文件，填入您的OpenAI API密钥
# OPENAI_API_KEY=your_api_key_here

# 配置数据库
# 将 CBDB 数据库文件移至 data/data.db
# 创建 boss 数据库
sqlite3 data/boss.db < create_bossdb.sql

# 启动后端服务
python main.py
```

#### 3. 设置前端

```bash
cd frontend
npm install
npm run dev
```

#### 4. 访问系统

- 前端界面：http://localhost:5173
- 后端 API：http://localhost:8000
- 后台管理：http://localhost:5173/admin (初始登录无需密码)

## 系统模块

### 1. 用户界面

- **首页**：展示系统介绍、热门人物和最新生成的简历
- **搜索页**：提供多条件人物搜索，支持按朝代、年份筛选
- **人物详情页**：展示人物完整信息，包括基本资料、社会关系、官职信息等
- **社会关系网络**：交互式可视化展示人物的社会关系网络
- **活动轨迹地图**：在高德地图上展示人物一生的活动轨迹
- **AI 传记页面**：展示 AI 生成的传记内容
- **AI 简历页面**：以现代简历形式展示历史人物

### 2. 管理后台

- **仪表板**：概览系统数据和使用统计
- **AI 内容管理**：可以按人物 ID 搜索并生成 AI 内容
- **AI 内容生成**：支持传记和简历两种类型的内容生成
- **内容审核与发布**：审核 AI 生成的内容并发布到前台展示

### 3. API 接口

#### 基础数据接口

- `GET /api/person/{id}` - 获取人物详细信息
- `GET /api/search` - 搜索历史人物
- `GET /api/dynasties` - 获取朝代信息
- `GET /api/person/{id}/activities` - 获取活动轨迹

#### AI 内容接口

- `GET /api/person/{id}/ai-content` - 获取已生成的 AI 内容
- `POST /api/person/{id}/ai-content` - 生成新的 AI 内容
- `POST /api/person/{id}/ai-content/save` - 保存并发布 AI 内容

#### 推荐内容接口

- `GET /api/recommended-resumes` - 获取推荐的 AI 简历

## 数据库结构

系统使用两个主要数据库：

### 1. data.db (CBDB)

包含历史人物的基本资料，包括：

- **BIOG_MAIN**: 人物基本信息
- **ALTNAME_DATA**: 人物别名信息
- **KIN_DATA**: 亲属关系
- **ASSOC_DATA**: 社会关系
- **BIOG_ADDR_DATA**: 地址信息
- **POSTED_TO_OFFICE_DATA**: 官职信息
- **ENTRY_DATA**: 入仕信息
- **STATUS_DATA**: 社会地位
- **BIOG_TEXT_DATA**: 著作信息
- **DYNASTIES**: 朝代信息

### 2. boss.db

存储系统生成的内容和配置：

- **ai_content_generations**: AI 内容生成记录
- **ai_biographies**: AI 生成的传记内容
- **ai_resumes**: AI 生成的简历内容
- **resume_templates**: 简历模板配置
- **ai_content**: 旧版 AI 内容存储表(兼容用)

## AI 内容生成

### 传记生成

系统会根据历史人物的基本信息、生平事迹、社会关系等，生成一篇严谨的传记。传记内容特点：

- 使用严谨的史学笔法
- 按时间顺序展开叙述
- 突出历史贡献和重要事件
- 客观评价历史功过

### 简历生成

系统会将历史人物的信息转化为幽默有趣的现代职场简历。简历内容特点：

- 将历史身份转化为现代职位（如皇帝 →CEO）
- 使用现代职场术语描述历史事件
- 包含有趣的历史梗和双关语
- 保持 JSON 格式，支持结构化展示

## 环境变量配置

为了保护 API 密钥安全，系统使用环境变量进行配置。创建`.env`文件(参考`.env.example`)，填入以下信息：

```
# API配置
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE=https://api.oaipro.com

# 模型配置
MODEL_NAME=gpt-4-turbo
```

## 开发指南

### 添加新功能

1. 在 `backend/main.py` 中添加新 API 端点
2. 在 `frontend/src/services/api.ts` 中添加 API 调用方法
3. 创建新的前端组件
4. 在 `App.tsx` 中添加路由

### 修改数据模型

1. 更新 `backend/main.py` 中的数据库操作函数
2. 修改 `frontend/src/types` 中的类型定义

### 自定义 AI 生成模板

1. 修改 `main.py` 中的 `build_prompt` 函数
2. 调整提示词模板以获得不同风格的输出
3. 适当调整参数 (temperature 等) 以控制创意水平

## 部署指南

### 后端部署

推荐使用 uvicorn 和 gunicorn 进行部署：

```bash
pip install gunicorn
gunicorn main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 --workers 4
```

### 前端部署

构建静态文件并使用 Nginx 部署：

```bash
cd frontend
npm run build
# 将dist目录下的文件部署到Web服务器
```

## 常见问题解决

### API 密钥相关

如果遇到 API 密钥无效的错误，请检查：

1. `.env` 文件中的密钥是否正确
2. API 基础 URL 是否正确
3. 密钥是否有足够的配额

### 数据库相关

如果遇到数据库问题，请尝试：

1. 确认数据库文件路径正确
2. 执行 `create_bossdb.sql` 重新初始化 boss 数据库
3. 检查文件权限是否正确

## 贡献指南

欢迎所有形式的贡献，包括功能请求、错误报告和代码提交。

1. Fork 代码库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 致谢

- [CBDB 项目](https://projects.iq.harvard.edu/cbdb) - 提供历史人物数据库
- [OpenAI](https://openai.com/) - 提供 AI 生成技术
- [FastAPI](https://fastapi.tiangolo.com/) - 高性能 API 框架
- [React](https://reactjs.org/) & [Ant Design](https://ant.design/) - 前端框架与组件库
- [高德地图](https://lbs.amap.com/) - 提供地图服务
- 所有贡献者和测试用户

## 联系方式

项目维护者 - youremail@example.com

项目链接: [https://github.com/your-username/history-boss](https://github.com/your-username/history-boss)

## 更新日志

### v1.1.0 (2025-05-08)

- 添加环境变量支持，提高 API 密钥安全性
- 增强简历内容验证和错误处理
- 优化 AI 内容生成流程，改进提示词模板
- 修复了简历显示时的 JSON 解析问题

### v1.0.0 (2025-04-15)

- 初始版本发布
- 基础人物搜索与显示功能
- AI 传记与简历生成功能
- 社会关系网络与活动轨迹地图
