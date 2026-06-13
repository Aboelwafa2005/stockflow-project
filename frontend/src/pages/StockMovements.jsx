import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from '../components/Table';
import { dateTime } from '../utils/format';

const initial = { product: '', type: 'in', quantity: '', note: '' };

export default function StockMovements() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');

  const load = async () => {
    const [m, p] = await Promise.all([api.get('/stock-movements'), api.get('/products')]);
    setItems(m.data.items || []);
    setProducts(p.data.items || []);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/stock-movements', { ...form, quantity: Number(form.quantity) });
      setForm(initial);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="topbar"><div><h1>Stock Movements</h1><p className="muted">Track inventory in/out</p></div></div>
      <div className="card">
        <h3>New Movement</h3>
        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={submit}>
          <div className="row">
            <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
              <option value="">Select Product</option>
              {products.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.quantity})</option>)}
            </select>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
          <div className="row">
            <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <input placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
          <button type="submit">Save Movement</button>
        </form>
      </div>
      <div className="card">
        <Table columns={['Product', 'Type', 'Qty', 'Balance After', 'Created By', 'Date']} data={items} renderRow={(item) => (
          <tr key={item._id}>
            <td>{item.product?.name || '-'}</td>
            <td><span className="pill">{item.type}</span></td>
            <td>{item.quantity}</td>
            <td>{item.balanceAfter}</td>
            <td>{item.createdBy?.name || '-'}</td>
            <td>{dateTime(item.createdAt)}</td>
          </tr>
        )}/>
      </div>
    </div>
  );
}
