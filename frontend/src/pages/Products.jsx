import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from '../components/Table';
import { money } from '../utils/format';

const initial = { name: '', sku: '', description: '', price: '', quantity: '', minQuantity: '', category: '', supplier: '', warehouse: '' };

export default function Products() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const [p, c, s, w] = await Promise.all([
      api.get('/products?q=' + encodeURIComponent(query)),
      api.get('/categories'),
      api.get('/suppliers'),
      api.get('/warehouses')
    ]);
    setItems(p.data.items || []);
    setCategories(c.data.items || []);
    setSuppliers(s.data.items || []);
    setWarehouses(w.data.items || []);
  };

  useEffect(() => { load().catch(console.error); }, [query]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        minQuantity: Number(form.minQuantity || 0)
      };
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
      const file = e.target.image.files[0];
      if (file) fd.append('image', file);

      if (editingId) await api.put('/products/' + editingId, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      setForm(initial); setEditingId(null); e.target.reset(); await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Request failed');
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      sku: item.sku || '',
      description: item.description || '',
      price: item.price ?? '',
      quantity: item.quantity ?? '',
      minQuantity: item.minQuantity ?? '',
      category: item.category?._id || item.category || '',
      supplier: item.supplier?._id || item.supplier || '',
      warehouse: item.warehouse?._id || item.warehouse || ''
    });
  };

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="topbar"><div><h1>Products</h1><p className="muted">Manage inventory items</p></div></div>
      <div className="card"><input placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      <div className="card">
        <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={submit}>
          <div className="row">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>
          <textarea placeholder="Description" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="row">
            <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div className="row">
            <input type="number" placeholder="Min Quantity" value={form.minQuantity} onChange={(e) => setForm({ ...form, minQuantity: e.target.value })} />
            <input type="file" name="image" accept="image/*" />
          </div>
          <div className="row">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
              <option value="">Select Supplier</option>
              {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <select value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })}>
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
          </select>
          <div className="split">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(initial); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <Table columns={['Name', 'SKU', 'Qty', 'Price', 'Warehouse', 'Actions']} data={items} renderRow={(item) => (
          <tr key={item._id}>
            <td>
              <div><strong>{item.name}</strong></div>
              <div className="muted small">{item.description}</div>
            </td>
            <td>{item.sku}</td>
            <td><span className="pill">{item.quantity}</span></td>
            <td>{money(item.price)}</td>
            <td>{item.warehouse?.name || '-'}</td>
            <td className="split">
              <button className="secondary" onClick={() => edit(item)}>Edit</button>
              <button className="danger" onClick={async () => { if (confirm('Delete product?')) { await api.delete('/products/' + item._id); await load(); }}}>Delete</button>
            </td>
          </tr>
        )}/>
      </div>
    </div>
  );
}
