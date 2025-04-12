# 历史人物网站技术设计文档

## 1. 系统架构

### 1.1 总体架构

本系统采用前后端分离的架构，基于以下核心技术栈：

- **前端**: React
- **后端**: FastAPI
- **数据库**: MySQL
- **部署**: Docker

系统整体架构如下：

```
+---------------+      +----------------+      +---------------+
|               |      |                |      |               |
|  Web前端      | <--> |  后端API服务   | <--> |  MySQL数据库  |
|  (React)      |      |  (FastAPI)     |      |               |
|               |      |                |      |               |
+---------------+      +----------------+      +---------------+
                              ^
                              |
                              v
                       +----------------+
                       |                |
                       |  外部AI服务    |
                       |  (Claude API等) |
                       |                |
                       +----------------+
```

### 1.2 技术选型理由

1. **React**:
   - 组件化开发，易于维护和扩展
   - 丰富的生态系统和组件库
   - 高性能的虚拟DOM渲染
   - 支持TypeScript，提高代码质量

2. **FastAPI**:
   - 基于Python，开发效率高
   - 自动生成API文档
   - 异步处理能力强
   - 内置数据验证功能

3. **MySQL**:
   - 稳定可靠的关系型数据库
   - 适合存储结构化的历史人物数据
   - 良好的查询性能
   - 丰富的索引和优化选项

4. **Docker**:
   - 环境一致性保证
   - 简化部署和扩展流程
   - 隔离应用依赖
   - 便于CI/CD集成

## 2. 前端技术设计

### 2.1 技术栈详情

- **框架**: React + TypeScript
- **状态管理**: Redux Toolkit
- **路由**: React Router
- **UI组件库**: Ant Design
- **HTTP客户端**: Axios
- **可视化库**:
  - ECharts(图表可视化)
  - react-force-graph(关系网络)
  - react-leaflet(地图展示)
- **构建工具**: Vite

### 2.2 前端架构

```
src/
├── api/                # API调用封装
├── assets/             # 静态资源
├── components/         # 通用组件
│   ├── common/         # 基础UI组件
│   ├── layout/         # 布局组件
│   ├── charts/         # 图表组件
│   └── network/        # 关系网络组件
├── hooks/              # 自定义Hooks
├── pages/              # 页面组件
│   ├── Home/           # 首页
│   ├── PersonDetail/   # 人物详情
│   ├── NetworkView/    # 关系网络页
│   ├── TimeMap/        # 时空定位页
│   └── UserCenter/     # 用户中心
├── store/              # Redux状态管理
│   ├── slices/         # Redux切片
│   └── index.ts        # Store配置
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
└── App.tsx             # 应用入口
```

### 2.3 关键组件设计

#### 2.3.1 关系网络组件

```tsx
// src/components/network/RelationshipNetwork.tsx
import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { fetchPersonRelationships } from '../../api/person';

interface Node {
  id: string;
  name: string;
  category: string;
  value: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

interface RelationshipNetworkProps {
  personId: number;
  depth?: number;
  relationTypes?: string[];
}

const RelationshipNetwork: React.FC<RelationshipNetworkProps> = ({
  personId,
  depth = 1,
  relationTypes = []
}) => {
  const [graphData, setGraphData] = useState<{ nodes: Node[], links: Link[] }>({
    nodes: [],
    links: []
  });
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPersonRelationships(personId, depth, relationTypes);
        setGraphData(data);
      } catch (error) {
        console.error('Failed to load relationship data:', error);
      }
    };
    
    loadData();
  }, [personId, depth, relationTypes]);
  
  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeColor={node => {
          switch(node.category) {
            case '师承关系': return '#ff6b6b';
            case '亲属关系': return '#48dbfb';
            case '政治关系': return '#1dd1a1';
            default: return '#576574';
          }
        }}
        linkDirectionalArrowLength={3.5}
        linkLabel="type"
        onNodeClick={node => {
          // 节点点击处理逻辑
        }}
      />
    </div>
  );
};

export default RelationshipNetwork;
```

#### 2.3.2 现代简历展示组件

```tsx
// src/components/resume/ModernResume.tsx
import React, { useEffect, useState } from 'react';
import { Card, Skeleton, Button, message } from 'antd';
import { generateModernResume } from '../../api/person';

interface ModernResumeProps {
  personId: number;
}

const ModernResume: React.FC<ModernResumeProps> = ({ personId }) => {
  const [resumeHtml, setResumeHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const generateResume = async () => {
    setLoading(true);
    try {
      const { html } = await generateModernResume(personId);
      setResumeHtml(html);
    } catch (error) {
      message.error('生成简历失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (personId) {
      generateResume();
    }
  }, [personId]);
  
  return (
    <Card 
      title="现代风格简历" 
      extra={<Button onClick={generateResume}>重新生成</Button>}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <div 
          className="resume-container"
          dangerouslySetInnerHTML={{ __html: resumeHtml }} 
        />
      )}
    </Card>
  );
};

export default ModernResume;
```

## 3. 后端技术设计

### 3.1 技术栈详情

- **框架**: FastAPI
- **ORM**: SQLAlchemy
- **数据验证**: Pydantic
- **认证**: OAuth2 + JWT
- **AI集成**: Anthropic Claude API
- **数据处理**: Pandas, NetworkX
- **缓存**: Redis
- **文档**: Swagger UI(自动生成)

### 3.2 后端架构

```
app/
├── api/                # API路由
│   ├── endpoints/      # API端点
│   └── deps.py         # 依赖注入
├── core/               # 核心配置
│   ├── config.py       # 环境配置
│   ├── security.py     # 安全相关
│   └── logging.py      # 日志配置
├── db/                 # 数据库
│   ├── base.py         # 基础模型
│   ├── session.py      # 数据库会话
│   └── init_db.py      # 数据库初始化
├── models/             # 数据模型
│   ├── person.py       # 人物模型
│   ├── relationship.py # 关系模型
│   └── user.py         # 用户模型
├── schemas/            # Pydantic模式
│   └── ...             # 各类数据结构定义
├── services/           # 业务逻辑
│   ├── person.py       # 人物服务
│   ├── relationship.py # 关系服务
│   ├── ai_service.py   # AI服务
│   └── user.py         # 用户服务
├── utils/              # 工具函数
├── main.py             # 应用入口
└── alembic/            # 数据库迁移
```

### 3.3 API设计

#### 3.3.1 人物信息API

```python
# app/api/endpoints/person.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api import deps
from app.schemas.person import Person, PersonCreate, PersonUpdate
from app.services.person import person_service

router = APIRouter()

@router.get("/{person_id}", response_model=Person)
def get_person(
    person_id: int,
    db: Session = Depends(deps.get_db)
):
    """获取单个历史人物详情"""
    person = person_service.get(db, person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person

@router.get("/", response_model=List[Person])
def list_persons(
    skip: int = 0,
    limit: int = 100,
    name: Optional[str] = None,
    dynasty_id: Optional[int] = None,
    db: Session = Depends(deps.get_db)
):
    """获取历史人物列表，支持筛选"""
    return person_service.get_multi(
        db, skip=skip, limit=limit, name=name, dynasty_id=dynasty_id
    )

@router.get("/{person_id}/relationships", response_model=dict)
def get_person_relationships(
    person_id: int,
    depth: int = 1,
    relation_types: Optional[List[str]] = None,
    db: Session = Depends(deps.get_db)
):
    """获取人物关系网络数据"""
    return person_service.get_relationships(
        db, person_id, depth, relation_types
    )

@router.post("/{person_id}/modern_resume")
def generate_modern_resume(
    person_id: int,
    db: Session = Depends(deps.get_db)
):
    """生成现代风格简历"""
    result = person_service.generate_modern_resume(db, person_id)
    return {"html": result}
```

#### 3.3.2 聊天机器人API

```python
# app/api/endpoints/chat.py
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List

from app.api import deps
from app.schemas.chat import ChatMessage, ChatResponse
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/{person_id}", response_model=ChatResponse)
async def chat_with_person(
    person_id: int,
    message: str = Body(..., embed=True),
    history: List[dict] = Body(default=[]),
    db: Session = Depends(deps.get_db)
):
    """与历史人物进行对话"""
    try:
        result = await ai_service.chat_with_historical_figure(
            db, person_id, message, history
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 3.4 核心服务实现

#### 3.4.1 人物关系服务

```python
# app/services/relationship.py
from sqlalchemy.orm import Session
import networkx as nx
from typing import List, Optional

from app.models.relationship import Relationship
from app.models.person import Person

class RelationshipService:
    def build_relationship_network(
        self,
        db: Session,
        person_id: int,
        depth: int = 1,
        relation_types: Optional[List[str]] = None
    ):
        """构建人物关系网络"""
        # 初始化图
        G = nx.Graph()
        
        # 获取中心人物
        center_person = db.query(Person).filter(Person.id == person_id).first()
        if not center_person:
            return {"nodes": [], "links": []}
        
        # 添加中心节点
        G.add_node(
            str(center_person.id),
            name=center_person.name,
            dynasty=center_person.dynasty.name if center_person.dynasty else "",
            category="中心人物",
            value=30  # 中心节点更大
        )
        
        # 处理查询条件
        relation_query = db.query(Relationship)
        if relation_types:
            relation_query = relation_query.filter(Relationship.relationship_type.in_(relation_types))
        
        # 递归获取关系
        processed_ids = set([person_id])
        self._add_relationships_recursive(
            db, G, person_id, processed_ids, relation_query, depth, 1
        )
        
        # 转换为前端格式
        return {
            "nodes": [
                {
                    "id": node_id,
                    "name": data.get("name", ""),
                    "dynasty": data.get("dynasty", ""),
                    "category": data.get("category", "其他"),
                    "value": data.get("value", 10)
                }
                for node_id, data in G.nodes(data=True)
            ],
            "links": [
                {
                    "source": u,
                    "target": v,
                    "type": d.get("type", "关系")
                }
                for u, v, d in G.edges(data=True)
            ]
        }
    
    def _add_relationships_recursive(
        self,
        db: Session,
        G: nx.Graph,
        person_id: int,
        processed_ids: set,
        relation_query,
        max_depth: int,
        current_depth: int
    ):
        """递归添加关系节点和边"""
        if current_depth > max_depth:
            return
        
        # 获取当前人物的所有关系
        relations = relation_query.filter(
            (Relationship.person1_id == person_id) | 
            (Relationship.person2_id == person_id)
        ).all()
        
        for relation in relations:
            related_id = relation.person2_id if relation.person1_id == person_id else relation.person1_id
            
            # 获取相关人物信息
            related_person = db.query(Person).filter(Person.id == related_id).first()
            if not related_person:
                continue
            
            # 添加节点
            if str(related_id) not in G.nodes():
                G.add_node(
                    str(related_id),
                    name=related_person.name,
                    dynasty=related_person.dynasty