import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from '../components/Table';

export default function Users() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get('/users');
    setItems(data.items || []);
  };

  useEffect(() => { load().catch(console.error); }, []);

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="topbar"><div><h1>Users</h1><p className="muted">Admin-only user management</p></div></div>
      <div className="card">
        <Table columns={['Name', 'Email', 'Role', 'Status', 'Actions']} data={items} renderRow={(item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>
              <select defaultValue={item.role} onChange={async (e) => { await api.patch('/users/' + item._id + '/role', { role: e.target.value }); await load(); }}>
                <option value="admin">admin</option>
                <option value="manager">manager</option>
                <option value="staff">staff</option>
              </select>
            </td>
            <td>
              <select defaultValue={item.status} onChange={async (e) => { await api.patch('/users/' + item._id + '/status', { status: e.target.value }); await load(); }}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </td>
            <td>-</td>
          </tr>
        )}/>
      </div>
    </div>
  );
}
