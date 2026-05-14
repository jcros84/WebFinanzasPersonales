import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Plus, 
  ArrowUpRight,
  Wallet,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import TransactionModal from '../../components/portfolio/TransactionModal';
import DividendModal from '../../components/portfolio/DividendModal';
import { getTransactions, createTransaction, createDividend, getPortfolios, createPortfolio } from '../../services/portfolio';
import { useAuth } from '../../context/AuthContext';

const PortfolioDashboard = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isDividendOpen, setIsDividendOpen] = useState(false);
  const [showNewPortfolioModal, setShowNewPortfolioModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const { data } = await getPortfolios();
      setPortfolios(data);
      if (data.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(data[0]);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPortfolio) {
      fetchData(selectedPortfolio.id);
    }
  }, [selectedPortfolio]);

  const fetchData = async (portfolioId) => {
    try {
      setLoading(true);
      const { data: txs } = await getTransactions(portfolioId); 
      
      const formattedTxs = txs.map(tx => ({
        ...tx,
        date: new Date(tx.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
      }));
      
      setTransactions(formattedTxs);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolioName) return;
    try {
      const { data } = await createPortfolio({ name: newPortfolioName });
      setPortfolios([...portfolios, data]);
      setSelectedPortfolio(data);
      setShowNewPortfolioModal(false);
      setNewPortfolioName('');
    } catch (error) {
      alert('Error creando cartera');
    }
  };

  // --- CALCULATIONS ---
  const marketPrices = { 'SCHD': 82.30, 'AAPL': 175.50, 'KO': 62.10 };
  
  const costBasis = transactions
    .filter(tx => tx.type === 'BUY')
    .reduce((acc, tx) => acc + (tx.total || 0), 0);

  const currentMarketValue = transactions
    .filter(tx => tx.type === 'BUY')
    .reduce((acc, tx) => acc + (tx.shares * (marketPrices[tx.ticker] || tx.price)), 0);

  const totalDividends = transactions
    .filter(tx => tx.type === 'DIVIDEND')
    .reduce((acc, tx) => acc + (tx.total || 0), 0);

  const profit = currentMarketValue - costBasis;
  const profitabilityPercent = costBasis > 0 ? (profit / costBasis) * 100 : 0;
  const yieldOnCost = costBasis > 0 ? (totalDividends / costBasis) * 100 : 0;

  const stats = [
    { label: 'Valor Mercado', value: `€${currentMarketValue.toLocaleString()}`, change: `+${profitabilityPercent.toFixed(2)}%`, isPositive: profitabilityPercent >= 0 },
    { label: 'Dividendos Totales', value: `€${totalDividends.toLocaleString()}`, change: 'Acumulado', isPositive: true },
    { label: 'Plusvalía', value: `€${profit.toLocaleString()}`, change: profit >= 0 ? 'Ganancia' : 'Pérdida', isPositive: profit >= 0 },
    { label: 'Yield on Cost', value: `${yieldOnCost.toFixed(2)}%`, change: 'Eficiencia', isPositive: null },
  ];

  const typeSummary = transactions.reduce((acc, tx) => {
    if (tx.type !== 'BUY') return acc;
    const existing = acc.find(item => item.name === tx.asset_type);
    if (existing) {
      existing.value += tx.total;
    } else {
      acc.push({ name: tx.asset_type, value: tx.total });
    }
    return acc;
  }, []);

  const typeData = typeSummary.map(item => ({
    ...item,
    value: Math.round((item.value / (costBasis || 1)) * 100),
    color: item.name === 'STOCK' ? '#10b981' : item.name === 'ETF' ? '#f59e0b' : '#6366f1'
  }));

  const handleAddTransaction = async (data) => {
    try {
      const payload = {
        portfolio_id: selectedPortfolio.id,
        ticker: data.ticker.toUpperCase(),
        type: data.type,
        shares: parseFloat(data.shares),
        price_local: parseFloat(data.price),
        total_eur: parseFloat(data.shares) * parseFloat(data.price),
        date: data.date
      };
      
      await createTransaction(payload);
      fetchData(selectedPortfolio.id);
    } catch (error) {
      alert('Error guardando operación');
    }
  };

  const handleAddDividend = async (data) => {
    try {
      const payload = {
        portfolio_id: selectedPortfolio.id,
        ticker: data.ticker.toUpperCase(),
        net_amount_eur: parseFloat(data.amount),
        date: data.date
      };
      
      await createDividend(payload);
      fetchData(selectedPortfolio.id);
    } catch (error) {
      alert('Error guardando dividendo');
    }
  };

  if (loading && portfolios.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <main className="pt-32 pb-20 bg-background min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center px-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <Wallet size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-text-main mb-4">Empieza tu viaje financiero</h2>
          <p className="text-text-muted mb-10">Aún no tienes ninguna cartera creada. Crea la primera para empezar a registrar tus inversiones.</p>
          <button 
            onClick={() => setShowNewPortfolioModal(true)}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3"
          >
            <Plus size={24} /> Crear mi primera cartera
          </button>
        </div>

        {/* Modal Crear Cartera */}
        {showNewPortfolioModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-[100] px-4">
            <div className="bg-surface rounded-3xl p-8 w-full max-w-sm border border-slate-800 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-2xl font-bold text-text-main mb-6">Nueva Cartera</h3>
              <form onSubmit={handleCreatePortfolio} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-text-muted">Nombre de la cartera</label>
                  <input 
                    autoFocus
                    placeholder="Ej. Cartera Dividendos"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowNewPortfolioModal(false)} className="btn-outline flex-1">Cancelar</button>
                  <button type="submit" className="btn-primary flex-1">Crear</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 uppercase tracking-widest">Dashboard Privado</span>
              <div className="h-1 w-1 rounded-full bg-slate-700"></div>
              <span className="text-text-muted text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-text-main">
                {selectedPortfolio?.name}
              </h1>
              {/* Portfolio Selector */}
              <div className="relative group">
                <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-text-muted">
                  <ChevronDown size={24} />
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-surface border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] overflow-hidden">
                  <div className="p-3 border-b border-slate-800 bg-slate-900/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cambiar Cartera</span>
                  </div>
                  {portfolios.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setSelectedPortfolio(p)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-800 transition-colors ${selectedPortfolio?.id === p.id ? 'text-primary font-bold' : 'text-text-muted'}`}
                    >
                      <Briefcase size={16} /> {p.name}
                    </button>
                  ))}
                  <button 
                    onClick={() => setShowNewPortfolioModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/10 text-primary font-bold transition-colors border-t border-slate-800"
                  >
                    <Plus size={16} /> Nueva Cartera
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setIsDividendOpen(true)}
              className="flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-6 py-3 rounded-xl font-bold transition-all border border-orange-500/20"
            >
              <DollarSign size={20} /> Registrar Dividendo
            </button>
            <button 
              onClick={() => setIsTransactionOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20"
            >
              <Plus size={20} /> Nueva Operación
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-surface p-6 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl hover:bg-surface-hover transition-all duration-300">
              <p className="text-sm font-medium text-text-muted mb-2">{stat.label}</p>
              <h3 className="text-2xl font-bold text-text-main mb-2">{stat.value}</h3>
              <div className={`flex items-center gap-1 text-sm font-bold ${
                stat.isPositive === true ? 'text-emerald-400' : 
                stat.isPositive === false ? 'text-rose-400' : 'text-text-muted'
              }`}>
                {stat.isPositive === true ? <TrendingUp size={14} /> : 
                 stat.isPositive === false ? <TrendingDown size={14} /> : null}
                {stat.change}
                <span className="font-medium text-slate-500 ml-1">acumulado</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-1 bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <PieChartIcon className="text-orange-500" /> Distribución
            </h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {typeData.length > 0 ? typeData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-text-muted font-medium">{item.name || 'Otros'}</span>
                  </div>
                  <span className="font-bold text-text-main">{item.value}%</span>
                </div>
              )) : <p className="text-center text-text-muted text-sm py-4">Sin datos suficientes</p>}
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <DollarSign className="text-emerald-500" /> Historial
            </h4>
            <div className="h-[300px] flex items-center justify-center">
               <p className="text-text-muted italic">Registra operaciones para ver el gráfico de rendimiento.</p>
            </div>
          </div>
        </div>

        {/* Recent Operations Table */}
        <div className="bg-surface rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <h4 className="text-xl font-bold text-text-main">Últimas Operaciones</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-text-muted text-sm uppercase tracking-wider">
                  <th className="px-8 py-4 font-bold">Fecha</th>
                  <th className="px-8 py-4 font-bold">Activo</th>
                  <th className="px-8 py-4 font-bold">Tipo</th>
                  <th className="px-8 py-4 font-bold">Cantidad</th>
                  <th className="px-8 py-4 font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.length > 0 ? transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-4 text-text-muted">{tx.date}</td>
                    <td className="px-8 py-4 font-bold text-text-main">{tx.ticker}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        tx.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' :
                        tx.type === 'SELL' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {tx.type === 'BUY' ? 'Compra' : 
                         tx.type === 'SELL' ? 'Venta' : 'Dividendo'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-text-muted">{tx.shares || '-'}</td>
                    <td className={`px-8 py-4 font-bold ${tx.type === 'DIVIDEND' ? 'text-emerald-400' : 'text-text-main'}`}>
                      €{(tx.total_eur || tx.net_amount_eur || 0).toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-text-muted">No hay operaciones registradas en esta cartera.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TransactionModal 
        isOpen={isTransactionOpen} 
        onClose={() => setIsTransactionOpen(false)} 
        onSubmit={handleAddTransaction} 
      />
      <DividendModal 
        isOpen={isDividendOpen} 
        onClose={() => setIsDividendOpen(false)} 
        onSubmit={handleAddDividend} 
      />

      {/* Modal Crear Cartera */}
      {showNewPortfolioModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-[100] px-4">
          <div className="bg-surface rounded-3xl p-8 w-full max-w-sm border border-slate-800 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-bold text-text-main mb-6">Nueva Cartera</h3>
            <form onSubmit={handleCreatePortfolio} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-text-muted">Nombre de la cartera</label>
                <input 
                  autoFocus
                  placeholder="Ej. Cartera Dividendos"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowNewPortfolioModal(false)} className="btn-outline flex-1">Cancelar</button>
                <button type="submit" className="btn-primary flex-1">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default PortfolioDashboard;

