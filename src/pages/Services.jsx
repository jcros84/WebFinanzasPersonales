import React from 'react';
import { Wallet, TrendingUp, PieChart, ChevronRight } from 'lucide-react';

const Services = () => {
  return (
    <main className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Herramientas para tu éxito</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Diseñamos soluciones financieras que eliminan la complejidad y te dan el control total.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ahorro Inteligente */}
          <div className="glass-card p-10 hover:border-blue-200 transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-8 text-secondary group-hover:scale-110 transition-transform">
              <Wallet className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Ahorro Inteligente</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Algoritmos que analizan tus patrones de gasto para identificar oportunidades de ahorro sin afectar tu estilo de vida.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
              Saber más <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Inversión para Principiantes */}
          <div className="glass-card p-10 hover:border-blue-200 transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-8 text-blue-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Inversión 101</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Aprende a hacer crecer tu dinero. Te guiamos paso a paso en el mundo de los fondos, acciones y ETFs con bajo riesgo.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
              Saber más <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Gestión de Presupuestos */}
          <div className="glass-card p-10 hover:border-blue-200 transition-all group">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-8 text-purple-600 group-hover:scale-110 transition-transform">
              <PieChart className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Presupuestos Dinámicos</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              No más hojas de cálculo aburridas. Crea presupuestos visuales que se actualizan automáticamente con tus transacciones.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
              Saber más <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Services;
