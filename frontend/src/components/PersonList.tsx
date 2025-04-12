import React from 'react';
import { Table, Tag, Space } from 'antd';
import { Person } from '../types';
import { useNavigate } from 'react-router-dom';

interface PersonListProps {
  data: Person[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

export const PersonList: React.FC<PersonListProps> = ({ data, loading, pagination }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name_chn',
      key: 'name_chn',
      render: (text: string, record: Person) => (
        <a onClick={() => navigate(`/person/${record.personid}`)}>{text}</a>
      ),
    },
    {
      title: '朝代',
      dataIndex: 'dynasty',
      key: 'dynasty',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <Tag color={gender === '男' ? 'blue' : 'pink'}>{gender}</Tag>
      ),
    },
    {
      title: '生卒年',
      key: 'lifespan',
      render: (record: Person) => (
        <Space>
          {record.birth_year && <span>生于{record.birth_year}年</span>}
          {record.death_year && <span>卒于{record.death_year}年</span>}
          {record.death_age && <span>(享年{record.death_age}岁)</span>}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="personid"
      loading={loading}
      pagination={pagination}
      style={{ marginTop: 20 }}
    />
  );
}; 