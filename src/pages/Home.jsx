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
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 font-semibold text-sm rounded-full mb-6">
              Nueva era financiera
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Tu dinero, <br />
              <span className="text-secondary">bajo control.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              Diseñado para quienes buscan simplicidad y precisión. Gestión inteligente de presupuestos, ahorros e
              inversiones en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/servicios" className="btn-primary text-center">Explorar herramientas</Link>
              <Link to="/contacto" className="btn-outline text-center flex items-center justify-center gap-2">
                Solicitar demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-4 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400"></div>
              </div>
              <span>+2,000 personas ya confían en nosotros</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            <img src="/assets/hero.png" alt="FinanzaPro Dashboard"
              className="relative z-10 w-full rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-16">¿Cómo funciona FinanzaPro?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 text-secondary">
                <Wallet className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Conecta tus cuentas</h3>
              <p className="text-slate-600">Sincronización bancaria segura y automática en segundos.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 text-secondary">
                <PieChart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Analiza tus gastos</h3>
              <p className="text-slate-600">Visualiza dónde va tu dinero con gráficos inteligentes y simples.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 text-secondary">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Alcanza tus metas</h3>
              <p className="text-slate-600">Crea presupuestos dinámicos que se adaptan a tu ritmo de vida.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
