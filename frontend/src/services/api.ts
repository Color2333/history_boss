import axios from 'axios';
import { Person, Dynasty, SearchParams, SearchResult } from '../types';
import { convertObjectToSimplified } from '../utils/convert';
import { API_BASE_URL } from '../config';

export interface ResumeCard {
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
}

export const api = {
  // 获取历史人物详情
  getPerson: async (personId: number): Promise<Person> => {
    const response = await axios.get(`${API_BASE_URL}/api/person/${personId}`);
    return convertObjectToSimplified(response.data);
  },

  // 搜索历史人物
  searchPersons: async (params: SearchParams): Promise<SearchResult> => {
    const response = await axios.get(`${API_BASE_URL}/api/search`, { params });
    return convertObjectToSimplified(response.data);
  },

  // 获取所有朝代
  getDynasties: async (): Promise<Dynasty[]> => {
    const response = await axios.get(`${API_BASE_URL}/api/dynasties`);
    return convertObjectToSimplified(response.data);
  },

  // 获取人物活动
  async getPersonActivities(personId: number): Promise<any[]> {
    const response = await axios.get(`${API_BASE_URL}/api/person/${personId}/activities`);
    return response.data;
  },

  // 获取 AI 生成的内容
  async getPersonAiContent(personId: number, contentType: 'biography' | 'resume'): Promise<{ 
    content: string;
    version: number;
    status: string;
  }> {
    const response = await axios.get(`${API_BASE_URL}/api/person/${personId}/ai-content`, {
      params: { content_type: contentType }
    });
    return response.data;
  },

  // 生成 AI 内容
  async generatePersonAiContent(
    personId: number, 
    contentType: 'biography' | 'resume',
    forceRegenerate: boolean = false
  ): Promise<{ 
    content: string;
    generation_id: number;
  }> {
    const response = await axios.post(`${API_BASE_URL}/api/person/${personId}/ai-content`, null, {
      params: { 
        content_type: contentType,
        force_regenerate: forceRegenerate
      }
    });
    return response.data;
  },

  // 保存 AI 内容到 boss 数据库
  async saveToBossDb(
    personId: number,
    contentType: 'biography' | 'resume',
    content: string
  ): Promise<void> {
    await axios.post(`${API_BASE_URL}/api/person/${personId}/ai-content/save?content_type=${contentType}`, {
      content: content
    });
  },

  // 获取推荐的简历数据
  getRecommendedResumes: async (): Promise<ResumeCard[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommended-resumes`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommended resumes');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recommended resumes:', error);
      return [];
    }
  }
};

export default api;