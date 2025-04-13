import axios from 'axios';
import { Person, Dynasty, SearchParams, SearchResult } from '../types';
import { convertObjectToSimplified } from '../utils/convert';

export const api = {
  // 获取历史人物详情
  getPerson: async (personId: number): Promise<Person> => {
    console.log('Fetching person with ID:', personId);
    const response = await axios.get(`/api/person/${personId}`);
    console.log('Raw API response:', response.data);
    const convertedData = convertObjectToSimplified(response.data);
    console.log('Converted data:', convertedData);
    console.log('Basic info:', convertedData.basic_info);
    return convertedData;
  },

  // 搜索历史人物
  searchPersons: async (params: SearchParams): Promise<SearchResult> => {
    console.log('Searching with params:', params);
    const response = await axios.get(`/api/search`, { params });
    console.log('Search response:', response.data);
    return convertObjectToSimplified(response.data);
  },

  // 获取所有朝代
  getDynasties: async (): Promise<Dynasty[]> => {
    console.log('Fetching dynasties...');
    const response = await axios.get(`/api/dynasties`);
    console.log('Dynasties response:', response.data);
    return convertObjectToSimplified(response.data);
  },

  async getPersonActivities(personId: number): Promise<any[]> {
    console.log('Fetching activities for person ID:', personId);
    const response = await fetch(`/api/person/${personId}/activities`);
    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Activities response:', data);
    return data;
  },

  // 获取 AI 生成的内容
  async getPersonAiContent(personId: number, contentType: 'biography' | 'resume'): Promise<{ 
    content: string;
    version: number;
    status: string;
  }> {
    console.log(`Fetching ${contentType} for person ID:`, personId);
    const response = await axios.get(`/api/person/${personId}/ai-content`, {
      params: { content_type: contentType }
    });
    console.log(`${contentType} response:`, response.data);
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
    console.log(`Generating ${contentType} for person ID:`, personId);
    const response = await axios.post(`/api/person/${personId}/ai-content`, null, {
      params: { 
        content_type: contentType,
        force_regenerate: forceRegenerate
      }
    });
    console.log(`Generated ${contentType} response:`, response.data);
    return response.data;
  },

  // 保存 AI 内容到 boss 数据库
  async saveToBossDb(
    personId: number,
    contentType: 'biography' | 'resume',
    content: string
  ): Promise<void> {
    console.log(`Saving ${contentType} to boss DB for person ID:`, personId);
    const response = await axios.post(`/api/person/${personId}/ai-content/save?content_type=${contentType}`, {
      content: content
    });
    console.log(`Save to boss DB response:`, response.data);
  }
};