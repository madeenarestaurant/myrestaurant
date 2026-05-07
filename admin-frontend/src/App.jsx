import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './pages/NotFound';
import useThemeStore from './store/useThemeStore';

function App() {
  const { syncTheme } = useThemeStore();

  useEffect(() => {
    syncTheme();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
            path="/" 
            element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            } 
        />
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
