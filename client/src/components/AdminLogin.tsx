import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

export default function AdminLogin({ onLogin, onClose }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular verificación (en producción esto sería una API)
    setTimeout(() => {
      if (password === 'ArkoAdmin2024!') {
        onLogin(true);
        localStorage.setItem('arko_admin_session', Date.now().toString());
      } else {
        setError('Contraseña incorrecta');
        onLogin(false);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Acceso Administrativo</h3>
          <p className="text-gray-400">Ingresa la contraseña para acceder al dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña de Administrador
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:outline-none transition-colors"
                placeholder="Ingresa la contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Acceder</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-xs text-gray-500 text-center">
            ⚠️ Solo personal autorizado de ArkoData
          </p>
        </div>
      </div>
    </div>
  );
}