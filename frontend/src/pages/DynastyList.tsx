import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Card, Space, Spin, message, Typography } from 'antd';
import { Dynasty } from '../types';
import { api } from '../services/api';

const { Title } = Typography;

export const DynastyList: React.FC = () => {
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynasties = async () => {
      try {
        const data = await api.getDynasties();
        setDynasties(data);
      } catch (error) {
        message.error('获取朝代列表失败');
        console.error('Failed to fetch dynasties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDynasties();
  }, []);

  const columns = [
    {
      title: '朝代',
      dataIndex: 'dynasty_chn',
      key: 'dynasty_chn',
      render: (text: string, record: Dynasty) => (
        <Link to={`/dynasty/${record.dynasty_id}`}>{text}</Link>
      ),
    },
    {
      title: '英文名称',
      dataIndex: 'dynasty',
      key: 'dynasty',
    },
    {
      title: '起始年份',
      dataIndex: 'start_year',
      key: 'start_year',
      render: (year: number) => year ? `${year}年` : '未知',
    },
    {
      title: '结束年份',
      dataIndex: 'end_year',
      key: 'end_year',
      render: (year: number) => year ? `${year}年` : '未知',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Dynasty) => (
        <Space size="middle">
          <Link to={`/dynasty/${record.dynasty_id}`}>查看详情</Link>
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
        <Title level={2}>朝代列表</Title>
        <Table 
          dataSource={dynasties} 
          columns={columns} 
          rowKey="dynasty_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};