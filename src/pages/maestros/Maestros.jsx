import React, { useEffect, useState } from "react";
import { getAssets, createAsset, updateAsset, deleteAsset } from "../../services/assets";
import { TrendingUp, Plus, X } from "lucide-react";

const Maestros = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [error, setError] = useState(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await getAssets();
      setAssets(data);
    } catch (e) {
      console.error("Error fetching assets", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCreate = async (asset) => {
    setError(null);
    try {
      await createAsset(asset);
      setShowCreate(false);
      fetchAssets();
    } catch (e) {
      console.error(e);
      setError(e.message || "Error al crear el activo. Revisa los datos.");
    }
  };

  const handleUpdate = async (ticker, updates) => {
    setError(null);
    try {
      await updateAsset(ticker, updates);
      setEditAsset(null);
      fetchAssets();
    } catch (e) {
      console.error(e);
      setError(e.message || "Error al actualizar el activo.");
    }
  };

  const handleDelete = async (ticker) => {
    if (!window.confirm("¿Eliminar este activo?")) return;
    setError(null);
    try {
      await deleteAsset(ticker);
      fetchAssets();
    } catch (e) {
      console.error(e);
      setError(e.message || "Error al eliminar el activo.");
    }
  };

  const AssetForm = ({ initial = {}, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
      ticker: initial.ticker || "",
      name: initial.name || "",
      asset_type: initial.asset_type || "",
      country: initial.country || "",
      exchange: initial.exchange || "",
      currency: initial.currency || "",
      sector: initial.sector || "",
      estimated_annual_dividend: initial.estimated_annual_dividend || "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
      e.preventDefault();
      
      // Sanitización de datos
      const sanitizedForm = {
        ...form,
        estimated_annual_dividend: form.estimated_annual_dividend === "" ? 0 : parseFloat(form.estimated_annual_dividend)
      };
      
      onSubmit(sanitizedForm);
    };

    return (
      <form onSubmit={submit} className="space-y-4">
        <input
          name="ticker"
          placeholder="Ticker"
          value={form.ticker}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          name="asset_type"
          placeholder="Tipo (STOCK, ETF…)"
          value={form.asset_type}
          onChange={handleChange}
          required
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            name="country"
            placeholder="País"
            value={form.country}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="exchange"
            placeholder="Bolsa / Exchange"
            value={form.exchange}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="currency"
            placeholder="Divisa (USD, EUR…)"
            value={form.currency}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="sector"
            placeholder="Sector"
            value={form.sector}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <input
          name="estimated_annual_dividend"
          placeholder="Div. Anual Estimada"
          value={form.estimated_annual_dividend}
          onChange={handleChange}
          className="input-field"
        />
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onCancel} className="btn-outline py-2">
            Cancelar
          </button>
          <button type="submit" className="btn-primary py-2 px-8">
            Guardar
          </button>
        </div>
      </form>
    );
  };

  return (
    <main className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-main">
            Maestros – Tabla de Assets
          </h1>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Añadir Asset
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/50 text-rose-400 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}

        {/* Tabla */}
        <div className="overflow-x-auto bg-surface rounded-2xl border border-slate-800 shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-text-muted text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Ticker</th>
                <th className="px-6 py-4 font-bold">Nombre</th>
                <th className="px-6 py-4 font-bold">Tipo</th>
                <th className="px-6 py-4 font-bold">País</th>
                <th className="px-6 py-4 font-bold">Bolsa</th>
                <th className="px-6 py-4 font-bold">Divisa</th>
                <th className="px-6 py-4 font-bold">Sector</th>
                <th className="px-6 py-4 font-bold">Div. Anual Est.</th>
                <th className="px-6 py-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : (
                 assets.map((a) => (
                  <tr key={a.ticker} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-main">{a.ticker}</td>
                    <td className="px-6 py-4 text-text-muted">{a.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded-md text-xs font-bold uppercase">
                        {a.asset_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{a.country}</td>
                    <td className="px-6 py-4 text-text-muted">{a.exchange}</td>
                    <td className="px-6 py-4 text-text-muted">{a.currency}</td>
                    <td className="px-6 py-4 text-text-muted">{a.sector}</td>
                    <td className="px-6 py-4 text-emerald-400 font-bold">{a.estimated_annual_dividend}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => setEditAsset(a)}
                        className="p-2 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                        title="Editar"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(a.ticker)}
                        className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Crear */}
        {showCreate && (
          <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-[70]">
            <div className="bg-surface rounded-3xl p-8 w-full max-w-md border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-main">Nuevo Asset</h2>
                <button onClick={() => setShowCreate(false)} className="text-text-muted hover:text-text-main p-2 hover:bg-slate-800 rounded-full">
                  <X size={20} />
                </button>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/50 text-rose-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <AssetForm onSubmit={handleCreate} onCancel={() => { setShowCreate(false); setError(null); }} />
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {editAsset && (
          <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-[70]">
            <div className="bg-surface rounded-3xl p-8 w-full max-w-md border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-main">Editar Asset</h2>
                <button onClick={() => setEditAsset(null)} className="text-text-muted hover:text-text-main p-2 hover:bg-slate-800 rounded-full">
                  <X size={20} />
                </button>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/50 text-rose-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <AssetForm
                initial={editAsset}
                onSubmit={(data) => handleUpdate(editAsset.ticker, data)}
                onCancel={() => { setEditAsset(null); setError(null); }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Maestros;
