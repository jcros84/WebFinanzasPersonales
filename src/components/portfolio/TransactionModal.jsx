import React, { useState } from 'react';
import { X, Plus, Minus, RefreshCcw } from 'lucide-react';

const TransactionModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'BUY',
    ticker: '',
    shares: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    assetType: 'STOCK'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-xl font-bold text-text-main">Nueva Operación</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-text-muted hover:text-text-main">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Type Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'BUY' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${
                formData.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 shadow-lg' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Plus size={16} /> Compra
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'SELL' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${
                formData.type === 'SELL' ? 'bg-rose-500/20 text-rose-400 shadow-lg' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Minus size={16} /> Venta
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'DRIP' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${
                formData.type === 'DRIP' ? 'bg-indigo-500/20 text-indigo-400 shadow-lg' : 'text-text-muted hover:text-text-main'
              }`}
            >
              <RefreshCcw size={16} /> DRIP
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-text-muted mb-2">Ticker / Símbolo</label>
              <input
                type="text"
                required
                placeholder="Ej: AAPL, SCHD..."
                className="input-field uppercase"
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-muted mb-2">Cantidad</label>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                className="input-field"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-muted mb-2">Precio</label>
              <input
                type="number"
                step="any"
                required
                placeholder="€ 0.00"
                className="input-field"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-text-muted mb-2">Fecha</label>
              <input
                type="date"
                required
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-text-muted mb-2">Tipo de Activo</label>
              <select
                className="input-field"
                value={formData.assetType}
                onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
              >
                <option value="STOCK">Acción</option>
                <option value="ETF">ETF</option>
                <option value="OPTION">Opción</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-4 mt-4"
          >
            Guardar Operación
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
