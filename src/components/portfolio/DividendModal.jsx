import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

const DividendModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    ticker: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-orange-50/50">
          <h3 className="text-xl font-bold text-slate-900">Registrar Dividendo</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl mx-auto mb-4">
            <DollarSign size={32} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ticker / Símbolo</label>
            <input
              type="text"
              required
              placeholder="Ej: JNJ, PG, O..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all uppercase"
              value={formData.ticker}
              onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Importe Neto (Cobrado)</label>
            <input
              type="number"
              step="any"
              required
              placeholder="€ 0.00"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de Cobro</label>
            <input
              type="date"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-all"
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
