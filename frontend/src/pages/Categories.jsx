import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from '../components/Table';

const initial = { name: '', description: '' };

export default function Categories() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/categories?q=' + encodeURIComponent(query));
    setItems(data.items || []);
  };

  useEffect(() => { load().catch(console.error); }, [query]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await api.put('/categories/' + editingId, form);
      else await api.post('/categories', form);
      setForm(initial); setEditingId(null); await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="topbar"><div><h1>Categories</h1><p className="muted">Manage product categories</p></div></div>
      <div className="card"><input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
      <div className="card">
        <h3>{editingId ? 'Edit Category' : 'Add Category'}</h3>
        {error && <div className="error">{error}</div>}
        <form className="form" onSubmit={submit}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="split">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(initial); }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <Table columns={['Name', 'Description', 'Actions']} data={items} renderRow={(item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td>{item.description || '-'}</td>
            <td className="split">
              <button className="secondary" onClick={() => { setEditingId(item._id); setForm({ name: item.name, description: item.description || '' }); }}>Edit</button>
              <button className="danger" onClick={async () => { if (confirm('Delete category?')) { await api.delete('/categories/' + item._id); await load(); }}}>Delete</button>
            </td>
          </tr>
        )}/>
      </div>
    </div>
  );
}
