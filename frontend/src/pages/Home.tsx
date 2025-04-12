import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import { SearchForm } from '../components/SearchForm';
import { PersonList } from '../components/PersonList';
import { SearchParams, SearchResult } from '../types';
import { api } from '../services/api';

const { Header, Content } = Layout;
const { Title } = Typography;

export const Home: React.FC = () => {
  const [searchResult, setSearchResult] = useState<SearchResult>({
    total: 0,
    offset: 0,
    limit: 20,
    results: []
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    try {
      const result = await api.searchPersons(params);
      setSearchResult(result);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    handleSearch({
      ...searchResult,
      offset,
      limit: pageSize
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <Title level={2} style={{ margin: '16px 0' }}>
          历史人物查询系统
        </Title>
      </Header>
      <Content style={{ padding: '24px', background: '#fff' }}>
        <SearchForm onSearch={handleSearch} />
        <PersonList
          data={searchResult.results}
          loading={loading}
          pagination={{
            current: Math.floor(searchResult.offset / searchResult.limit) + 1,
            pageSize: searchResult.limit,
            total: searchResult.total,
            onChange: handlePageChange
          }}
        />
      </Content>
    </Layout>
  );
}; 