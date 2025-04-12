import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Typography, Card, Table, Spin, Empty, Input, Button, message, Row, Col, Select, Tag } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Person, Dynasty, SearchParams } from '../types';
import { convertToTraditional } from '../utils/convert';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export const HomePage: React.FC = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('personList');
  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState<Person[]>([]);
  const [dynasties, setDynasties] = useState<Dynasty[]>([]);
  const [totalPersons, setTotalPersons] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 搜索条件
  const [searchName, setSearchName] = useState('');
  const [searchDynasty, setSearchDynasty] = useState<number | null>(null);
  const [searchBirthYearFrom, setSearchBirthYearFrom] = useState<number | null>(null);
  const [searchBirthYearTo, setSearchBirthYearTo] = useState<number | null>(null);

  // 获取朝代列表
  const fetchDynasties = async () => {
    try {
      const data = await api.getDynasties();
      if (Array.isArray(data)) {
        setDynasties(data);
      } else {
        console.error('getDynasties 返回值不是数组:', data);
        setDynasties([]);
      }
    } catch (error) {
      console.error('Failed to fetch dynasties:', error);
      message.error('获取朝代列表失败');
      setDynasties([]);
    }
  };

  // 搜索历史人物
  const searchPersons = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const params: SearchParams = {
        name: searchName ? convertToTraditional(searchName) : undefined,
        dynasty_id: searchDynasty || undefined,
        birth_year_from: searchBirthYearFrom || undefined,
        birth_year_to: searchBirthYearTo || undefined,
        limit: size,
        offset: (page - 1) * size
      };
      
      const data = await api.searchPersons(params);
      setPersons(data.results || []);
      setTotalPersons(data.total || 0);
      setCurrentPage(page);
      setPageSize(size);
    } catch (error) {
      console.error('Failed to search persons:', error);
      message.error('搜索历史人物失败');
      setPersons([]);
    } finally {
      setLoading(false);
    }
  };

  // 在组件加载时获取朝代列表
  useEffect(() => {
    fetchDynasties();
    searchPersons();
  }, []);

  // 人物列表表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'personid',
      key: 'personid',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name_chn',
      key: 'name_chn',
      render: (text: string, record: Person) => (
        <Link to={`/person/${record.personid}`}>{text}</Link>
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
      width: 80,
      render: (gender: string) => (
        <Tag color={gender === '男' ? 'blue' : 'pink'}>{gender}</Tag>
      ),
    },
    {
      title: '出生年',
      dataIndex: 'birth_year',
      key: 'birth_year',
      width: 100,
    },
    {
      title: '死亡年',
      dataIndex: 'death_year',
      key: 'death_year',
      width: 100,
    },
    {
      title: '享年',
      dataIndex: 'death_age',
      key: 'death_age',
      width: 80,
    }
  ];

  // 朝代列表表格列定义
  const dynastyColumns = [
    {
      title: 'ID',
      dataIndex: 'dynasty_id',
      key: 'dynasty_id',
      width: 80,
    },
    {
      title: '朝代名称',
      dataIndex: 'dynasty_chn',
      key: 'dynasty_chn',
    },
    {
      title: '开始年份',
      dataIndex: 'start_year',
      key: 'start_year',
    },
    {
      title: '结束年份',
      dataIndex: 'end_year',
      key: 'end_year',
    }
  ];

  // 渲染搜索表单
  const renderSearchForm = () => (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Input
            placeholder="姓名"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            prefix={<UserOutlined />}
          />
        </Col>
        <Col span={6}>
          <Select
            style={{ width: '100%' }}
            placeholder="朝代"
            allowClear
            onChange={value => setSearchDynasty(value)}
          >
            {dynasties.map(dynasty => (
              <Option key={dynasty.dynasty_id} value={dynasty.dynasty_id}>
                {dynasty.dynasty_chn}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <Input
            placeholder="出生年份从"
            type="number"
            onChange={e => setSearchBirthYearFrom(e.target.value ? Number(e.target.value) : null)}
          />
        </Col>
        <Col span={4}>
          <Input
            placeholder="出生年份至"
            type="number"
            onChange={e => setSearchBirthYearTo(e.target.value ? Number(e.target.value) : null)}
          />
        </Col>
        <Col span={4}>
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={() => searchPersons(1, pageSize)}
          >
            搜索
          </Button>
        </Col>
      </Row>
    </Card>
  );

  // 渲染人物列表
  const renderPersonList = () => (
    <div>
      {renderSearchForm()}
      <Table
        columns={columns}
        dataSource={persons}
        rowKey="personid"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalPersons,
          onChange: (page, pageSize) => searchPersons(page, pageSize || 10),
        }}
      />
    </div>
  );

  // 渲染朝代列表
  const renderDynastyList = () => (
    <Table
      columns={dynastyColumns}
      dataSource={dynasties}
      rowKey="dynasty_id"
      loading={loading}
      pagination={false}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <Content>
        <Title level={2} style={{ marginBottom: '24px' }}>历史人物查询系统</Title>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'personList',
              label: '人物列表',
              children: renderPersonList()
            },
            {
              key: 'dynastyList',
              label: '朝代列表',
              children: renderDynastyList()
            }
          ]}
        />
      </Content>
    </Layout>
  );
};