import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from '../components/Table';

const initial = { name: '', email: '', phone: '', address: '' };

export default function Suppliers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/suppliers?q=' + encodeURIComponent(query));
    setItems(data.items || []);
  };

  useEffect(() => { load().catch(console.error); }, [query]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await api.put('/suppliers/' + editingId, form);
      else await api.post('/suppliers', form);
      setForm(initial); setEditingId(null); await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="topbar"><div><h1>Suppliers</h1><p className="muted">Manage suppliers</p></div></div>
      <div className="card"><input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      <div className="card">
        <h3>{editingId ? 'Edit Supplier' : 'Add Supplier'}</h3>
        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={submit}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="row">
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="split">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(initial); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <Table columns={['Name', 'Email', 'Phone', 'Address', 'Actions']} data={items} renderRow={(item) => (
          <tr key={item._id}>
            <td>{item.name}</td><td>{item.email || '-'}</td><td>{item.phone || '-'}</td><td>{item.address || '-'}</td>
            <td className="split">
              <button className="secondary" onClick={() => { setEditingId(item._id); setForm({ name: item.name, email: item.email || '', phone: item.phone || '', address: item.address || '' }); }}>Edit</button>
              <button className="danger" onClick={async () => { if (confirm('Delete supplier?')) { await api.delete('/suppliers/' + item._id); await load(); }}}>Delete</button>
            </td>
          </tr>
        )}/>
      </div>
    </div>
  );
}
