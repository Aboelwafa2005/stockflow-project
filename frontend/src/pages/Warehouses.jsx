import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from '../components/Table';

const initial = { name: '', code: '', address: '' };

export default function Warehouses() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/warehouses?q=' + encodeURIComponent(query));
    setItems(data.items || []);
  };

  useEffect(() => { load().catch(console.error); }, [query]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await api.put('/warehouses/' + editingId, form);
      else await api.post('/warehouses', form);
      setForm(initial); setEditingId(null); await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="topbar"><div><h1>Warehouses</h1><p className="muted">Manage warehouse locations</p></div></div>
      <div className="card"><input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      <div className="card">
        <h3>{editingId ? 'Edit Warehouse' : 'Add Warehouse'}</h3>
        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={submit}>
          <div className="row">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="split">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(initial); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <Table columns={['Name', 'Code', 'Address', 'Actions']} data={items} renderRow={(item) => (
          <tr key={item._id}>
            <td>{item.name}</td><td>{item.code}</td><td>{item.address || '-'}</td>
            <td className="split">
              <button className="secondary" onClick={() => { setEditingId(item._id); setForm({ name: item.name, code: item.code, address: item.address || '' }); }}>Edit</button>
              <button className="danger" onClick={async () => { if (confirm('Delete warehouse?')) { await api.delete('/warehouses/' + item._id); await load(); }}}>Delete</button>
            </td>
          </tr>
        )}/>
      </div>
    </div>
  );
}
