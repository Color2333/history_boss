export const API_BASE_URL = 'http://localhost:8000';

// 高德地图配置
export const AMAP_CONFIG = {
  key: import.meta.env.VITE_AMAP_KEY || '',
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE || '',
  version: import.meta.env.VITE_AMAP_VERSION || '2.0'
};