import React from 'react';
import { Card, Typography, Timeline, Tag, Space, Divider, Alert, Row, Col } from 'antd';
import { 
  UserOutlined, 
  TrophyOutlined, 
  ToolOutlined,
  StarOutlined,
  CrownOutlined,
  RocketOutlined,
  HeartOutlined,
  SmileOutlined
} from '@ant-design/icons';
import './ResumeRenderer.css';

const { Title, Text, Paragraph } = Typography;

interface ModernResumeData {
  modern_title: {
    position: string;
    company: string;
    industry: string;
  };
  personal_branding: {
    tagline: string;
    summary: string;
  };
  core_competencies: Array<{
    skill: string;
    description: string;
  }>;
  career_highlights: Array<{
    period: string;
    title: string;
    company: string;
    achievement: string;
    easter_egg?: string;
  }>;
  modern_achievements: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
  leadership_style: {
    style: string;
    approach: string;
    philosophy: string;
  };
  personal_interests: Array<{
    interest: string;
    description: string;
  }>;
  easter_eggs: Array<{
    type: string;
    content: string;
    icon: string;
  }>;
}

interface ResumeRendererProps {
  data: ModernResumeData | any; // 允许传入任意类型，以便处理可能的格式问题
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ data }) => {
  // 验证数据格式是否正确
  const isValidData = data && 
    data.modern_title &&
    data.personal_branding &&
    Array.isArray(data.core_competencies) &&
    Array.isArray(data.career_highlights) &&
    Array.isArray(data.modern_achievements) &&
    data.leadership_style &&
    Array.isArray(data.personal_interests) &&
    Array.isArray(data.easter_eggs);
  
  if (!isValidData) {
    console.error('简历数据格式不正确:', data);
    return (
      <Alert
        message="简历格式错误"
        description="简历数据格式不正确，无法显示。请检查API返回的JSON格式是否符合要求。"
        type="error"
        showIcon
      />
    );
  }

  // 安全地访问数据，防止运行时错误
  const safeGet = (obj: any, path: string, defaultValue: any = '') => {
    try {
      return obj && path.split('.').reduce((o, i) => o && o[i], obj) || defaultValue;
    } catch (e) {
      console.error(`访问路径 ${path} 时出错:`, e);
      return defaultValue;
    }
  };

  return (
    <Card className="resume-card">
      {/* 现代职位 */}
      <div className="resume-section">
        <Title level={2} className="resume-section-title">
          <CrownOutlined /> {safeGet(data, 'modern_title.position', '职位未知')}
        </Title>
        <Space wrap>
          <Tag color="blue" className="resume-tag">{safeGet(data, 'modern_title.company', '公司未知')}</Tag>
          <Tag color="green" className="resume-tag">{safeGet(data, 'modern_title.industry', '行业未知')}</Tag>
        </Space>
      </div>

      <Divider className="resume-divider" />

      {/* 个人品牌 */}
      <div className="resume-section">
        <Title level={3} className="resume-section-title">
          <StarOutlined /> 个人品牌
        </Title>
        <Paragraph strong style={{ fontSize: '16px', color: '#1890ff' }}>
          {safeGet(data, 'personal_branding.tagline', '无标语')}
        </Paragraph>
        <Paragraph>{safeGet(data, 'personal_branding.summary', '无简介')}</Paragraph>
      </div>

      <Divider className="resume-divider" />

      {/* 核心能力 */}
      <div className="resume-section">
        <Title level={3} className="resume-section-title">
          <ToolOutlined /> 核心能力
        </Title>
        <div className="resume-card-grid">
          {Array.isArray(data.core_competencies) && data.core_competencies.map((comp: any, index: number) => (
            <Card key={index} size="small">
              <Text strong>{safeGet(comp, 'skill', '技能未知')}</Text>
              <br />
              <Text type="secondary">{safeGet(comp, 'description', '无描述')}</Text>
            </Card>
          ))}
        </div>
      </div>

      <Divider className="resume-divider" />

      {/* 职业亮点 */}
      <div className="resume-section">
        <Title level={3} className="resume-section-title">
          <RocketOutlined /> 职业亮点
        </Title>
        <Timeline className="resume-timeline">
          {Array.isArray(data.career_highlights) && data.career_highlights.map((highlight: any, index: number) => (
            <Timeline.Item key={index}>
              <Text strong>{safeGet(highlight, 'period', '时期未知')}</Text>
              <br />
              <Text type="secondary">{safeGet(highlight, 'title', '职位未知')} @ {safeGet(highlight, 'company', '公司未知')}</Text>
              <br />
              <Text>{safeGet(highlight, 'achievement', '无成就')}</Text>
              {highlight.easter_egg && (
                <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                  <SmileOutlined /> {highlight.easter_egg}
                </Text>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      <Divider className="resume-divider" />

      {/* 现代成就 */}
      <div className="resume-section">
        <Title level={3} className="resume-section-title">
          <TrophyOutlined /> 现代成就
        </Title>
        <div className="resume-card-grid">
          {Array.isArray(data.modern_achievements) && data.modern_achievements.map((achievement: any, index: number) => (
            <Card key={index} size="small">
              <Text strong>{safeGet(achievement, 'title', '成就未知')}</Text>
              <br />
              <Text>{safeGet(achievement, 'description', '无描述')}</Text>
              <br />
              <Text type="secondary">影响: {safeGet(achievement, 'impact', '无影响数据')}</Text>
            </Card>
          ))}
        </div>
      </div>

      <Divider className="resume-divider" />

      {/* 领导风格 */}
      <div className="resume-section">
        <Title level={3} className="resume-section-title">
          <UserOutlined /> 领导风格
        </Title>
        <Card size="small">
          <Text strong>风格: {safeGet(data, 'leadership_style.style', '风格未知')}</Text>
          <br />
          <Text>方法: {safeGet(data, 'leadership_style.approach', '无方法描述')}</Text>
          <br />
          <Text>理念: {safeGet(data, 'leadership_style.philosophy', '无理念描述')}</Text>
        </Card>
      </div>

      <Divider className="resume-divider" />

      {/* 个人兴趣 */}
      <div className="resume-section">
        <Title level={3} className="resume-section-title">
          <HeartOutlined /> 个人兴趣
        </Title>
        <div className="resume-card-grid">
          {Array.isArray(data.personal_interests) && data.personal_interests.map((interest: any, index: number) => (
            <Card key={index} size="small">
              <Text strong>{safeGet(interest, 'interest', '兴趣未知')}</Text>
              <br />
              <Text type="secondary">{safeGet(interest, 'description', '无描述')}</Text>
            </Card>
          ))}
        </div>
      </div>

      {/* 彩蛋 */}
      {Array.isArray(data.easter_eggs) && data.easter_eggs.length > 0 && (
        <>
          <Divider className="resume-divider" />
          <div className="resume-section">
            <Title level={3} className="resume-section-title">
              <SmileOutlined /> 彩蛋
            </Title>
            <div className="resume-card-grid">
              {data.easter_eggs.map((egg: any, index: number) => (
                <Card key={index} size="small">
                  <Text strong>{safeGet(egg, 'type', '类型未知')}</Text>
                  <br />
                  <Text type="secondary">{safeGet(egg, 'content', '无内容')}</Text>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};