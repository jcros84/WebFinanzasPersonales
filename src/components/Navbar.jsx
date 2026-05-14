import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, Menu, X, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav shadow-2xl shadow-black/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-all duration-300">
            <TrendingUp className="text-primary w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-main">Finanza<span className="text-primary">Pro</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/servicios" className={`hover:text-primary transition-colors ${isActive('/servicios') ? 'text-primary' : 'text-text-muted'}`}>Servicios</Link>
          <Link to="/blog" className={`hover:text-primary transition-colors ${isActive('/blog') ? 'text-primary' : 'text-text-muted'}`}>Blog</Link>
          
          {user ? (
            <>
              <div className="relative group">
                <button
                  className={`hover:text-primary transition-colors ${isActive('/cartera') || isActive('/maestros') ? 'text-primary font-bold' : 'text-text-muted'} inline-flex items-center gap-2`}
                >
                  Cartera
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-surface border border-slate-800 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 overflow-hidden">
                  <Link to="/cartera" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-800 text-text-main transition-colors">
                    <LayoutDashboard size={16} /> Panel DGI
                  </Link>
                  <Link to="/maestros" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-800 text-text-main transition-colors">
                    <Settings size={16} /> Maestros
                  </Link>
                </div>
              </div>
              
              <div className="h-6 w-px bg-slate-800 mx-2"></div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-text-muted font-bold uppercase tracking-tighter">Conectado como</span>
                  <span className="text-sm text-text-main font-medium">{user.email.split('@')[0]}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="p-2.5 bg-slate-800 hover:bg-rose-500/20 text-text-muted hover:text-rose-400 rounded-xl border border-slate-700 transition-all duration-300"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/contacto" className={`hover:text-primary transition-colors ${isActive('/contacto') ? 'text-primary' : 'text-text-muted'}`}>Contacto</Link>
              <Link to="/login" className="btn-primary py-2.5 flex items-center gap-2">
                <User size={18} /> Iniciar Sesión
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-text-main" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-slate-800 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link to="/servicios" className="block text-lg font-medium text-text-main" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
          <Link to="/blog" className="block text-lg font-medium text-text-main" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          {user ? (
            <>
              <Link to="/cartera" className="block text-lg font-medium text-primary" onClick={() => setIsMenuOpen(false)}>Cartera</Link>
              <Link to="/maestros" className="block text-lg font-medium text-text-main" onClick={() => setIsMenuOpen(false)}>Maestros</Link>
              <button 
                onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                className="w-full btn-outline border-rose-500/50 text-rose-400 py-3 flex items-center justify-center gap-2"
              >
                <LogOut size={20} /> Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/contacto" className="block text-lg font-medium text-text-main" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
              <Link to="/login" className="btn-primary block text-center" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

