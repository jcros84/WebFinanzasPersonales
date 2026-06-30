import React, { useState, useEffect, useMemo } from 'react';
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
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from 'recharts';
import TransactionModal from '../../components/portfolio/TransactionModal';
import DividendModal from '../../components/portfolio/DividendModal';
import { getTransactions, createTransaction, getDividends, createDividend, getPortfolios, createPortfolio } from '../../services/portfolio';
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
  const [dividends, setDividends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
      const [{ data: txs }, { data: divs }] = await Promise.all([
        getTransactions(portfolioId),
        getDividends(portfolioId)
      ]);
      
      const formattedTxs = txs.map(tx => ({
        ...tx,
        _source: 'transaction',
        _sortDate: tx.date,
        date: new Date(tx.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
      }));

      const formattedDivs = divs.map(d => ({
        ...d,
        _source: 'dividend',
        _sortDate: d.date,
        date: new Date(d.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
      }));
      
      setTransactions(formattedTxs);
      setDividends(formattedDivs);
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
  // Build positions: net shares & cost per ticker
  const positions = {};
  transactions.forEach(tx => {
    if (!positions[tx.ticker]) positions[tx.ticker] = { shares: 0, costEur: 0 };
    if (tx.type === 'BUY' || tx.type === 'DRIP' || tx.type === 'SCRIP') {
      positions[tx.ticker].shares += Number(tx.shares) || 0;
      positions[tx.ticker].costEur += Number(tx.total_eur) || 0;
    } else if (tx.type === 'SELL') {
      positions[tx.ticker].shares -= Number(tx.shares) || 0;
      positions[tx.ticker].costEur -= Number(tx.total_eur) || 0;
    }
  });

  const costBasis = Object.values(positions).reduce((s, p) => s + Math.max(p.costEur, 0), 0);
  // Without live prices we use cost basis as invested value
  const investedValue = costBasis;

  const totalDividends = dividends.reduce((acc, d) => acc + (Number(d.net_amount_eur) || 0), 0);
  const totalReturn = totalDividends; // capital gains would need live prices
  const yieldOnCost = costBasis > 0 ? (totalDividends / costBasis) * 100 : 0;

  const stats = [
    { label: 'Capital Invertido', value: `€${investedValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: `${Object.keys(positions).filter(t => positions[t].shares > 0).length} posiciones`, isPositive: null, icon: 'wallet' },
    { label: 'Dividendos Cobrados', value: `€${totalDividends.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: `${dividends.length} cobros`, isPositive: true, icon: 'dollar' },
    { label: 'Retorno Total', value: `€${totalReturn.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: costBasis > 0 ? `${(totalReturn / costBasis * 100).toFixed(2)}%` : '0%', isPositive: totalReturn >= 0, icon: 'trend' },
    { label: 'Yield on Cost', value: `${yieldOnCost.toFixed(2)}%`, change: 'Rentabilidad por dividendo', isPositive: yieldOnCost > 0 ? true : null, icon: 'percent' },
  ];

  // Distribution by ticker (pie chart)
  const COLORS = ['#10b981','#f59e0b','#6366f1','#ec4899','#06b6d4','#8b5cf6','#f97316','#14b8a6','#e11d48','#a3e635'];
  const distData = Object.entries(positions)
    .filter(([, p]) => p.costEur > 0 && p.shares > 0)
    .map(([ticker, p], i) => ({
      name: ticker,
      value: Math.round(p.costEur * 100) / 100,
      pct: costBasis > 0 ? Math.round((p.costEur / costBasis) * 1000) / 10 : 0,
      color: COLORS[i % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);

  // Portfolio evolution chart: cumulative invested + cumulative dividends over time
  const buildEvolutionData = () => {
    const events = [
      ...transactions.map(tx => ({
        date: tx._sortDate,
        invested: (tx.type === 'BUY' || tx.type === 'DRIP' || tx.type === 'SCRIP') ? Number(tx.total_eur) || 0 : -(Number(tx.total_eur) || 0),
        div: 0
      })),
      ...dividends.map(d => ({
        date: d._sortDate,
        invested: 0,
        div: Number(d.net_amount_eur) || 0
      }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (events.length === 0) return [];

    let cumInvested = 0, cumDiv = 0;
    const monthly = {};
    events.forEach(e => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      cumInvested += e.invested;
      cumDiv += e.div;
      monthly[key] = { invertido: Math.round(cumInvested * 100) / 100, dividendos: Math.round(cumDiv * 100) / 100 };
    });

    return Object.entries(monthly).map(([key, v]) => ({
      mes: key,
      ...v,
      total: Math.round((v.invertido + v.dividendos) * 100) / 100
    }));
  };
  const evolutionData = buildEvolutionData();

  const handleAddTransaction = async (data) => {
    try {
      const shares = parseFloat(data.shares);
      const priceLocal = parseFloat(data.price);
      const commission = parseFloat(data.commission) || 0;
      const exchangeRate = parseFloat(data.exchangeRate) || 1;
      const totalLocal = shares * priceLocal;
      const totalEur = (totalLocal / exchangeRate) + commission;

      const payload = {
        portfolio_id: selectedPortfolio.id,
        ticker: data.ticker.toUpperCase(),
        type: data.type,
        shares: shares,
        price_local: priceLocal,
        commission_eur: commission,
        exchange_rate: exchangeRate,
        total_local: totalLocal,
        total_eur: totalEur,
        remaining_shares: data.type === 'BUY' ? shares : 0,
        date: data.date
      };
      
      await createTransaction(payload);
      fetchData(selectedPortfolio.id);
    } catch (error) {
      console.error('Error guardando operación:', error);
      alert('Error guardando operación');
    }
  };

  const handleAddDividend = async (data) => {
    try {
      const payload = {
        portfolio_id: selectedPortfolio.id,
        ticker: data.ticker.toUpperCase(),
        gross_amount_eur: parseFloat(data.grossAmount),
        withholding_origin_eur: parseFloat(data.withholdingOrigin) || 0,
        withholding_dest_eur: parseFloat(data.withholdingDest) || 0,
        commission_eur: parseFloat(data.commission) || 0,
        net_amount_eur: parseFloat(data.netAmount),
        date: data.date
      };
      
      await createDividend(payload);
      fetchData(selectedPortfolio.id);
    } catch (error) {
      console.error('Error guardando dividendo:', error);
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
          {/* Distribution Pie */}
          <div className="lg:col-span-1 bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <PieChartIcon className="text-orange-500" /> Distribución por Ticker
            </h4>
            {distData.length > 0 ? (
              <>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {distData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '13px' }}
                        formatter={(val) => [`€${Number(val).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, 'Invertido']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4 max-h-[180px] overflow-y-auto pr-2">
                  {distData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-text-muted font-medium text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted text-xs">€{item.value.toLocaleString('es-ES')}</span>
                        <span className="font-bold text-text-main text-sm w-14 text-right">{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-text-muted text-sm py-12">Registra operaciones para ver la distribución.</p>
            )}
          </div>

          {/* Portfolio Evolution */}
          <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-text-main">
              <TrendingUp className="text-emerald-500" /> Evolución de Cartera
            </h4>
            {evolutionData.length > 0 ? (
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evolutionData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gradInvertido" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradDividendos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} tickFormatter={(v) => `€${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '13px' }}
                      formatter={(val, name) => [`€${Number(val).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, name === 'invertido' ? 'Invertido' : name === 'dividendos' ? 'Dividendos' : 'Total']}
                      labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                    />
                    <Legend formatter={(val) => val === 'invertido' ? 'Invertido' : val === 'dividendos' ? 'Dividendos' : 'Total'} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                    <Area type="monotone" dataKey="invertido" stroke="#6366f1" strokeWidth={2} fill="url(#gradInvertido)" />
                    <Area type="monotone" dataKey="dividendos" stroke="#10b981" strokeWidth={2} fill="url(#gradDividendos)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-text-muted italic">Registra operaciones para ver la evolución.</p>
              </div>
            )}
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
                {(() => {
                  const allOps = [
                    ...transactions.map(tx => ({
                      key: `tx-${tx.id}`,
                      date: tx.date,
                      _sortDate: tx._sortDate,
                      ticker: tx.ticker,
                      type: tx.type,
                      shares: tx.shares,
                      total: tx.total_eur || 0,
                      isDiv: false
                    })),
                    ...dividends.map(d => ({
                      key: `div-${d.id}`,
                      date: d.date,
                      _sortDate: d._sortDate,
                      ticker: d.ticker,
                      type: 'DIVIDEND',
                      shares: null,
                      total: d.net_amount_eur || 0,
                      isDiv: true
                    }))
                  ].sort((a, b) => new Date(b._sortDate) - new Date(a._sortDate));

                  const totalPages = Math.ceil(allOps.length / pageSize);
                  const paginatedOps = allOps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

                  return (
                    <>
                      {paginatedOps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-12 text-center text-text-muted">
                            No hay operaciones registradas en esta cartera.
                          </td>
                        </tr>
                      ) : (
                        paginatedOps.map((op) => (
                          <tr key={op.key} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-8 py-4 text-text-muted">{op.date}</td>
                            <td className="px-8 py-4 font-bold text-text-main">{op.ticker}</td>
                            <td className="px-8 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                  op.type === 'BUY'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : op.type === 'SELL'
                                    ? 'bg-rose-500/10 text-rose-400'
                                    : 'bg-orange-500/10 text-orange-400'
                                }`}
                              >
                                {op.type === 'BUY'
                                  ? 'Compra'
                                  : op.type === 'SELL'
                                  ? 'Venta'
                                  : 'Dividendo'}
                              </span>
                            </td>
                            <td className="px-8 py-4 text-text-muted">{op.shares || '-'}</td>
                            <td className={`px-8 py-4 font-bold ${op.isDiv ? 'text-emerald-400' : 'text-text-main'}`}>
                              €{op.total.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                      {totalPages > 1 && (
                        <tr>
                          <td colSpan={5} className="px-8 py-4 border-t border-slate-800">
                            <div className="flex justify-between items-center">
                              <select 
                                value={pageSize} 
                                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                                className="bg-slate-900 border border-slate-700 text-text-muted text-sm rounded px-2 py-1"
                              >
                                <option value={5}>5 por pág.</option>
                                <option value={10}>10 por pág.</option>
                                <option value={20}>20 por pág.</option>
                              </select>
                              <div className="flex justify-center gap-2">
                                <button
                                  disabled={currentPage === 1}
                                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                  className="px-3 py-1 bg-slate-800 rounded text-text-muted text-sm disabled:opacity-50"
                                >
                                  Anterior
                                </button>
                                <span className="px-3 py-1 text-sm text-text-muted">Página {currentPage} de {totalPages}</span>
                                <button
                                  disabled={currentPage === totalPages}
                                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                  className="px-3 py-1 bg-slate-800 rounded text-text-muted text-sm disabled:opacity-50"
                                >
                                  Siguiente
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })()}
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

