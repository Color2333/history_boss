import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { theme } from './styles/theme';
import HomePage from './pages/HomePage';
import { PersonDetail } from './pages/PersonDetail';
import { SocialNetwork } from './pages/SocialNetwork';
import { ActivityMap } from './pages/ActivityMap';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminAiContent } from './pages/AdminAiContent';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/person/:personId" element={<PersonDetail />} />
            <Route path="/person/:personId/network" element={<SocialNetwork />} />
            <Route path="/person/:personId/map" element={<ActivityMap />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ai-content/:personId"
              element={
                <ProtectedRoute>
                  <AdminAiContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
};
