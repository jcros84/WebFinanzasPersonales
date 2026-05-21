import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <TrendingUp className="text-primary w-6 h-6" />
            </div>
            <span className="text-xl font-bold">FinanzaPro</span>
          </Link>
          <p className="text-slate-400">Transformando la relación con tu dinero a través del diseño y la tecnología.</p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Producto</h4>
          <ul className="space-y-4 text-slate-400">
            <li><Link to="/servicios" className="hover:text-white transition-colors">Servicios</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Recursos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Companyía</h4>
          <ul className="space-y-4 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
            <li><Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Newsletter</h4>
          <p className="text-slate-400 mb-4">Recibe consejos financieros cada semana.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Tu email"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-secondary" />
            <button className="bg-secondary p-2 rounded-lg hover:bg-accent transition-colors">
              <Send className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/10 text-center text-slate-500 text-sm">
        <p>&copy; 2026 FinanzaPro. Todos los derechos reservados. Diseñado por Antigravity.</p>
      </div>
    </footer>
  );
};

export default Footer;
