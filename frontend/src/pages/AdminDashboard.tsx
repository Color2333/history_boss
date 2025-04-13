import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Input, Form, Card, message, Alert, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  RobotOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [form] = Form.useForm();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  // 处理AI内容生成页面的跳转
  const handleAiContentNavigation = (values: { personId: string }) => {
    const personId = values.personId.trim();
    if (!personId) {
      message.error('请输入有效的人物ID');
      return;
    }
    // 导航到AI内容生成页面
    navigate(`/admin/ai-content/${personId}`);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return (
          <>
            <Title level={4}>欢迎使用管理员系统</Title>
            <p>这里是管理员仪表板，您可以在这里管理系统的各项功能。</p>
          </>
        );
      case 'users':
        return (
          <>
            <Title level={4}>用户管理</Title>
            <p>这里是用户管理界面，您可以在这里管理系统的用户。</p>
          </>
        );
      case 'ai-content':
        return (
          <>
            <Title level={4}>AI内容生成</Title>
            <Paragraph>请输入历史人物ID，系统将为您生成AI内容。</Paragraph>
            
            <Card style={{ marginBottom: 16 }}>
              <Form form={form} onFinish={handleAiContentNavigation} layout="inline">
                <Form.Item
                  name="personId"
                  rules={[{ required: true, message: '请输入人物ID' }]}
                >
                  <Input placeholder="输入人物ID" style={{ width: 200 }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    查看/生成AI内容
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            
            <Alert
              message="操作指南"
              description="输入人物ID后，系统将导航到对应人物的AI内容生成页面，您可以查看已有内容或生成新的AI内容。"
              type="info"
              showIcon
            />
            
            <Space style={{ marginTop: 24 }}>
              <Button 
                type="primary" 
                onClick={() => navigate('/admin/ai-content/34')}
              >
                查看示例(ID: 34)
              </Button>
            </Space>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Title level={3} style={{ margin: 0 }}>历史人物管理系统</Title>
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            style={{ height: '100%', borderRight: 0 }}
            onClick={({ key }) => setSelectedMenu(key)}
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              仪表板
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              用户管理
            </Menu.Item>
            <Menu.Item key="ai-content" icon={<RobotOutlined />}>
              AI内容生成
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ 
            background: '#fff', 
            padding: 24, 
            margin: 0, 
            minHeight: 280,
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};