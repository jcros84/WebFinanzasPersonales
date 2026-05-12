import React, { useEffect, useState } from "react";
import { getAssets, createAsset, updateAsset, deleteAsset } from "../../services/assets";
import { TrendingUp, Plus, X } from "lucide-react";

const Maestros = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editAsset, setEditAsset] = useState(null);

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
    try {
      await createAsset(asset);
      fetchAssets();
    } catch (e) {
      console.error(e);
    }
    setShowCreate(false);
  };

  const handleUpdate = async (id, updates) => {
    try {
      await updateAsset(id, updates);
      fetchAssets();
    } catch (e) {
      console.error(e);
    }
    setEditAsset(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este activo?")) return;
    try {
      await deleteAsset(id);
      fetchAssets();
    } catch (e) {
      console.error(e);
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
      estimate_annual_dividend: initial.estimate_annual_dividend || "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
      e.preventDefault();
      onSubmit(form);
    };

    return (
      <form onSubmit={submit} className="space-y-4">
        <input
          name="ticker"
          placeholder="Ticker"
          value={form.ticker}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="asset_type"
          placeholder="Tipo (STOCK, ETF…)"
          value={form.asset_type}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="country"
          placeholder="País"
          value={form.country}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="exchange"
          placeholder="Bolsa / Exchange"
          value={form.exchange}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="currency"
          placeholder="Divisa (USD, EUR…)"
          value={form.currency}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="sector"
          placeholder="Sector"
          value={form.sector}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="estimate_annual_dividend"
          placeholder="Div. Anual Estimada"
          value={form.estimate_annual_dividend}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Guardar
          </button>
        </div>
      </form>
    );
  };

  return (
    <main className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Maestros – Tabla de Assets
          </h1>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <Plus size={20} /> Añadir Asset
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-slate-200 rounded-lg">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2">Ticker</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">País</th>
                <th className="px-4 py-2">Bolsa</th>
                <th className="px-4 py-2">Divisa</th>
                <th className="px-4 py-2">Sector</th>
                <th className="px-4 py-2">Div. Anual Est.</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : (
                assets.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2">{a.ticker}</td>
                    <td className="px-4 py-2">{a.name}</td>
                    <td className="px-4 py-2">{a.asset_type}</td>
                    <td className="px-4 py-2">{a.country}</td>
                    <td className="px-4 py-2">{a.exchange}</td>
                    <td className="px-4 py-2">{a.currency}</td>
                    <td className="px-4 py-2">{a.sector}</td>
                    <td className="px-4 py-2">{a.estimate_annual_dividend}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => setEditAsset(a)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:underline"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg p-6 w-full max-w-md glass-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Nuevo Asset</h2>
                <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-slate-800">
                  <X size={20} />
                </button>
              </div>
              <AssetForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {editAsset && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg p-6 w-full max-w-md glass-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Editar Asset</h2>
                <button onClick={() => setEditAsset(null)} className="text-slate-500 hover:text-slate-800">
                  <X size={20} />
                </button>
              </div>
              <AssetForm
                initial={editAsset}
                onSubmit={(data) => handleUpdate(editAsset.id, data)}
                onCancel={() => setEditAsset(null)}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Maestros;
