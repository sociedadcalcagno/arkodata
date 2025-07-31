import { useState } from 'react';
import { useLocation } from 'wouter';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import { ArrowLeft } from 'lucide-react';

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const validateLogin = (username: string, password: string) => {
    return username === 'admin' && password === 'ArkoAdmin2024!';
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const goBack = () => {
    setLocation('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <button
              onClick={goBack}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al sitio
            </button>
            <h1 className="text-2xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-gray-400">ArkoData Dashboard Privado</p>
          </div>
          <AdminLogin 
            onLogin={(success) => handleLogin(success)}
            onClose={goBack} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminDashboard 
        onClose={goBack} 
        onLogout={handleLogout} 
      />
    </div>
  );
}