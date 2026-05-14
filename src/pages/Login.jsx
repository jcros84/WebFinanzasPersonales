import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, UserPlus, ArrowRight, TrendingUp } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        alert('Revisa tu email para confirmar la cuenta');
      }
      navigate('/cartera');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-32 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
            <TrendingUp size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl font-black text-text-main mb-2 tracking-tight">
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h1>
          <p className="text-text-muted">
            {isLogin 
              ? 'Accede a tu cartera y gestiona tus inversiones' 
              : 'Empieza a trackear tus finanzas hoy mismo'}
          </p>
        </div>

        <div className="glass-card p-8 lg:p-10 border-white/5 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-text-muted">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">
                  <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  required 
                  placeholder="ejemplo@correo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field !pl-12 !py-3.5 bg-slate-900/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-text-muted">Contraseña</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">
                  <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pl-12 !py-3.5 bg-slate-900/50"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 font-bold text-lg group shadow-lg shadow-primary/20"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Registrarse'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-text-muted">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary font-bold hover:underline"
              >
                {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-text-muted/50 uppercase tracking-widest font-bold">
          Seguridad encriptada de grado bancario
        </p>
      </div>
    </div>
  );
};

export default Login;
