import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Card, Spin, Typography, Button, message, Row, Col, Tag, Pagination, Statistic } from 'antd';
import { ArrowLeftOutlined, TeamOutlined, HeartOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { api } from '../services/api';
import { Person, KinRelation, SocialRelation } from '../types';

const { Content } = Layout;
const { Title, Text } = Typography;

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

interface NetworkStats {
  kinCount: number;
  socialCount: number;
  totalCount: number;
}

export const SocialNetwork: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState<Person | null>(null);
  const [allNodes, setAllNodes] = useState<GraphNode[]>([]);
  const [allLinks, setAllLinks] = useState<GraphLink[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({ nodes: [], links: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<NetworkStats>({ kinCount: 0, socialCount: 0, totalCount: 0 });
  const pageSize = 100;
  const graphRef = React.useRef<ForceGraphMethods<GraphNode, GraphLink>>();

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
      let kinCount = 0;
      let socialCount = 0;
      
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
          kinCount++;
          
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
          socialCount++;
          
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
      
      // 更新统计数据
      setStats({
        kinCount,
        socialCount,
        totalCount: kinCount + socialCount
      });

      // 保存所有节点和连接
      setAllNodes(nodes);
      setAllLinks(links);
      
      // 更新当前页的数据
      updateGraphData(nodes, links, 1);
    } catch (error) {
      console.error('Failed to fetch person details:', error);
      message.error('获取人物详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 更新图数据
  const updateGraphData = (nodes: GraphNode[], links: GraphLink[], page: number) => {
    const startIndex = (page - 1) * pageSize + 1; // +1 是因为要跳过中心节点
    const endIndex = page * pageSize + 1;
    
    // 始终包含中心节点
    const centerNode = nodes[0];
    const pageNodes = [centerNode, ...nodes.slice(startIndex, endIndex)];
    
    // 只包含与当前页节点相关的连接
    const pageNodeIds = new Set(pageNodes.map(node => node.id));
    const pageLinks = links.filter(link => 
      pageNodeIds.has(link.source.toString()) && pageNodeIds.has(link.target.toString())
    );
    
    setGraphData({ nodes: pageNodes, links: pageLinks });
  };

  useEffect(() => {
    fetchPersonDetails();
  }, [personId]);

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateGraphData(allNodes, allLinks, page);
  };

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
          
          {/* 统计信息 */}
          <Row gutter={24} style={{ marginBottom: '24px' }}>
            <Col>
              <Statistic 
                title="亲属关系" 
                value={stats.kinCount} 
                prefix={<HeartOutlined style={{ color: '#52c41a' }} />} 
              />
            </Col>
            <Col>
              <Statistic 
                title="社交关系" 
                value={stats.socialCount} 
                prefix={<TeamOutlined style={{ color: '#722ed1' }} />} 
              />
            </Col>
            <Col>
              <Statistic 
                title="总关系数" 
                value={stats.totalCount} 
                prefix={<TeamOutlined style={{ color: '#1890ff' }} />} 
              />
            </Col>
          </Row>

          {/* 图例 */}
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

          {/* 图表 */}
          <div style={{ height: '600px', border: '1px solid #f0f0f0', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
            <ForceGraph2D
              graphData={graphData}
              nodeLabel="name"
              linkLabel="label"
              nodeAutoColorBy="color"
              linkAutoColorBy="color"
              nodeVal="val"
              width={document.querySelector('.ant-card')?.clientWidth || 800}
              height={600}
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
              cooldownTicks={100}
              d3AlphaDecay={0.02}
              d3VelocityDecay={0.3}
              enableZoomInteraction={true}
              enablePanInteraction={true}
              minZoom={0.5}
              maxZoom={4}
              onEngineStop={() => {
                // 当图表停止运动时，确保所有节点都在视图内
                if (graphRef.current) {
                  graphRef.current.zoomToFit(400);
                }
              }}
              ref={graphRef}
            />
            {/* 关系说明面板 */}
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '12px',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              maxHeight: '200px',
              overflowY: 'auto',
              width: '200px'
            }}>
              <Text strong>关系说明：</Text>
              <div style={{ marginTop: '8px' }}>
                {graphData.links.map((link, index) => (
                  <div key={index} style={{ 
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: link.color,
                      marginRight: '8px'
                    }} />
                    <Text style={{ fontSize: '12px' }}>
                      {link.source === personId ? person?.basic_info?.name_chn : 
                        graphData.nodes.find(n => n.id === link.source)?.name} →{' '}
                      {link.target === personId ? person?.basic_info?.name_chn :
                        graphData.nodes.find(n => n.id === link.target)?.name}
                      ：{link.label}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 分页 */}
          {stats.totalCount > pageSize && (
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Pagination
                current={currentPage}
                total={stats.totalCount}
                pageSize={pageSize}
                onChange={handlePageChange}
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 个关系，共 ${total} 个`}
              />
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
}; 