import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Plus, 
  ArrowUpRight 
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
import { useEffect } from 'react';
import { getTransactions, createTransaction, createDividend } from '../../services/portfolio';

const PortfolioDashboard = () => {
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isDividendOpen, setIsDividendOpen] = useState(false);
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // For now we fetch all transactions. In a real app, we'd filter by portfolio.
      const { data: txs } = await getTransactions(); 
      
      // Transform date for display if needed, though Supabase returns ISO
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

  // --- CALCULATIONS ---
  
  // 1. Cost Basis & Current Value (Mock current price for profit demo)
  const marketPrices = { 'SCHD': 82.30, 'AAPL': 175.50, 'KO': 62.10 };
  
  const costBasis = transactions
    .filter(tx => tx.type === 'BUY')
    .reduce((acc, tx) => acc + tx.total, 0);

  const currentMarketValue = transactions
    .filter(tx => tx.type === 'BUY')
    .reduce((acc, tx) => acc + (tx.shares * (marketPrices[tx.ticker] || tx.price)), 0);

  const totalDividends = transactions
    .filter(tx => tx.type === 'DIVIDEND')
    .reduce((acc, tx) => acc + tx.total, 0);

  const profit = currentMarketValue - costBasis;
  const profitabilityPercent = costBasis > 0 ? (profit / costBasis) * 100 : 0;
  const yieldOnCost = costBasis > 0 ? (totalDividends / costBasis) * 100 : 0;

  const stats = [
    { label: 'Valor Mercado', value: `€${currentMarketValue.toLocaleString()}`, change: `+${profitabilityPercent.toFixed(2)}%`, isPositive: profitabilityPercent >= 0 },
    { label: 'Dividendos Totales', value: `€${totalDividends.toLocaleString()}`, change: 'Acumulado', isPositive: true },
    { label: 'Plusvalía', value: `€${profit.toLocaleString()}`, change: profit >= 0 ? 'Ganancia' : 'Pérdida', isPositive: profit >= 0 },
    { label: 'Yield on Cost', value: `${yieldOnCost.toFixed(2)}%`, change: 'Eficiencia', isPositive: null },
  ];

  // 2. Charts Aggregation
  const typeSummary = transactions.reduce((acc, tx) => {
    if (tx.type !== 'BUY') return acc;
    const existing = acc.find(item => item.name === tx.assetType);
    if (existing) {
      existing.value += tx.total;
    } else {
      acc.push({ name: tx.assetType, value: tx.total });
    }
    return acc;
  }, []);

  const typeData = typeSummary.map(item => ({
    ...item,
    value: Math.round((item.value / costBasis) * 100),
    color: item.name === 'STOCK' ? '#10b981' : item.name === 'ETF' ? '#f59e0b' : '#6366f1'
  }));

  const monthlyDividends = transactions
    .filter(tx => tx.type === 'DIVIDEND')
    .reduce((acc, tx) => {
      const month = tx.date.split(' ')[1]; // Simplistic extraction
      const existing = acc.find(item => item.month === month);
      if (existing) existing.amount += tx.total;
      else acc.push({ month, amount: tx.total });
      return acc;
    }, [])
    .reverse();

  const handleAddTransaction = async (data) => {
    try {
      const payload = {
        ticker: data.ticker.toUpperCase(),
        type: data.type,
        shares: parseFloat(data.shares),
        price: parseFloat(data.price),
        total: parseFloat(data.shares) * parseFloat(data.price),
        asset_type: data.assetType,
        date: data.date
      };
      
      await createTransaction(payload);
      fetchData(); // Refresh
    } catch (error) {
      alert('Error guardando operación');
    }
  };

  const handleAddDividend = async (data) => {
    try {
      const payload = {
        ticker: data.ticker.toUpperCase(),
        amount: parseFloat(data.amount),
        date: data.date
      };
      
      await createDividend(payload);
      fetchData(); // Refresh
    } catch (error) {
      alert('Error guardando dividendo');
    }
  };

  return (
    <main className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-text-main mb-2">Mi Cartera de Dividendos</h1>
            <p className="text-text-muted">Gestión y seguimiento de tus activos generadores de rentas.</p>
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
                <span className="font-medium text-slate-500 ml-1">vs mes pasado</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Summary by Type */}
          <div className="lg:col-span-1 bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <PieChartIcon className="text-orange-500" /> Resumen por Tipo
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
              {typeData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-text-muted font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-text-main">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Dividends */}
          <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <DollarSign className="text-emerald-500" /> Dividendos Mensuales
            </h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyDividends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Operations Table */}
        <div className="bg-surface rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <h4 className="text-xl font-bold text-text-main">Últimas Operaciones</h4>
            <button className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1">
              Ver todas <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-text-muted text-sm uppercase tracking-wider">
                  <th className="px-8 py-4 font-bold">Fecha</th>
                  <th className="px-8 py-4 font-bold">Activo</th>
                  <th className="px-8 py-4 font-bold">Tipo</th>
                  <th className="px-8 py-4 font-bold">Cantidad</th>
                  <th className="px-8 py-4 font-bold">Precio</th>
                  <th className="px-8 py-4 font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-4 text-text-muted">{tx.date}</td>
                    <td className="px-8 py-4 font-bold text-text-main">{tx.ticker}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        tx.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' :
                        tx.type === 'SELL' ? 'bg-rose-500/10 text-rose-400' :
                        tx.type === 'DRIP' ? 'bg-indigo-500/10 text-indigo-400' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {tx.type === 'BUY' ? 'Compra' : 
                         tx.type === 'SELL' ? 'Venta' : 
                         tx.type === 'DRIP' ? 'DRIP' : 'Dividendo'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-text-muted">{tx.shares}</td>
                    <td className="px-8 py-4 text-text-muted">{tx.price !== '-' ? `€${tx.price}` : '-'}</td>
                    <td className={`px-8 py-4 font-bold ${tx.type === 'DIVIDEND' ? 'text-emerald-400' : 'text-text-main'}`}>
                      {tx.type === 'DIVIDEND' ? '+' : ''}€{tx.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
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
    </main>
  );
};

export default PortfolioDashboard;
