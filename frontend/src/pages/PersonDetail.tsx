import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Typography, Card, Table, Button, Spin, message, Descriptions, Tag, Tabs, Alert } from 'antd';
import { ArrowLeftOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { api } from '../services/api';
import { Person } from '../types';
import { ResumeRenderer } from '../components/ResumeRenderer';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface TabConfig {
  key: string;
  label: string;
  data: any[];
  columns: any[];
  visible: boolean;
}

interface ResumeData {
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

export const PersonDetail: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [biography, setBiography] = useState<string | null>(null);
  const [resume, setResume] = useState<any | null>(null);
  const [loadingAiContent, setLoadingAiContent] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!personId) return;
        setLoading(true);
        setLoadingAiContent(true);
        
        // 获取人物基本信息
        const personData = await api.getPerson(parseInt(personId));
        setPerson(personData);
        
        // 获取AI生成的内容
        try {
          const biographyContent = await api.getPersonAiContent(parseInt(personId), 'biography');
          if (biographyContent && biographyContent.content) {
            setBiography(biographyContent.content);
          }
        } catch (error) {
          console.error('获取传记内容失败:', error);
        }
        
        try {
          const resumeContent = await api.getPersonAiContent(parseInt(personId), 'resume');
          if (resumeContent && resumeContent.content) {
            try {
              // 尝试解析简历内容
              let parsedContent: any = resumeContent.content;
              
              // 如果内容是字符串，尝试解析JSON
              if (typeof parsedContent === 'string') {
                try {
                  parsedContent = JSON.parse(parsedContent) as ResumeData;
                } catch (e) {
                  console.error('第一次JSON解析失败:', e);
                  // 尝试清理字符串并重新解析
                  const cleanedContent = parsedContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
                  try {
                    parsedContent = JSON.parse(cleanedContent) as ResumeData;
                  } catch (e2) {
                    console.error('清理后JSON解析仍然失败:', e2);
                    throw new Error('无法解析简历JSON数据');
                  }
                }
              }
              
              // 如果解析后的内容仍然包含content字段，可能是嵌套的JSON
              if (parsedContent && typeof parsedContent === 'object' && 'content' in parsedContent) {
                if (typeof parsedContent.content === 'string') {
                  try {
                    parsedContent = JSON.parse(parsedContent.content) as ResumeData;
                  } catch (e) {
                    console.error('解析嵌套content字段失败:', e);
                    throw new Error('无法解析嵌套的简历数据');
                  }
                } else {
                  parsedContent = parsedContent.content as ResumeData;
                }
              }
              
              // 验证简历数据结构
              const requiredFields = [
                'modern_title',
                'personal_branding',
                'core_competencies',
                'career_highlights',
                'modern_achievements',
                'leadership_style',
                'personal_interests',
                'easter_eggs'
              ] as const;
              
              const missingFields = requiredFields.filter(field => !parsedContent[field]);
              if (missingFields.length > 0) {
                console.error('简历数据缺少必要字段:', missingFields);
                throw new Error(`简历数据缺少必要字段: ${missingFields.join(', ')}`);
              }
              
              // 验证数组字段
              const arrayFields = [
                'core_competencies',
                'career_highlights',
                'modern_achievements',
                'personal_interests',
                'easter_eggs'
              ] as const;
              
              const invalidArrayFields = arrayFields.filter(field => !Array.isArray(parsedContent[field]));
              if (invalidArrayFields.length > 0) {
                console.error('简历数据包含非数组字段:', invalidArrayFields);
                throw new Error(`简历数据包含非数组字段: ${invalidArrayFields.join(', ')}`);
              }
              
              setResume(parsedContent as ResumeData);
            } catch (parseError) {
              console.error('解析简历数据失败:', parseError);
              messageApi.error(parseError instanceof Error ? parseError.message : '解析简历数据失败，请重新生成');
            }
          }
        } catch (error) {
          console.error('获取简历内容失败:', error);
        }
      } catch (error) {
        messageApi.error('获取历史人物信息失败');
        console.error('Failed to fetch person:', error);
      } finally {
        setLoading(false);
        setLoadingAiContent(false);
      }
    };

    fetchData();
  }, [personId, messageApi]);

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />;
  }

  if (!person) {
    return <div>未找到该历史人物</div>;
  }

  const { basic_info, alt_names = [], kin_relations = [], social_relations = [], 
          addresses = [], offices = [], entries = [], statuses = [], texts = [] } = person;

  const tabConfigs: TabConfig[] = [
    {
      key: 'basic',
      label: '基本信息',
      data: [],
      columns: [],
      visible: true
    },
    {
      key: 'biography',
      label: 'AI传记',
      data: [],
      columns: [],
      visible: !!biography
    },
    {
      key: 'resume',
      label: 'AI简历',
      data: [],
      columns: [],
      visible: !!resume
    },
    {
      key: 'alt_names',
      label: '别名',
      data: alt_names,
      columns: [
        { title: '别名', dataIndex: 'alt_name_chn', key: 'alt_name_chn' },
        { title: '类型', dataIndex: 'type', key: 'type' }
      ],
      visible: alt_names.length > 0
    },
    {
      key: 'kin_relations',
      label: '亲属关系',
      data: kin_relations,
      columns: [
        { title: '亲属姓名', dataIndex: 'kin_name', key: 'kin_name' },
        { title: '关系', dataIndex: 'relation', key: 'relation' }
      ],
      visible: kin_relations.length > 0
    },
    {
      key: 'social_relations',
      label: '社会关系',
      data: social_relations,
      columns: [
        { title: '关联人物', dataIndex: 'assoc_name', key: 'assoc_name' },
        { title: '关系', dataIndex: 'relation', key: 'relation' },
        { title: '年份', dataIndex: 'year', key: 'year' }
      ],
      visible: social_relations.length > 0
    },
    {
      key: 'addresses',
      label: '地址信息',
      data: addresses,
      columns: [
        { title: '地址', dataIndex: 'addr_name', key: 'addr_name' },
        { title: '类型', dataIndex: 'addr_type', key: 'addr_type' },
        { title: '起始年份', dataIndex: 'first_year', key: 'first_year' },
        { title: '结束年份', dataIndex: 'last_year', key: 'last_year' }
      ],
      visible: addresses.length > 0
    },
    {
      key: 'offices',
      label: '官职信息',
      data: offices,
      columns: [
        { title: '官职', dataIndex: 'office_name', key: 'office_name' },
        { title: '任命类型', dataIndex: 'appointment_type', key: 'appointment_type' },
        { title: '任职方式', dataIndex: 'assume_office', key: 'assume_office' },
        { title: '起始年份', dataIndex: 'first_year', key: 'first_year' },
        { title: '结束年份', dataIndex: 'last_year', key: 'last_year' }
      ],
      visible: offices.length > 0
    },
    {
      key: 'entries',
      label: '入仕信息',
      data: entries,
      columns: [
        { title: '入仕方式', dataIndex: 'entry_desc', key: 'entry_desc' },
        { title: '年份', dataIndex: 'year', key: 'year' },
        { title: '年龄', dataIndex: 'age', key: 'age' },
        { title: '尝试次数', dataIndex: 'attempt_count', key: 'attempt_count' },
        { title: '考试排名', dataIndex: 'exam_rank', key: 'exam_rank' }
      ],
      visible: entries.length > 0
    },
    {
      key: 'statuses',
      label: '社会地位',
      data: statuses,
      columns: [
        { title: '地位', dataIndex: 'status_desc', key: 'status_desc' },
        { title: '起始年份', dataIndex: 'first_year', key: 'first_year' },
        { title: '结束年份', dataIndex: 'last_year', key: 'last_year' },
        { title: '补充说明', dataIndex: 'supplement', key: 'supplement' }
      ],
      visible: statuses.length > 0
    },
    {
      key: 'texts',
      label: '著作信息',
      data: texts,
      columns: [
        { title: '著作名称', dataIndex: 'title', key: 'title' },
        { title: '角色', dataIndex: 'role', key: 'role' },
        { title: '年份', dataIndex: 'year', key: 'year' }
      ],
      visible: texts.length > 0
    }
  ];

  const renderBasicInfo = () => (
    <Card variant="outlined" style={{ boxShadow: 'none' }}>
      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="姓名" span={2}>
          <Typography.Text strong style={{ fontSize: '18px' }}>{basic_info?.name_chn}</Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="朝代">
          <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>{basic_info?.dynasty}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="性别">
          <Tag color={basic_info?.gender === '男' ? 'blue' : 'pink'} style={{ fontSize: '14px', padding: '4px 8px' }}>{basic_info?.gender}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="姓氏">{basic_info?.surname}</Descriptions.Item>
        <Descriptions.Item label="名">{basic_info?.mingzi}</Descriptions.Item>
        {basic_info?.birth_year && (
          <Descriptions.Item label="出生年份">{basic_info.birth_year}年</Descriptions.Item>
        )}
        {basic_info?.death_year && (
          <Descriptions.Item label="去世年份">{basic_info.death_year}年</Descriptions.Item>
        )}
        {basic_info?.death_age && (
          <Descriptions.Item label="享年">{basic_info.death_age}岁</Descriptions.Item>
        )}
        {basic_info?.index_year && (
          <Descriptions.Item label="索引年份">{basic_info.index_year}年</Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );

  const renderBiography = () => (
    <Card bordered={false} style={{ boxShadow: 'none' }}>
      <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: '16px', lineHeight: '1.8' }}>
        {biography}
      </Paragraph>
    </Card>
  );

  const renderResume = () => (
    <Card bordered={false} style={{ boxShadow: 'none' }}>
      {loadingAiContent ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: '16px' }}>正在生成简历...</Paragraph>
        </div>
      ) : resume ? (
        <ResumeRenderer data={resume} />
      ) : (
        <Alert
          message="简历数据不可用"
          description="简历数据不可用或格式不正确，请重新生成。"
          type="warning"
          showIcon
        />
      )}
    </Card>
  );

  const renderTable = (data: any[], columns: any[], key: string) => (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={(record) => `${key}-${Math.random()}`}
      pagination={false}
      bordered
      style={{ marginTop: '16px' }}
    />
  );

  const tabItems = tabConfigs
    .filter(config => config.visible)
    .map(config => ({
      key: config.key,
      label: config.label,
      children: config.key === 'basic' ? renderBasicInfo() : 
                config.key === 'biography' ? renderBiography() :
                config.key === 'resume' ? renderResume() :
                renderTable(config.data, config.columns, config.key)
    }));

  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: '100vh', padding: '24px' }}>
        <Content>
          <div style={{ marginBottom: '16px' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginRight: '8px' }}>
              返回首页
            </Button>
            <Button icon={<TeamOutlined />} onClick={() => navigate(`/person/${personId}/network`)} style={{ marginRight: '8px' }}>
              查看社交网络
            </Button>
            <Button icon={<EnvironmentOutlined />} onClick={() => navigate(`/person/${personId}/map`)}>
              查看活动轨迹
            </Button>
          </div>
          <Card>
            <Title level={2}>{person?.basic_info?.name_chn}</Title>
            <Tabs 
              defaultActiveKey="basic" 
              size="large"
              items={tabItems}
              style={{ 
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)'
              }}
            />
          </Card>
        </Content>
      </Layout>
    </>
  );
}; 