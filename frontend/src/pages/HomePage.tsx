import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Row, Col, Typography, Button, Spin, message, Empty, Tabs, Tag } from 'antd';
import { SearchOutlined, UserOutlined, HistoryOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { SearchForm } from '../components/SearchForm';
import { SearchParams, SearchResult } from '../types';
import { convertToTraditional } from '../utils/convert';
import './HomePage.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

interface ResumeContent {
  modern_title: {
    position: string;
    company: string;
    industry: string;
  };
  personal_branding: {
    tagline: string;
    summary: string;
  };
  [key: string]: any;
}

interface ResumeCard {
  id: number;
  name: string;
  dynasty: string;
  modern_title: {
    position: string;
    company: string;
    industry: string;
  };
  personal_branding: {
    tagline: string;
    summary: string;
  };
  content?: ResumeContent;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<ResumeCard[]>([]);
  const [recommendedResumes, setRecommendedResumes] = useState<ResumeCard[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult>({
    total: 0,
    offset: 0,
    limit: 20,
    results: []
  });
  const [activeTab, setActiveTab] = useState<string>('resumes');

  useEffect(() => {
    fetchRecommendedResumes();
  }, []);

  const fetchRecommendedResumes = async () => {
    try {
      setLoading(true);
      const response = await api.getRecommendedResumes();
      console.log('Raw API response:', response);
      
      // 处理可能被包装在content字段中的简历数据
      const processedResumes = await Promise.all(response.map(async (resume: any) => {
        try {
          // 首先获取人物基本信息
          const personInfo = await api.getPerson(resume.id);
          
          // 如果resume.content是字符串，尝试解析它
          let resumeContent = resume.content;
          if (typeof resumeContent === 'string') {
            try {
              resumeContent = JSON.parse(resumeContent);
            } catch (e) {
              const cleanedContent = resumeContent
                .replace(/^```json\s*/, '')
                .replace(/\s*```$/, '')
                .trim();
              resumeContent = JSON.parse(cleanedContent);
            }
          }

          // 如果解析后的内容有content字段，使用那个内容
          if (resumeContent && resumeContent.content) {
            resumeContent = resumeContent.content;
          }

          return {
            id: resume.id,
            name: personInfo.basic_info.name_chn || '未知姓名',
            dynasty: personInfo.basic_info.dynasty || '未知朝代',
            modern_title: resumeContent?.modern_title || resume.modern_title || {
              position: '未知职位',
              company: '未知公司',
              industry: '未知行业'
            },
            personal_branding: resumeContent?.personal_branding || resume.personal_branding || {
              tagline: '暂无标语',
              summary: '暂无简介'
            }
          };
        } catch (e) {
          console.error('Error processing resume:', e);
          return {
            id: resume.id,
            name: '解析错误',
            dynasty: '未知朝代',
            modern_title: {
              position: '未知职位',
              company: '未知公司',
              industry: '未知行业'
            },
            personal_branding: {
              tagline: '暂无标语',
              summary: '暂无简介'
            }
          };
        }
      }));

      // 去重，保留每个id的第一条记录
      const uniqueResumes = processedResumes.reduce((acc: ResumeCard[], current: ResumeCard) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
      } else {
          return acc;
      }
      }, []);

      console.log('Final processed resumes:', uniqueResumes);
      setRecommendedResumes(uniqueResumes);
    } catch (error) {
      console.error('Error fetching recommended resumes:', error);
      message.error('获取推荐简历失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      message.warning('请输入搜索关键词');
      return;
    }

    try {
      setLoading(true);
      // 转换为繁体字进行搜索
      const traditionalValue = await convertToTraditional(value);
      // 使用API搜索历史人物
      const result = await api.searchPersons({ name: traditionalValue, limit: 20, offset: 0 });
      setSearchResult(result);
      
      // 将搜索结果转换为ResumeCard格式
      const resumeCards: ResumeCard[] = result.results.map((person: any) => ({
        id: person.personid,
        name: person.name_chn || person.name,
        dynasty: person.dynasty || '未知朝代',
        modern_title: {
          position: '历史人物',
          company: person.dynasty || '未知朝代',
          industry: '历史'
        },
        personal_branding: {
          tagline: `${person.birth_year || '?'} - ${person.death_year || '?'}`,
          summary: `${person.name_chn || person.name}，${person.dynasty || '未知朝代'}人`
        }
      }));
      
      setSearchResults(resumeCards);
      setActiveTab('search');
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = async (params: SearchParams) => {
    try {
      setLoading(true);
      const result = await api.searchPersons(params);
      setSearchResult(result);
      
      // 将搜索结果转换为ResumeCard格式
      const resumeCards: ResumeCard[] = result.results.map((person: any) => ({
        id: person.personid,
        name: person.name_chn || person.name,
        dynasty: person.dynasty || '未知朝代',
        modern_title: {
          position: '历史人物',
          company: person.dynasty || '未知朝代',
          industry: '历史'
        },
        personal_branding: {
          tagline: `${person.birth_year || '?'} - ${person.death_year || '?'}`,
          summary: `${person.name_chn || person.name}，${person.dynasty || '未知朝代'}人`
        }
      }));
      
      setSearchResults(resumeCards);
      setActiveTab('search');
    } catch (error) {
      console.error('高级搜索失败:', error);
      message.error('搜索失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const params: SearchParams = {
      ...searchResult,
      offset,
      limit: pageSize
    };
    await handleAdvancedSearch(params);
  };

  const renderResumeCard = (item: ResumeCard) => {
    const title = typeof item.content === 'object' && item.content !== null
      ? item.content.modern_title
      : item.modern_title;
    
    const branding = typeof item.content === 'object' && item.content !== null
      ? item.content.personal_branding
      : item.personal_branding;
    
    return (
      <div className="resume-grid-item">
        <Card
          key={item.id}
          hoverable
          className="resume-card"
          onClick={() => navigate(`/person/${item.id}`)}
        >
          <div className="resume-card-content">
            <div className="resume-card-header">
              <h3 className="resume-name">{item.name}</h3>
              <Tag color="blue" className="resume-dynasty">{item.dynasty}</Tag>
            </div>
            <div className="resume-card-body">
              <p className="resume-title">{title.position}</p>
              <p className="resume-company">{title.company}</p>
              <p className="resume-tagline">{branding.tagline}</p>
            </div>
          </div>
    </Card>
      </div>
    );
  };

  const renderResumeCards = (items: ResumeCard[]) => {
    if (items.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无简历数据"
        />
      );
    }

    return (
      <div className="resume-grid">
        {items.map(item => renderResumeCard(item))}
    </div>
  );
  };

  const renderSearchResults = () => {
    if (searchResult.results.length === 0) {
      return <Empty description="未找到匹配的历史人物" />;
    }

    return (
      <>
        <Title level={2}>搜索结果 ({searchResult.total})</Title>
        {renderResumeCards(searchResults)}
      </>
    );
  };

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <div className="header-content">
          <div className="header-left">
            <Title level={2} className="header-title">历史人物简历</Title>
            <div className="header-tabs">
              <Button 
                type={activeTab === 'resumes' ? 'primary' : 'text'} 
                onClick={() => setActiveTab('resumes')}
                className="header-tab"
                icon={<BookOutlined />}
              >
                推荐简历
              </Button>
              <Button 
                type={activeTab === 'advanced' ? 'primary' : 'text'} 
                onClick={() => setActiveTab('advanced')}
                className="header-tab"
                icon={<SearchOutlined />}
              >
                高级搜索
              </Button>
            </div>
          </div>
          <Search
            placeholder="搜索历史人物"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="search-input"
          />
        </div>
      </Header>
      <Content className="home-content">
        {activeTab === 'resumes' ? (
          loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Paragraph>正在加载推荐简历...</Paragraph>
            </div>
          ) : (
            renderResumeCards(recommendedResumes)
          )
        ) : (
          <>
            <div className="advanced-search-form">
              <SearchForm onSearch={handleAdvancedSearch} />
            </div>
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <Paragraph>正在搜索...</Paragraph>
              </div>
            ) : (
              renderResumeCards(searchResults)
            )}
          </>
        )}
      </Content>
      <Footer className="home-footer">
        历史人物简历库 ©{new Date().getFullYear()} Created with <span>❤️</span>
      </Footer>
    </Layout>
  );
};

export default HomePage;