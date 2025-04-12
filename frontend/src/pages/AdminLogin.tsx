import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Layout, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const ADMIN_PASSWORD = '258456asd';

export const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values: { password: string }) => {
    setLoading(true);
    if (values.password === ADMIN_PASSWORD) {
      // 存储登录状态
      localStorage.setItem('adminAuthenticated', 'true');
      messageApi.success('登录成功');
      navigate('/admin/dashboard');
    } else {
      messageApi.error('密码错误');
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: '#f0f2f5'
        }}>
          <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={2}>管理员登录</Title>
            </div>
            <Form
              name="admin_login"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入管理员密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  block
                  size="large"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </>
  );
}; 