import React, { useState } from 'react';
import { Layout, Menu, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { AiContentGenerator } from '../components/AiContentGenerator';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
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
        return <AiContentGenerator />;
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