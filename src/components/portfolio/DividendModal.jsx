import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

const DividendModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    ticker: '',
    grossAmount: '',
    withholdingOrigin: '0',
    withholdingDest: '0',
    commission: '0',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const gross = parseFloat(formData.grossAmount) || 0;
  const whOrigin = parseFloat(formData.withholdingOrigin) || 0;
  const whDest = parseFloat(formData.withholdingDest) || 0;
  const comm = parseFloat(formData.commission) || 0;
  const netAmount = gross - whOrigin - whDest - comm;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ticker: formData.ticker,
      grossAmount: formData.grossAmount,
      withholdingOrigin: formData.withholdingOrigin,
      withholdingDest: formData.withholdingDest,
      commission: formData.commission,
      netAmount: netAmount,
      date: formData.date
    });
    setFormData({
      ticker: '',
      grossAmount: '',
      withholdingOrigin: '0',
      withholdingDest: '0',
      commission: '0',
      date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-xl font-bold text-text-main">Registrar Dividendo</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-text-muted hover:text-text-main">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-2xl mx-auto mb-4">
            <DollarSign size={32} />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-muted mb-2">Ticker / Símbolo</label>
            <input
              type="text"
              required
              placeholder="Ej: JNJ, PG, O..."
              className="input-field uppercase"
              value={formData.ticker}
              onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-muted mb-2">Importe Bruto (€)</label>
            <input
              type="number"
              step="any"
              required
              placeholder="€ 0.00"
              className="input-field"
              value={formData.grossAmount}
              onChange={(e) => setFormData({ ...formData, grossAmount: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2">Ret. Origen (€)</label>
              <input
                type="number"
                step="any"
                placeholder="0"
                className="input-field text-sm"
                value={formData.withholdingOrigin}
                onChange={(e) => setFormData({ ...formData, withholdingOrigin: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2">Ret. Destino (€)</label>
              <input
                type="number"
                step="any"
                placeholder="0"
                className="input-field text-sm"
                value={formData.withholdingDest}
                onChange={(e) => setFormData({ ...formData, withholdingDest: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2">Comisión (€)</label>
              <input
                type="number"
                step="any"
                placeholder="0"
                className="input-field text-sm"
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
              />
            </div>
          </div>

          {/* Net amount preview */}
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 flex justify-between items-center">
            <span className="text-sm font-bold text-text-muted">Importe Neto</span>
            <span className={`text-lg font-bold ${netAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              €{netAmount.toFixed(2)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-bold text-text-muted mb-2">Fecha de Cobro</label>
            <input
              type="date"
              required
              className="input-field"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-all mt-4"
          >
            Confirmar Cobro
          </button>
        </form>
      </div>
    </div>
  );
};

export default DividendModal;
