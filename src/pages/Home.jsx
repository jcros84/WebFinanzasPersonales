import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, PieChart, Target } from 'lucide-react';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold text-sm rounded-full mb-6 border border-primary/20">
              Nueva era financiera
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-text-main">
              Tu dinero, <br />
              <span className="text-primary">bajo control.</span>
            </h1>
            <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed">
              Diseñado para quienes buscan simplicidad y precisión. Gestión inteligente de presupuestos, ahorros e
              inversiones en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/servicios" className="btn-primary text-center">Explorar herramientas</Link>
              <Link to="/contacto" className="btn-outline text-center flex items-center justify-center gap-2">
                Solicitar demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-4 text-sm text-text-muted font-medium">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-700"></div>
                <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-600"></div>
                <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-500"></div>
              </div>
              <span>+2,000 personas ya confían en nosotros</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl opacity-50"></div>
            <img src="/src/assets/hero.png" alt="FinanzaPro Dashboard"
              className="relative z-10 w-full rounded-2xl shadow-2xl shadow-primary/10 border border-slate-800 hover:scale-[1.02] transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-16 text-text-main">¿Cómo funciona FinanzaPro?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-surface border border-slate-800 rounded-2xl shadow-lg flex items-center justify-center mb-6 text-primary">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-main">Conecta tus cuentas</h3>
              <p className="text-text-muted">Sincronización bancaria segura y automática en segundos.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-surface border border-slate-800 rounded-2xl shadow-lg flex items-center justify-center mb-6 text-secondary">
                <PieChart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-main">Analiza tus gastos</h3>
              <p className="text-text-muted">Visualiza dónde va tu dinero con gráficos inteligentes y simples.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-surface border border-slate-800 rounded-2xl shadow-lg flex items-center justify-center mb-6 text-accent">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-main">Alcanza tus metas</h3>
              <p className="text-text-muted">Crea presupuestos dinámicos que se adaptan a tu ritmo de vida.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
