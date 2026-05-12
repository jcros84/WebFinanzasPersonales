import React from 'react';
import { Wallet, TrendingUp, PieChart, ChevronRight } from 'lucide-react';

const Services = () => {
  return (
    <main className="pt-32 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-text-main">Herramientas para tu éxito</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">Diseñamos soluciones financieras que eliminan la complejidad y te dan el control total.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Ahorro Inteligente */}
          <div className="glass-card p-10 hover:border-primary/30 transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform border border-primary/20">
              <Wallet className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-text-main">Ahorro Inteligente</h2>
            <p className="text-text-muted mb-6 leading-relaxed">
              Algoritmos que analizan tus patrones de gasto para identificar oportunidades de ahorro sin afectar tu estilo de vida.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              Saber más <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Inversión para Principiantes */}
          <div className="glass-card p-10 hover:border-secondary/30 transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-8 text-secondary group-hover:scale-110 transition-transform border border-secondary/20">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-text-main">Inversión 101</h2>
            <p className="text-text-muted mb-6 leading-relaxed">
              Aprende a hacer crecer tu dinero. Te guiamos paso a paso en el mundo de los fondos, acciones y ETFs con bajo riesgo.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-secondary font-bold hover:gap-3 transition-all">
              Saber más <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Gestión de Presupuestos */}
          <div className="glass-card p-10 hover:border-accent/30 transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-8 text-accent group-hover:scale-110 transition-transform border border-accent/20">
              <PieChart className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-text-main">Presupuestos Dinámicos</h2>
            <p className="text-text-muted mb-6 leading-relaxed">
              No más hojas de cálculo aburridas. Crea presupuestos visuales que se actualizan automáticamente con tus transacciones.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all">
              Saber más <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Services;
