import React from 'react';
import { Card, Typography, Timeline, Tag, Space, Divider } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  BankOutlined, 
  TrophyOutlined, 
  ToolOutlined 
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ResumeData {
  basic_info: {
    name: string;
    dynasty: string;
    birth_death: string;
    gender: string;
  };
  education: Array<{
    year: string;
    type: string;
    description: string;
  }>;
  work_experience: Array<{
    period: string;
    position: string;
    description: string;
  }>;
  achievements: string[];
  skills: string[];
}

interface ResumeRendererProps {
  data: ResumeData;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ data }) => {
  return (
    <Card>
      {/* 基本信息 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <UserOutlined /> {data.basic_info.name}
        </Title>
        <Space>
          <Tag color="blue">{data.basic_info.dynasty}</Tag>
          <Tag color="green">{data.basic_info.birth_death}</Tag>
          <Tag color="purple">{data.basic_info.gender}</Tag>
        </Space>
      </div>

      <Divider />

      {/* 教育背景 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <BookOutlined /> 教育背景
        </Title>
        <Timeline>
          {data.education.map((edu, index) => (
            <Timeline.Item key={index}>
              <Text strong>{edu.year}</Text>
              <br />
              <Text type="secondary">{edu.type}</Text>
              <br />
              <Text>{edu.description}</Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      <Divider />

      {/* 工作经历 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <BankOutlined /> 工作经历
        </Title>
        <Timeline>
          {data.work_experience.map((work, index) => (
            <Timeline.Item key={index}>
              <Text strong>{work.period}</Text>
              <br />
              <Text type="secondary">{work.position}</Text>
              <br />
              <Text>{work.description}</Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      <Divider />

      {/* 主要成就 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <TrophyOutlined /> 主要成就
        </Title>
        <ul>
          {data.achievements.map((achievement, index) => (
            <li key={index}>
              <Paragraph>{achievement}</Paragraph>
            </li>
          ))}
        </ul>
      </div>

      <Divider />

      {/* 专业技能 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <ToolOutlined /> 专业技能
        </Title>
        <Space wrap>
          {data.skills.map((skill, index) => (
            <Tag key={index} color="blue">{skill}</Tag>
          ))}
        </Space>
      </div>
    </Card>
  );
}; 