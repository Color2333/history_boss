import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { theme } from './styles/theme';
import { HomePage } from './pages/HomePage';
import { PersonDetail } from './pages/PersonDetail';
import { SocialNetwork } from './pages/SocialNetwork';
import { ActivityMap } from './pages/ActivityMap';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
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
        </Routes>
      </Router>
    </ConfigProvider>
  );
};
