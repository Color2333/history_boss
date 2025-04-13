import { Converter } from 'opencc-js';

// 创建转换器
const toTraditional = Converter({ from: 'cn', to: 'tw' });
const toSimplified = Converter({ from: 'tw', to: 'cn' });

// 简体转繁体（用于搜索）
export const convertToTraditional = (text: string): string => {
  return toTraditional(text);
};

// 繁体转简体（用于显示）
export const convertToSimplified = (text: string): string => {
  return toSimplified(text);
};

// 检查对象是否为类数组对象（有数字索引且有length属性）
const isArrayLike = (obj: any): boolean => {
  if (Array.isArray(obj)) return true;
  
  // 检查对象是否有连续的数字键名，如 {0: {...}, 1: {...}, ...}
  if (typeof obj !== 'object' || obj === null) return false;
  
  const keys = Object.keys(obj);
  // 排除空对象
  if (keys.length === 0) return false;
  
  // 检查键是否全是数字且是连续的，从0开始
  for (let i = 0; i < keys.length; i++) {
    if (!obj.hasOwnProperty(i.toString())) return false;
  }
  
  return true;
};

// 转换对象中的所有字符串属性为简体（用于显示）
export const convertObjectToSimplified = <T extends Record<string, any>>(obj: T): T => {
  
  // 处理null或undefined
  if (obj === null || obj === undefined) return obj;
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'string') {
        return convertToSimplified(item);
      } else if (typeof item === 'object' && item !== null) {
        return convertObjectToSimplified(item);
      }
      return item;
    }) as unknown as T;
  }
  
  // 处理类数组对象（如后端返回的带数字键的对象）
  if (isArrayLike(obj)) {
    const arrayResult = [];
    for (let i = 0; i < Object.keys(obj).length; i++) {
      arrayResult.push(convertObjectToSimplified(obj[i]));
    }
    return arrayResult as unknown as T;
  }
  
  // 处理普通对象
  const result = { ...obj };
  
  // 特殊处理 basic_info 对象
  const basicInfo = (result as any).basic_info;
  if (basicInfo && typeof basicInfo === 'object') {
    const convertedBasicInfo = { ...basicInfo };
    for (const key in convertedBasicInfo) {
      if (typeof convertedBasicInfo[key] === 'string' && /[\u4e00-\u9fa5]/.test(convertedBasicInfo[key])) {
        convertedBasicInfo[key] = convertToSimplified(convertedBasicInfo[key]);
      }
    }
    (result as any).basic_info = convertedBasicInfo;
  }
  
  // 处理其他属性
  for (const key in result) {
    if (key === 'basic_info') continue; // 跳过已处理的 basic_info
    
    if (typeof result[key] === 'string') {
      // 只转换中文字符串
      if (/[\u4e00-\u9fa5]/.test(result[key])) {
        (result[key] as string) = convertToSimplified(result[key]);
      }
    } else if (Array.isArray(result[key])) {
      result[key] = result[key].map((item: any) => {
        if (typeof item === 'string') {
          // 只转换中文字符串
          if (/[\u4e00-\u9fa5]/.test(item)) {
            return convertToSimplified(item);
          }
          return item;
        } else if (typeof item === 'object' && item !== null) {
          return convertObjectToSimplified(item);
        }
        return item;
      });
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = convertObjectToSimplified(result[key]);
    }
  }
  
  return result;
};