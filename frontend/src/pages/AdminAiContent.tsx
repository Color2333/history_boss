import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, message, Spin, Typography, Alert, Tabs } from 'antd';
import { api } from '../services/api';
import { ResumeRenderer } from '../components/ResumeRenderer';
import type { Person } from '../types';

const { Title, Text } = Typography;

export const AdminAiContent: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [biography, setBiography] = useState<string>('');
  const [resume, setResume] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'biography' | 'resume'>('biography');

  const loadData = async () => {
    if (!personId) return;
    
    try {
      setLoading(true);
      // 获取人物基本信息
      const personData = await api.getPerson(parseInt(personId));
      setPerson(personData);
      
      // 获取传记内容
      const biographyContent = await api.getPersonAiContent(parseInt(personId), 'biography');
      if (biographyContent.status !== 'not_found') {
        setBiography(biographyContent.content);
      }

      // 获取简历内容
      const resumeContent = await api.getPersonAiContent(parseInt(personId), 'resume');
      if (resumeContent.status !== 'not_found') {
        setResume(resumeContent.content);
      }
    } catch (err) {
      setError('加载数据失败');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [personId]);

  const generateAiContent = async () => {
    if (!personId) return;
    
    try {
      setLoading(true);
      const result = await api.generatePersonAiContent(parseInt(personId), activeTab, true);
      if (activeTab === 'biography') {
        setBiography(result.content);
      } else {
        setResume(result.content);
      }
      message.success('AI内容生成成功');
    } catch (err) {
      setError('生成AI内容失败');
      console.error('Error generating AI content:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveToBoss = async () => {
    if (!personId) return;
    const content = activeTab === 'biography' ? biography : resume;
    if (!content) {
      message.warning('请先生成内容');
      return;
    }
    
    try {
      setLoading(true);
      await api.saveToBossDb(parseInt(personId), activeTab, content);
      message.success('保存到boss成功');
      
      // 重新加载内容以获取最新状态
      const newContent = await api.getPersonAiContent(parseInt(personId), activeTab);
      if (newContent.status === 'not_found') {
        if (activeTab === 'biography') {
          setBiography('');
        } else {
          setResume('');
        }
      } else {
        if (activeTab === 'biography') {
          setBiography(newContent.content);
        } else {
          setResume(newContent.content);
        }
      }
    } catch (err) {
      setError('保存到boss失败');
      console.error('Error saving to boss:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!person) {
    return <Alert type="warning" message="未找到人物信息" />;
  }

  const renderContent = () => {
    const content = activeTab === 'biography' ? biography : resume;
    if (!content) {
      return (
        <Alert
          message="未生成内容"
          description="点击"生成AI内容"按钮生成内容。"
          type="info"
          showIcon
        />
      );
    }

    if (activeTab === 'biography') {
      return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>;
    } else {
      return <ResumeRenderer data={JSON.parse(content)} />;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>{person.basic_info?.name}</Title>
        <Text type="secondary">
          {person.basic_info?.dynasty} · {person.basic_info?.birth_year || '?'} - {person.basic_info?.death_year || '?'}
        </Text>
        
        <div style={{ marginTop: '24px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as 'biography' | 'resume')}
            items={[
              {
                key: 'biography',
                label: '传记',
                children: (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <Button type="primary" onClick={generateAiContent} style={{ marginRight: '16px' }}>
                        生成AI内容
                      </Button>
                      <Button onClick={saveToBoss}>保存到boss</Button>
                    </div>
                    {renderContent()}
                  </>
                ),
              },
              {
                key: 'resume',
                label: '简历',
                children: (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <Button type="primary" onClick={generateAiContent} style={{ marginRight: '16px' }}>
                        生成AI内容
                      </Button>
                      <Button onClick={saveToBoss}>保存到boss</Button>
                    </div>
                    {renderContent()}
                  </>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}; 