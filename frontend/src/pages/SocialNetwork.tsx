import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Card, Spin, Typography, Button, message, Row, Col, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import { api } from '../services/api';
import { Person, KinRelation, SocialRelation } from '../types';

const { Content } = Layout;
const { Title } = Typography;

interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  color: string;
}

export const SocialNetwork: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState<Person | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({ nodes: [], links: [] });

  // 获取人物详情
  const fetchPersonDetails = async () => {
    if (!personId) return;
    
    try {
      setLoading(true);
      const data = await api.getPerson(Number(personId));
      setPerson(data);
      
      // 构建图数据
      const nodes: GraphNode[] = [];
      const links: GraphLink[] = [];
      
      // 添加中心节点（当前人物）
      const personIdStr = data.basic_info?.personid?.toString() || personId;
      nodes.push({
        id: personIdStr,
        name: data.basic_info?.name_chn || '未知',
        val: 2,
        color: '#1890ff'
      });
      
      // 添加亲属关系
      if (data.kin_relations && Array.isArray(data.kin_relations)) {
        for (const relation of data.kin_relations) {
          if (!relation.kin_id || !relation.kin_name) continue;
          
          const targetId = relation.kin_id.toString();
          nodes.push({
            id: targetId,
            name: relation.kin_name,
            val: 1,
            color: '#52c41a'
          });
          links.push({
            source: personIdStr,
            target: targetId,
            label: relation.relation || '未知关系',
            color: '#52c41a'
          });
        }
      }
      
      // 添加社交关系
      if (data.social_relations && Array.isArray(data.social_relations)) {
        for (const relation of data.social_relations) {
          if (!relation.assoc_id || !relation.assoc_name) continue;
          
          const targetId = relation.assoc_id.toString();
          nodes.push({
            id: targetId,
            name: relation.assoc_name,
            val: 1,
            color: '#722ed1'
          });
          links.push({
            source: personIdStr,
            target: targetId,
            label: relation.relation || '未知关系',
            color: '#722ed1'
          });
        }
      }
      
      setGraphData({ nodes, links });
    } catch (error) {
      console.error('Failed to fetch person details:', error);
      message.error('获取人物详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonDetails();
  }, [personId]);

  // 处理节点点击事件
  const handleNodeClick = useCallback((node: GraphNode) => {
    navigate(`/person/${node.id}`);
  }, [navigate]);

  // 处理链接点击事件
  const handleLinkClick = useCallback((link: GraphLink) => {
    message.info(`关系类型: ${link.label}`);
  }, []);

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', padding: '24px' }}>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (!person) {
    return (
      <Layout style={{ minHeight: '100vh', padding: '24px' }}>
        <Content>
          <Title level={2}>未找到人物信息</Title>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
            返回首页
          </Button>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <Content>
        <div style={{ marginBottom: '16px' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/person/${personId}`)}>
            返回详情页
          </Button>
        </div>
        <Card>
          <Title level={3}>{person.basic_info?.name_chn || '未知'} 的社交网络</Title>
          <div style={{ marginBottom: '16px' }}>
            <Row gutter={16}>
              <Col>
                <Tag color="#1890ff">中心人物</Tag>
              </Col>
              <Col>
                <Tag color="#52c41a">亲属关系</Tag>
              </Col>
              <Col>
                <Tag color="#722ed1">社交关系</Tag>
              </Col>
            </Row>
          </div>
          <div style={{ height: '600px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
            <ForceGraph2D
              graphData={graphData}
              nodeLabel="name"
              linkLabel="label"
              nodeAutoColorBy="color"
              linkAutoColorBy="color"
              nodeVal="val"
              nodeCanvasObject={(node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
                const label = node.name;
                const fontSize = 12/globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.color;
                ctx.fillText(label, node.x || 0, node.y || 0);
              }}
              onNodeClick={handleNodeClick}
              onLinkClick={handleLinkClick}
            />
          </div>
        </Card>
      </Content>
    </Layout>
  );
}; 