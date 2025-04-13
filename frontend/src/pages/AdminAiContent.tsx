import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, message, Spin, Typography, Alert, Tabs, Descriptions, Space, Input, Badge, Tag } from 'antd';
import { api } from '../services/api';
import { ResumeRenderer } from '../components/ResumeRenderer';
import type { Person } from '../types';
import { EditOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const AdminAiContent: React.FC = () => {
  const { personId } = useParams<{ personId: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [rawPerson, setRawPerson] = useState<any>(null); // 存储原始数据
  const [biography, setBiography] = useState<string>('');
  const [resume, setResume] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'biography' | 'resume'>('biography');
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');
  
  // 添加内容状态和版本信息
  const [biographyStatus, setBiographyStatus] = useState<string>('not_found');
  const [biographyVersion, setBiographyVersion] = useState<number>(0);
  const [resumeStatus, setResumeStatus] = useState<string>('not_found');
  const [resumeVersion, setResumeVersion] = useState<number>(0);

  // 加载人物数据和AI内容
  const loadData = async () => {
    if (!personId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 获取人物基本信息，同时保存原始响应数据
      try {
        // 直接获取原始数据
        const response = await axios.get(`http://localhost:8000/api/person/${personId}`);
        const rawData = response.data;
        console.log('=== 调试信息: 原始API响应 ===', rawData);
        console.log('=== 调试信息: basic_info ===', rawData.basic_info);
        setRawPerson(rawData); // 保存原始数据供直接使用
        
        // 正常获取转换后的数据用于其他地方
        const personData = await api.getPerson(parseInt(personId));
        console.log('=== 调试信息: 转换后数据 ===', personData);
        setPerson(personData);
      } catch (personErr) {
        console.error("获取人物信息失败:", personErr);
        setError('无法加载人物信息');
      }
      
      try {
        // 获取传记内容
        console.log('=== 调试信息: 开始获取传记内容 ===');
        const biographyContent = await api.getPersonAiContent(parseInt(personId), 'biography');
        console.log('=== 调试信息: 传记内容响应 ===', biographyContent);
        if (biographyContent && biographyContent.content) {
          console.log('=== 调试信息: 设置传记内容 ===', biographyContent.content);
          setBiography(biographyContent.content);
          setBiographyStatus(biographyContent.status);
          setBiographyVersion(biographyContent.version);
        } else {
          console.log('=== 调试信息: 传记内容为空 ===');
        }
      } catch (bioErr) {
        console.error('=== 调试信息: 获取传记内容失败 ===', bioErr);
        // 不设置错误，因为可能是内容不存在
        setBiographyStatus('not_found');
      }

      try {
        // 获取简历内容
        console.log('=== 调试信息: 开始获取简历内容 ===');
        const resumeContent = await api.getPersonAiContent(parseInt(personId), 'resume');
        console.log('=== 调试信息: 简历内容响应 ===', resumeContent);
        if (resumeContent && resumeContent.content) {
          try {
            // 尝试解析嵌套的JSON字符串
            let parsedContent = resumeContent.content;
            
            // 检查是否是JSON字符串
            if (typeof parsedContent === 'string') {
              parsedContent = JSON.parse(parsedContent);
              
              // 检查是否嵌套了content字段
              if (parsedContent.content && typeof parsedContent.content === 'string') {
                parsedContent = parsedContent.content;
              }
            }
            
            console.log('=== 调试信息: 解析后的简历内容 ===', parsedContent);
            setResume(parsedContent);
            setResumeStatus(resumeContent.status);
            setResumeVersion(resumeContent.version);
          } catch (parseErr) {
            console.error('=== 调试信息: 简历内容解析失败 ===', parseErr);
            // 使用原始内容
            setResume(resumeContent.content);
            setResumeStatus(resumeContent.status);
            setResumeVersion(resumeContent.version);
          }
        } else {
          console.log('=== 调试信息: 简历内容为空 ===');
        }
      } catch (resumeErr) {
        console.error('=== 调试信息: 获取简历内容失败 ===', resumeErr);
        // 不设置错误，因为可能是内容不存在
        setResumeStatus('not_found');
      }
    } catch (err) {
      console.error('=== 调试信息: 加载数据总错误 ===', err);
      setError('加载数据失败，请检查网络连接或稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [personId]);

  // 生成AI内容
  const generateAiContent = async () => {
    if (!personId) return;
    
    try {
      setGenerating(true);
      setError(null);
      const result = await api.generatePersonAiContent(parseInt(personId), activeTab, true);
      if (activeTab === 'biography') {
        setBiography(result.content);
        setBiographyStatus(result.status);
        setBiographyVersion(result.version);
      } else {
        setResume(result.content);
        setResumeStatus(result.status);
        setResumeVersion(result.version);
      }
      message.success('AI内容生成成功');
    } catch (err) {
      setError('生成AI内容失败');
    } finally {
      setGenerating(false);
    }
  };

  // 保存到boss数据库
  const saveToBoss = async () => {
    if (!personId) return;
    const content = editMode ? editContent : (activeTab === 'biography' ? biography : resume);
    
    if (!content) {
      message.warning('请先生成内容');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      await api.saveToBossDb(parseInt(personId), activeTab, content);
      message.success('保存到boss数据库成功');
      
      if (editMode) {
        // 更新当前内容并退出编辑模式
        if (activeTab === 'biography') {
          setBiography(editContent);
        } else {
          setResume(editContent);
        }
        setEditMode(false);
      }
      
      // 重新加载内容以获取最新状态
      try {
        const newContent = await api.getPersonAiContent(parseInt(personId), activeTab);
        if (activeTab === 'biography') {
          setBiography(newContent.content || '');
          setBiographyStatus(newContent.status);
          setBiographyVersion(newContent.version);
        } else {
          setResume(newContent.content || '');
          setResumeStatus(newContent.status);
          setResumeVersion(newContent.version);
        }
      } catch (loadErr) {
        // 忽略加载错误
      }
    } catch (err) {
      setError('保存到boss数据库失败');
    } finally {
      setSaving(false);
    }
  };

  // 切换编辑模式
  const toggleEditMode = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      setEditContent(activeTab === 'biography' ? biography : resume);
      setEditMode(true);
    }
  };

  // 获取当前内容状态
  const getCurrentStatus = () => {
    if (activeTab === 'biography') {
      return biographyStatus;
    } else {
      return resumeStatus;
    }
  };

  // 获取内容版本
  const getCurrentVersion = () => {
    if (activeTab === 'biography') {
      return biographyVersion;
    } else {
      return resumeVersion;
    }
  };

  // 生成状态标签
  const renderStatusTag = (status: string) => {
    if (status === 'published') {
      return <Tag color="green">已发布</Tag>;
    } else if (status === 'draft') {
      return <Tag color="orange">草稿</Tag>;
    } else {
      return <Tag color="default">未创建</Tag>;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="正在加载人物信息..." />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!person && !rawPerson) {
    console.log('=== 调试信息: 未找到人物信息 ===', { person, rawPerson });
    return <Alert type="warning" message="未找到人物信息" />;
  }

  // 优先使用原始数据显示基本信息
  const dataForDisplay = rawPerson || person || {};
  console.log('=== 调试信息: dataForDisplay ===', dataForDisplay);
  
  const basicInfo = dataForDisplay.basic_info || {};
  console.log('=== 调试信息: basicInfo ===', basicInfo);
  
  // 确保数据字段存在
  const displayName = basicInfo.name_chn || '';
  const displayEnName = basicInfo.name || '';
  const displayDynasty = basicInfo.dynasty || '';
  const displayGender = basicInfo.gender || '';
  const birthYear = basicInfo.birth_year || '?';
  const deathYear = basicInfo.death_year || '?';
  
  console.log('=== 调试信息: 显示用数据 ===', {
    displayName,
    displayEnName,
    displayDynasty,
    displayGender,
    birthYear,
    deathYear
  });

  // 构建姓名显示，如果有英文名，则添加括号
  const fullDisplayName = displayEnName && displayName !== displayEnName ? 
    `${displayName} (${displayEnName})` : displayName;

  const renderContent = () => {
    // 编辑模式下显示编辑器
    if (editMode) {
      return (
        <TextArea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={20}
          style={{ marginBottom: '16px' }}
        />
      );
    }

    // 显示内容或提示信息
    const content = activeTab === 'biography' ? biography : resume;
    if (!content) {
      return (
        <Alert
          message={activeTab === 'biography' ? '未生成传记' : '未生成简历'}
          description={`点击"生成${activeTab === 'biography' ? '传记' : '简历'}"按钮生成内容。`}
          type="info"
          showIcon
        />
      );
    }

    if (activeTab === 'biography') {
      return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>;
    } else {
      try {
        return <ResumeRenderer data={JSON.parse(content)} />;
      } catch (e) {
        return (
          <Alert
            message="简历格式错误"
            description="简历JSON格式无效，请重新生成或检查内容。"
            type="error"
            showIcon
          />
        );
      }
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>AI内容生成</Title>
        <Paragraph>在此页面，您可以输入人物ID，自动生成AI内容，审核后保存到boss.db数据库。</Paragraph>
        <Text strong>ID: {personId}</Text>

        <Card title="人物信息" style={{ marginTop: '16px' }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="姓名">{fullDisplayName}</Descriptions.Item>
            <Descriptions.Item label="朝代">{displayDynasty}</Descriptions.Item>
            <Descriptions.Item label="生卒年">{birthYear} - {deathYear}</Descriptions.Item>
            <Descriptions.Item label="性别">{displayGender}</Descriptions.Item>
          </Descriptions>
        </Card>
        
        <div style={{ marginTop: '24px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key as 'biography' | 'resume');
              setEditMode(false); // 切换标签时退出编辑模式
            }}
            items={[
              {
                key: 'biography',
                label: (
                  <span>
                    传记 {renderStatusTag(biographyStatus)}
                    {biographyVersion > 0 && <Badge count={`v${biographyVersion}`} style={{ marginLeft: 8, backgroundColor: '#52c41a' }} />}
                  </span>
                ),
                children: (
                  <div>
                    <Space style={{ marginBottom: '16px' }}>
                      <Button 
                        type="primary" 
                        icon={<SyncOutlined />} 
                        onClick={generateAiContent} 
                        loading={generating}
                        disabled={saving}
                      >
                        生成传记
                      </Button>
                      
                      <Button 
                        icon={<EditOutlined />} 
                        onClick={toggleEditMode}
                        type={editMode ? "primary" : "default"}
                        disabled={generating || saving}
                      >
                        {editMode ? "取消编辑" : "编辑内容"}
                      </Button>
                      
                      <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        onClick={saveToBoss} 
                        loading={saving}
                        disabled={generating}
                      >
                        保存到数据库
                      </Button>
                    </Space>
                    
                    {biographyStatus === 'published' && !editMode && (
                      <Alert
                        message="已发布内容"
                        description={`当前显示的是已发布的版本 v${biographyVersion}。编辑后保存将创建新版本。`}
                        type="success"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                    )}
                    
                    {renderContent()}
                  </div>
                ),
              },
              {
                key: 'resume',
                label: (
                  <span>
                    简历 {renderStatusTag(resumeStatus)}
                    {resumeVersion > 0 && <Badge count={`v${resumeVersion}`} style={{ marginLeft: 8, backgroundColor: '#52c41a' }} />}
                  </span>
                ),
                children: (
                  <div>
                    <Space style={{ marginBottom: '16px' }}>
                      <Button 
                        type="primary" 
                        icon={<SyncOutlined />} 
                        onClick={generateAiContent}
                        loading={generating}
                        disabled={saving}
                      >
                        生成简历
                      </Button>
                      
                      <Button 
                        icon={<EditOutlined />} 
                        onClick={toggleEditMode}
                        type={editMode ? "primary" : "default"}
                        disabled={generating || saving || activeTab === 'resume'} // 简历JSON格式复杂，不适合直接编辑
                      >
                        {editMode ? "取消编辑" : "编辑内容"}
                      </Button>
                      
                      <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        onClick={saveToBoss}
                        loading={saving}
                        disabled={generating}
                      >
                        保存到数据库
                      </Button>
                    </Space>
                    
                    {resumeStatus === 'published' && !editMode && (
                      <Alert
                        message="已发布内容"
                        description={`当前显示的是已发布的版本 v${resumeVersion}。编辑后保存将创建新版本。`}
                        type="success"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                    )}
                    
                    {renderContent()}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
};