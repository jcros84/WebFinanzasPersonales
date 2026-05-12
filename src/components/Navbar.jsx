import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-md border-b border-slate-100' : 'bg-white/80 backdrop-blur-md border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
            <TrendingUp className="text-secondary w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">Finanza<span className="text-secondary">Pro</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/servicios" className={`hover:text-secondary transition-colors ${isActive('/servicios') ? 'text-secondary' : 'text-primary'}`}>Servicios</Link>
          <Link to="/blog" className={`hover:text-secondary transition-colors ${isActive('/blog') ? 'text-secondary' : 'text-primary'}`}>Blog</Link>
          {/* Desktop Dropdown Menu for Cartera */}
          <div className="relative group">
            <button
              className={`hover:text-green-600 transition-colors ${isActive('/cartera') ? 'text-green-600 font-bold' : 'text-primary'} inline-flex items-center gap-2`}
              onClick={(e) => e.preventDefault()}
            >
              Cartera
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <Link to="/cartera" className="block px-4 py-2 text-sm hover:bg-slate-100">DGI</Link>
              <Link to="/maestros" className="block px-4 py-2 text-sm hover:bg-slate-100">Maestros</Link>
            </div>
          </div>
          <Link to="/contacto" className={`hover:text-secondary transition-colors ${isActive('/contacto') ? 'text-secondary' : 'text-primary'}`}>Contacto</Link>
          <a href="#" className="btn-primary">Empezar gratis</a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link to="/servicios" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
          <Link to="/blog" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          <Link to="/cartera" className="block text-lg font-medium text-green-600" onClick={() => setIsMenuOpen(false)}>Cartera</Link>
          <Link to="/contacto" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          <a href="#" className="btn-primary block text-center">Empezar gratis</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
