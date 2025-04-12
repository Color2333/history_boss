import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, message, Typography, Layout, Space, Alert } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { Person } from '../types';
import { api } from '../services/api';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export const AdminAiContent: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiContent, setAiContent] = useState<{
    biography?: string;
    resume?: string;
  }>({});
  const [loadingAi, setLoadingAi] = useState<{
    biography: boolean;
    resume: boolean;
  }>({
    biography: false,
    resume: false
  });
  const [saving, setSaving] = useState<{
    biography: boolean;
    resume: boolean;
  }>({
    biography: false,
    resume: false
  });

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        if (!personId) return;
        const data = await api.getPerson(parseInt(personId));
        console.log('Fetched person data:', data);
        console.log('Basic info:', data.basic_info);
        if (!data || !data.basic_info) {
          message.error('获取历史人物信息失败：数据格式不正确');
          return;
        }
        setPerson(data);
      } catch (error) {
        message.error('获取历史人物信息失败');
        console.error('Failed to fetch person:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [personId]);

  const loadAiContent = async (type: 'biography' | 'resume') => {
    if (!person?.basic_info) return;
    
    setLoadingAi(prev => ({ ...prev, [type]: true }));
    try {
      const response = await api.getPersonAiContent(person.basic_info.personid, type);
      setAiContent(prev => ({ ...prev, [type]: response.content }));
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      message.error(`加载${type === 'biography' ? '传记' : '简历'}失败`);
    } finally {
      setLoadingAi(prev => ({ ...prev, [type]: false }));
    }
  };

  const generateAiContent = async (type: 'biography' | 'resume') => {
    if (!person?.basic_info) return;
    
    setLoadingAi(prev => ({ ...prev, [type]: true }));
    try {
      const response = await api.generatePersonAiContent(person.basic_info.personid, type);
      setAiContent(prev => ({ ...prev, [type]: response.content }));
      message.success(`${type === 'biography' ? '传记' : '简历'}生成成功`);
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      message.error(`生成${type === 'biography' ? '传记' : '简历'}失败`);
    } finally {
      setLoadingAi(prev => ({ ...prev, [type]: false }));
    }
  };

  const saveToBossDb = async (type: 'biography' | 'resume') => {
    if (!person?.basic_info || !aiContent[type]) return;
    
    setSaving(prev => ({ ...prev, [type]: true }));
    try {
      await api.saveToBossDb(person.basic_info.personid, type, aiContent[type]!);
      message.success('保存到boss成功');
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      message.error('保存到boss失败');
    } finally {
      setSaving(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    if (person?.basic_info) {
      loadAiContent('biography');
      loadAiContent('resume');
    }
  }, [person]);

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />;
  }

  if (!person?.basic_info) {
    return (
      <Layout style={{ minHeight: '100vh', padding: '24px' }}>
        <Content>
          <div style={{ marginBottom: '16px' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin')}>
              返回管理界面
            </Button>
          </div>
          <Alert
            message="未找到该历史人物"
            description="请检查人物ID是否正确，或返回管理界面重新选择"
            type="error"
            showIcon
          />
        </Content>
      </Layout>
    );
  }

  const renderContent = (type: 'biography' | 'resume') => {
    const title = type === 'biography' ? 'AI 生成的传记' : 'AI 生成的现代简历';
    const content = aiContent[type];
    const isLoading = loadingAi[type];
    const isSaving = saving[type];

    return (
      <Card 
        title={title}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              loading={isLoading}
              onClick={() => generateAiContent(type)}
            >
              重新生成
            </Button>
            {content && (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={isSaving}
                onClick={() => saveToBossDb(type)}
              >
                保存到BOSS
              </Button>
            )}
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : content ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
        ) : (
          <Alert
            message="暂无内容"
            description="点击重新生成按钮生成内容"
            type="info"
            showIcon
          />
        )}
      </Card>
    );
  };

  console.log('Rendering person info:', {
    name: person.basic_info.name_chn,
    dynasty: person.basic_info.dynasty,
    birth_year: person.basic_info.birth_year,
    death_year: person.basic_info.death_year,
    gender: person.basic_info.gender
  });

  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <Content>
        <div style={{ marginBottom: '16px' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin')}>
            返回管理界面
          </Button>
        </div>
        <Card>
          <Title level={2}>{person.basic_info.name_chn}</Title>
          <Paragraph>
            朝代：{person.basic_info.dynasty} | 
            生卒年：{person.basic_info.birth_year || '?'} - {person.basic_info.death_year || '?'} | 
            性别：{person.basic_info.gender}
          </Paragraph>
          {renderContent('biography')}
          {renderContent('resume')}
        </Card>
      </Content>
    </Layout>
  );
}; 