import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ChevronDown,
  Briefcase,
  PieChart as PieChartIcon,
  Percent,
  Wallet,
  Calendar,
  Globe
} from 'lucide-react';
import { getDividends, getPortfolios, getTransactions } from '../../services/portfolio';
import { getAssets } from '../../services/assets';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const KpisDashboard = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [selectedYear, setSelectedYear] = useState('All');
  
  const [dividends, setDividends] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
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
      const [{ data: divs }, { data: txs }, assetsData] = await Promise.all([
        getDividends(portfolioId),
        getTransactions(portfolioId),
        getAssets()
      ]);
      setDividends(divs);
      setTransactions(txs);
      setAssets(assetsData);
    } catch (error) {
      console.error('Error fetching KPIs data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- CALCULATIONS ---
  const availableYears = [...new Set(dividends.map(d => {
    return new Date(d.date).getFullYear().toString();
  }))].sort((a, b) => b - a);

  const filteredDividends = selectedYear === 'All' 
    ? dividends 
    : dividends.filter(d => new Date(d.date).getFullYear().toString() === selectedYear);

  const totalGross = filteredDividends.reduce((acc, d) => acc + (Number(d.gross_amount_eur) || 0), 0);
  const totalNet = filteredDividends.reduce((acc, d) => acc + (Number(d.net_amount_eur) || 0), 0);
  const totalDest = filteredDividends.reduce((acc, d) => acc + (Number(d.withholding_dest_eur) || 0), 0);
  const totalOrigin = filteredDividends.reduce((acc, d) => acc + (Number(d.withholding_origin_eur) || 0), 0);

  const kpis = [
    { label: 'Total Bruto', value: `€${totalGross.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'dollar', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { label: 'Total Neto', value: `€${totalNet.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'wallet', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { label: 'Retención Destino', value: `€${totalDest.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'flag-es', color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
    { label: 'Retención Origen', value: `€${totalOrigin.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'globe', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  ];

  // --- MONTHLY COMPARISON DATA ---
  const buildMonthlyComparisonData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const data = months.map((m, index) => ({ month: m, index }));

    dividends.forEach(d => {
      const date = new Date(d.date);
      const year = date.getFullYear().toString();
      const monthIndex = date.getMonth();
      const amount = Number(d.gross_amount_eur) || 0;

      if (!data[monthIndex][year]) {
        data[monthIndex][year] = 0;
      }
      data[monthIndex][year] = Math.round((data[monthIndex][year] + amount) * 100) / 100;
    });

    return data;
  };

  const barChartData = buildMonthlyComparisonData();
  const yearsForBars = [...availableYears].sort((a, b) => Number(a) - Number(b));
  const BAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

  // --- ANNUAL COMPARISON DATA ---
  const buildAnnualComparisonData = () => {
    const annualMap = {};
    dividends.forEach(d => {
      const year = new Date(d.date).getFullYear().toString();
      const amount = Number(d.gross_amount_eur) || 0;
      annualMap[year] = (annualMap[year] || 0) + amount;
    });

    const sortedYears = Object.keys(annualMap).sort((a, b) => Number(a) - Number(b));

    return sortedYears.map((year, index) => {
      const total = Math.round(annualMap[year] * 100) / 100;
      let yoyGrowth = null;

      if (index > 0) {
        const prevYear = sortedYears[index - 1];
        const prevTotal = annualMap[prevYear];
        if (prevTotal > 0) {
          yoyGrowth = ((total - prevTotal) / prevTotal) * 100;
        }
      }

      return {
        year,
        total,
        yoyGrowth
      };
    });
  };

  const annualData = buildAnnualComparisonData();
  const maxAnnualTotal = annualData.length > 0 ? Math.max(...annualData.map(d => d.total)) : 1;

  // --- PURCHASES EVOLUTION DATA ---
  const buildPurchasesEvolutionData = () => {
    const purchaseTxs = transactions
      .filter(tx => tx.type === 'BUY' || tx.type === 'DRIP' || tx.type === 'SCRIP')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (purchaseTxs.length === 0) return [];

    let cumulative = 0;
    const monthlyData = {};

    purchaseTxs.forEach(tx => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      cumulative += Number(tx.total_eur) || 0;
      monthlyData[key] = Math.round(cumulative * 100) / 100;
    });

    return Object.entries(monthlyData).map(([key, value]) => {
      const [year, month] = key.split('-');
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const formattedLabel = `${monthNames[parseInt(month) - 1]} ${year.substring(2)}`;
      return {
        mesRaw: key,
        mes: formattedLabel,
        compras: value
      };
    });
  };

  const purchasesEvolutionData = buildPurchasesEvolutionData();

  // --- NEW FINANCIAL METRICS & DIVERSIFICATION ---
  const netInvested = transactions.reduce((acc, tx) => {
    const amount = Number(tx.total_eur) || 0;
    if (tx.type === 'BUY' || tx.type === 'DRIP' || tx.type === 'SCRIP') {
      return acc + amount;
    } else if (tx.type === 'SELL') {
      return acc - amount;
    }
    return acc;
  }, 0);

  const currentYoC = netInvested > 0 ? (totalNet / netInvested) * 100 : 0;

  const totalCommissions = transactions.reduce((acc, tx) => acc + (Number(tx.commission_eur) || 0), 0);

  const buildProjectedAnnualDividend = () => {
    const activePositions = {};
    transactions.forEach(tx => {
      if (!activePositions[tx.ticker]) {
        activePositions[tx.ticker] = 0;
      }
      if (tx.type === 'BUY' || tx.type === 'DRIP' || tx.type === 'SCRIP') {
        activePositions[tx.ticker] += Number(tx.shares) || 0;
      } else if (tx.type === 'SELL') {
        activePositions[tx.ticker] -= Number(tx.shares) || 0;
      }
    });

    let projected = 0;
    Object.entries(activePositions).forEach(([ticker, shares]) => {
      if (shares > 0) {
        const asset = assets.find(a => a.ticker === ticker);
        const estDividend = Number(asset?.estimated_annual_dividend) || 0;
        projected += shares * estDividend;
      }
    });
    return projected;
  };

  const projectedAnnualDividend = buildProjectedAnnualDividend();

  const buildDiversificationData = () => {
    const sectorMap = {};
    const countryMap = {};
    let totalValue = 0;

    const tickerInvested = {};
    transactions.forEach(tx => {
      if (!tickerInvested[tx.ticker]) {
        tickerInvested[tx.ticker] = 0;
      }
      const amount = Number(tx.total_eur) || 0;
      if (tx.type === 'BUY' || tx.type === 'DRIP' || tx.type === 'SCRIP') {
        tickerInvested[tx.ticker] += amount;
      } else if (tx.type === 'SELL') {
        tickerInvested[tx.ticker] -= amount;
      }
    });

    Object.entries(tickerInvested).forEach(([ticker, value]) => {
      if (value > 0) {
        totalValue += value;
        const asset = assets.find(a => a.ticker === ticker);
        const sector = asset?.sector || 'Otros';
        const country = asset?.country || 'Otros';

        sectorMap[sector] = (sectorMap[sector] || 0) + value;
        countryMap[country] = (countryMap[country] || 0) + value;
      }
    });

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316', '#14b8a6', '#e11d48', '#a3e635'];

    const sectors = Object.entries(sectorMap).map(([name, val], i) => ({
      name,
      value: Math.round(val * 100) / 100,
      pct: totalValue > 0 ? Math.round((val / totalValue) * 1000) / 10 : 0,
      color: COLORS[i % COLORS.length]
    })).sort((a, b) => b.value - a.value);

    const countries = Object.entries(countryMap).map(([name, val], i) => ({
      name,
      value: Math.round(val * 100) / 100,
      pct: totalValue > 0 ? Math.round((val / totalValue) * 1000) / 10 : 0,
      color: COLORS[(i + 2) % COLORS.length]
    })).sort((a, b) => b.value - a.value);

    return { sectors, countries };
  };

  const { sectors: sectorData, countries: countryData } = buildDiversificationData();

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
            <PieChartIcon size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-text-main mb-4">Aún no hay KPIs</h2>
          <p className="text-text-muted mb-10">Crea tu primera cartera en el Panel DGI para empezar a ver tus indicadores clave.</p>
          <Link to="/cartera" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3">
            Ir al Panel DGI
          </Link>
        </div>
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
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 uppercase tracking-widest">KPIs de Dividendos</span>
              <div className="h-1 w-1 rounded-full bg-slate-700"></div>
              <span className="text-text-muted text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-text-main">
                {selectedPortfolio?.name}
              </h1>
              {/* Selectors Group */}
              <div className="flex items-center gap-2">
                {/* Portfolio Selector */}
                <div className="relative group">
                  <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-text-muted flex items-center gap-1" title="Cambiar Cartera">
                    <Briefcase size={20} />
                    <ChevronDown size={16} />
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
                  </div>
                </div>

                <div className="h-6 w-px bg-slate-800 mx-1"></div>

                {/* Year Selector */}
                <div className="relative group">
                  <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-text-muted flex items-center gap-2 font-medium">
                    <Calendar size={18} className="text-primary/70" />
                    <span>{selectedYear === 'All' ? 'Todos los años' : selectedYear}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-surface border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] overflow-hidden">
                    <div className="p-3 border-b border-slate-800 bg-slate-900/50">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filtrar por Año</span>
                    </div>
                    <button 
                      onClick={() => setSelectedYear('All')}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-800 transition-colors ${selectedYear === 'All' ? 'text-primary font-bold' : 'text-text-muted'}`}
                    >
                      <Calendar size={16} /> Todos los datos
                    </button>
                    {availableYears.map(year => (
                      <button 
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-800 transition-colors ${selectedYear === year ? 'text-primary font-bold' : 'text-text-muted'}`}
                      >
                        <Calendar size={16} /> {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-surface p-6 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl hover:bg-surface-hover transition-all duration-300 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-text-muted">{kpi.label}</p>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.bgColor}`}>
                  {kpi.icon === 'dollar' && <DollarSign size={20} className={kpi.color} />}
                  {kpi.icon === 'wallet' && <Wallet size={20} className={kpi.color} />}
                  {kpi.icon === 'flag-es' && <span className="text-lg leading-none" role="img" aria-label="Spain Flag">🇪🇸</span>}
                  {kpi.icon === 'globe' && <Globe size={20} className={kpi.color} />}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-main">{kpi.value}</h3>
            </div>
          ))}
        </div>

        {/* New Portfolio KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Capital Neto Invertido', value: `€${netInvested.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'wallet', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
            { label: 'Yield on Cost (YoC)', value: `${currentYoC.toFixed(2)}%`, icon: 'percent', color: 'text-teal-400', bgColor: 'bg-teal-500/10' },
            { label: 'Comisiones Totales', value: `€${totalCommissions.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'dollar', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
            { label: 'Dividendo Anual Proyectado', value: `€${projectedAnnualDividend.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'trending-up', color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
          ].map((kpi, i) => (
            <div key={i} className="bg-surface p-6 rounded-2xl border border-slate-800 shadow-sm hover:shadow-xl hover:bg-surface-hover transition-all duration-300 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-text-muted">{kpi.label}</p>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.bgColor}`}>
                  {kpi.icon === 'wallet' && <Wallet size={20} className={kpi.color} />}
                  {kpi.icon === 'percent' && <Percent size={20} className={kpi.color} />}
                  {kpi.icon === 'dollar' && <DollarSign size={20} className={kpi.color} />}
                  {kpi.icon === 'trending-up' && <TrendingUp size={20} className={kpi.color} />}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-main">{kpi.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts & Graphs Section */}
        {dividends.length === 0 ? (
          <div className="bg-surface rounded-3xl border border-slate-800 p-12 text-center mt-10">
            <TrendingUp size={48} className="mx-auto text-slate-600 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text-main mb-2">No hay datos de dividendos</h3>
            <p className="text-text-muted">Añade dividendos a tu cartera desde el Panel DGI para ver las métricas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            {/* Bar Chart comparing monthly dividends */}
            <div className="bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h4 className="text-xl font-bold text-text-main flex items-center gap-2">
                    <TrendingUp className="text-primary" size={20} />
                    Comparativa Mensual de Dividendos Brutos
                  </h4>
                  <p className="text-xs text-text-muted mt-1">Comparación histórica mes a mes (no afectado por el filtro de año)</p>
                </div>
              </div>

              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} barSize={12} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} tickFormatter={(v) => `€${v}`} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '13px' }}
                      labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                      formatter={(val) => [`€${Number(val).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`]}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '10px' }} />
                    {yearsForBars.map((year, idx) => (
                      <Bar 
                        key={year} 
                        dataKey={year} 
                        name={year}
                        fill={BAR_COLORS[idx % BAR_COLORS.length]} 
                        radius={[4, 4, 0, 0]} 
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Annual Evolution & growth YoY */}
            <div className="bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-text-main flex items-center gap-2 mb-2">
                  <TrendingUp className="text-emerald-500" size={20} />
                  Evolución y Crecimiento Anual
                </h4>
                <p className="text-xs text-text-muted mb-6">Total acumulado anual y tasa de variación interanual (no afectado por el filtro de año)</p>
              </div>

              <div className="space-y-6 my-auto">
                {annualData.map((item, idx) => {
                  const percentageOfMax = (item.total / maxAnnualTotal) * 100;
                  const growthFormatted = item.yoyGrowth !== null 
                    ? `${item.yoyGrowth >= 0 ? '+' : ''}${item.yoyGrowth.toFixed(1)}%` 
                    : 'Año base';

                  return (
                    <div key={item.year} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-text-main">{item.year}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            item.yoyGrowth === null ? 'bg-slate-850 text-text-muted border border-slate-800' :
                            item.yoyGrowth >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {growthFormatted}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-text-main">
                          €{item.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {/* Visual progress bar */}
                      <div className="w-full bg-slate-900/50 h-3 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-gradient-to-r from-primary to-emerald-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(percentageOfMax, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Evolución de Compras */}
        <div className="bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm mt-8">
          <div>
            <h4 className="text-xl font-bold text-text-main flex items-center gap-2 mb-2">
              <TrendingUp className="text-primary" size={20} />
              Evolución Acumulada de Compras (Capital Invertido)
            </h4>
            <p className="text-xs text-text-muted mb-6">
              Histórico acumulado de las compras de activos en la cartera (no afectado por el filtro de año)
            </p>
          </div>

          {purchasesEvolutionData.length > 0 ? (
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={purchasesEvolutionData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradCompras" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} tickFormatter={(v) => `€${v}`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '13px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                    formatter={(val) => [`€${Number(val).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, 'Total Invertido']}
                  />
                  <Area type="monotone" dataKey="compras" stroke="#6366f1" strokeWidth={2} fill="url(#gradCompras)" name="Compras Acumuladas" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-text-muted italic">No hay registros de compras para mostrar la evolución.</p>
            </div>
          )}
        </div>

        {/* Diversification Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Sector Diversification */}
          <div className="bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm">
            <h4 className="text-xl font-bold text-text-main flex items-center gap-2 mb-6">
              <PieChartIcon className="text-indigo-400" size={20} />
              Diversificación por Sector
            </h4>
            {sectorData.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-[200px] w-[200px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '13px' }}
                        formatter={(val) => [`€${Number(val).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, 'Invertido']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 w-full max-h-[200px] overflow-y-auto pr-2">
                  {sectorData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-text-muted font-medium text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted text-xs">€{item.value.toLocaleString('es-ES')}</span>
                        <span className="font-bold text-text-main text-sm w-12 text-right">{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-text-muted italic text-sm">No hay datos de distribución por sector.</p>
              </div>
            )}
          </div>

          {/* Country Diversification */}
          <div className="bg-surface p-8 rounded-3xl border border-slate-800 shadow-sm">
            <h4 className="text-xl font-bold text-text-main flex items-center gap-2 mb-6">
              <Globe className="text-teal-400" size={20} />
              Diversificación por País
            </h4>
            {countryData.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-[200px] w-[200px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={countryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {countryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '13px' }}
                        formatter={(val) => [`€${Number(val).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, 'Invertido']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 w-full max-h-[200px] overflow-y-auto pr-2">
                  {countryData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-text-muted font-medium text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted text-xs">€{item.value.toLocaleString('es-ES')}</span>
                        <span className="font-bold text-text-main text-sm w-12 text-right">{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <p className="text-text-muted italic text-sm">No hay datos de distribución por país.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

export default KpisDashboard;
