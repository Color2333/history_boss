import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  message, 
  Tabs, 
  Spin, 
  Divider,
  Space,
  Alert
} from 'antd';
import { 
  RobotOutlined, 
  SaveOutlined
} from '@ant-design/icons';
import { api } from '../services/api';

const { Title, Paragraph } = Typography;

export const AiContentGenerator: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [personId, setPersonId] = useState<number | null>(null);
  const [personData, setPersonData] = useState<any>(null);
  const [biography, setBiography] = useState<string>('');
  const [resume, setResume] = useState<string>('');
  const [loadingBiography, setLoadingBiography] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [saving, setSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: { personId: string }) => {
    const id = parseInt(values.personId);
    if (isNaN(id)) {
      messageApi.error('请输入有效的人物ID');
      return;
    }

    setLoading(true);
    try {
      const data = await api.getPerson(id);
      setPersonData(data);
      setPersonId(id);
      messageApi.success(`成功获取人物信息: ${data.name_chn}`);
    } catch (error) {
      console.error('Error fetching person:', error);
      messageApi.error('获取人物信息失败');
    } finally {
      setLoading(false);
    }
  };

  const generateBiography = async () => {
    if (!personId) return;
    
    setLoadingBiography(true);
    try {
      const response = await api.generatePersonAiContent(personId, 'biography', true);
      setBiography(response.content);
      messageApi.success('传记生成成功');
    } catch (error) {
      console.error('Error generating biography:', error);
      messageApi.error('生成传记失败');
    } finally {
      setLoadingBiography(false);
    }
  };

  const generateResume = async () => {
    if (!personId) return;
    
    setLoadingResume(true);
    try {
      const response = await api.generatePersonAiContent(personId, 'resume', true);
      setResume(response.content);
      messageApi.success('简历生成成功');
    } catch (error) {
      console.error('Error generating resume:', error);
      messageApi.error('生成简历失败');
    } finally {
      setLoadingResume(false);
    }
  };

  const saveToBossDb = async () => {
    if (!personId || (!biography && !resume)) {
      messageApi.warning('请先生成内容再保存');
      return;
    }

    setSaving(true);
    try {
      if (biography) {
        await api.saveToBossDb(personId, 'biography', biography);
      }
      if (resume) {
        await api.saveToBossDb(personId, 'resume', resume);
      }
      messageApi.success('内容已成功保存到boss.db数据库');
    } catch (error) {
      console.error('Error saving to boss.db:', error);
      messageApi.error('保存到boss.db失败');
    } finally {
      setSaving(false);
    }
  };

  const renderContent = (content: string, loading: boolean, type: string) => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <Paragraph>正在生成{type}，请稍候...</Paragraph>
        </div>
      );
    }

    if (!content) {
      return (
        <Alert
          message={`未生成${type}`}
          description={`点击"生成${type}"按钮生成内容。`}
          type="info"
          showIcon
        />
      );
    }

    return (
      <div>
        <div style={{ 
          marginBottom: 16, 
          padding: 16, 
          border: '1px solid #d9d9d9', 
          borderRadius: '4px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          <Paragraph>{content}</Paragraph>
        </div>
        <Divider />
        <Alert
          message="审核提示"
          description={'请审核以上内容，确认无误后点击"保存到boss.db"按钮。'}
          type="info"
          showIcon
        />
      </div>
    );
  };

  return (
    <>
      {contextHolder}
      <Title level={4}>AI内容生成</Title>
      <Paragraph>
        在此页面，您可以输入人物ID，自动生成AI内容，审核后保存到boss.db数据库。
      </Paragraph>
      
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="personId"
            rules={[{ required: true, message: '请输入人物ID' }]}
          >
            <Input placeholder="请输入人物ID" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              获取人物信息
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {personData && (
        <Card style={{ marginBottom: 24 }}>
          <Title level={5}>人物信息</Title>
          <Paragraph>
            <strong>姓名：</strong> {personData.name_chn} ({personData.name})<br />
            <strong>朝代：</strong> {personData.dynasty}<br />
            <strong>生卒年：</strong> {personData.birth_year || '?'} - {personData.death_year || '?'}<br />
            <strong>性别：</strong> {personData.gender}
          </Paragraph>
        </Card>
      )}

      {personId && (
        <Card style={{ marginBottom: 24 }}>
          <Space style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              icon={<RobotOutlined />} 
              onClick={generateBiography}
              loading={loadingBiography}
            >
              生成传记
            </Button>
            <Button 
              type="primary" 
              icon={<RobotOutlined />} 
              onClick={generateResume}
              loading={loadingResume}
            >
              生成简历
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              onClick={saveToBossDb}
              loading={saving}
            >
              保存到boss.db
            </Button>
          </Space>

          <Tabs 
            defaultActiveKey="biography"
            items={[
              {
                key: 'biography',
                label: '传记',
                children: renderContent(biography, loadingBiography, '传记')
              },
              {
                key: 'resume',
                label: '简历',
                children: renderContent(resume, loadingResume, '简历')
              }
            ]}
          />
        </Card>
      )}

      {!personId && (
        <Alert
          message="操作提示"
          description="请先输入人物ID并获取人物信息，然后生成AI内容。"
          type="info"
          showIcon
        />
      )}
    </>
  );
}; 