import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SearchParams } from '../types';
import { api } from '../services/api';
import { convertToTraditional } from '../utils/convert';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [form] = Form.useForm();
  const [dynasties, setDynasties] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchDynasties = async () => {
      try {
        console.log('Fetching dynasties...');
        const data = await api.getDynasties();
        console.log('Received dynasties:', data);
        // 确保 data 是数组
        const dynastyArray = Array.isArray(data) ? data : Object.values(data);
        setDynasties(dynastyArray.map(d => ({
          label: d.dynasty_chn,
          value: d.dynasty
        })));
      } catch (error) {
        console.error('Failed to fetch dynasties:', error);
      }
    };

    fetchDynasties();
  }, []);

  const handleSubmit = (values: any) => {
    console.log('Form submitted with values:', values);
    const originalName = values.name;
    const convertedName = originalName ? convertToTraditional(originalName) : undefined;
    console.log('Name conversion:', { original: originalName, converted: convertedName });
    
    const params: SearchParams = {
      name: convertedName,
      dynasty: values.dynasty,
      birth_year_from: values.birthYear?.[0]?.year(),
      birth_year_to: values.birthYear?.[1]?.year(),
      limit: 20,
      offset: 0
    };
    console.log('Search params:', params);
    onSearch(params);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 800, margin: '0 auto' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form.Item name="name" label="姓名">
          <Input placeholder="输入历史人物姓名" />
        </Form.Item>

        <Form.Item name="dynasty" label="朝代">
          <Select placeholder="选择朝代" allowClear>
            {dynasties.map((dynasty, index) => (
              <Option key={index} value={dynasty.value}>
                {dynasty.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="birthYear" label="出生年份">
          <RangePicker picker="year" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            搜索
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
}; 