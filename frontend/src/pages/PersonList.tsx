import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Card, Space, Tag, Spin, message, Typography } from 'antd';
import { Person } from '../types';
import { api } from '../services/api';

const { Title } = Typography;

export const PersonList: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        // 简单起见，直接使用一个空对象来获取所有人物
        const data = await api.searchPersons({});
        setPersons(data.results);
      } catch (error) {
        message.error('获取历史人物列表失败');
        console.error('Failed to fetch persons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, []);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Person) => (
        <Link to={`/person/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: '朝代',
      dataIndex: 'dynasty',
      key: 'dynasty',
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: '生年',
      dataIndex: 'birth_year',
      key: 'birth_year',
      render: (year: number) => year ? `${year}年` : '未知',
    },
    {
      title: '卒年',
      dataIndex: 'death_year',
      key: 'death_year',
      render: (year: number) => year ? `${year}年` : '未知',
    },
    {
      title: '简介',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Person) => (
        <Space size="middle">
          <Link to={`/person/${record.id}`}>查看详情</Link>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card bordered={false} style={{ marginBottom: '24px' }}>
        <Title level={2}>历史人物列表</Title>
        <Table 
          dataSource={persons} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};