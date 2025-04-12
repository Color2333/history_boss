import { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1a73e8', // Google Blue
    colorInfo: '#1a73e8',
    colorSuccess: '#34a853', // Google Green
    colorWarning: '#fbbc05', // Google Yellow
    colorError: '#ea4335', // Google Red
    borderRadius: 8,
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8f9fa',
    colorText: '#202124',
    colorTextSecondary: '#5f6368',
    colorBorder: '#dadce0',
    fontSize: 14,
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Card: {
      colorBgContainer: '#ffffff',
      boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
      borderRadius: 8,
    },
    Table: {
      colorBgContainer: '#ffffff',
      borderRadius: 8,
      headerBg: '#f8f9fa',
      headerColor: '#202124',
      headerSplitColor: '#dadce0',
    },
    Button: {
      borderRadius: 4,
    },
    Tabs: {
      colorPrimary: '#1a73e8',
      itemSelectedColor: '#1a73e8',
      inkBarColor: '#1a73e8',
    },
    Tag: {
      borderRadius: 4,
    },
  },
}; 