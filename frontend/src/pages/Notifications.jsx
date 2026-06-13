import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from '../components/Table';
import { dateTime } from '../utils/format';

export default function Notifications() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get('/notifications');
    setItems(data.items || []);
  };

  useEffect(() => { load().catch(console.error); }, []);

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="topbar"><div><h1>Notifications</h1><p className="muted">System alerts and updates</p></div></div>
      <div className="card">
        <Table columns={['Message', 'Type', 'Read', 'Date', 'Actions']} data={items} renderRow={(item) => (
          <tr key={item._id}>
            <td>{item.message}</td>
            <td><span className="pill">{item.type}</span></td>
            <td>{item.read ? 'Yes' : 'No'}</td>
            <td>{dateTime(item.createdAt)}</td>
            <td className="split">
              {!item.read && <button className="secondary" onClick={async () => { await api.patch('/notifications/' + item._id + '/read'); await load(); }}>Mark read</button>}
              <button className="danger" onClick={async () => { if (confirm('Delete notification?')) { await api.delete('/notifications/' + item._id); await load(); }}}>Delete</button>
            </td>
          </tr>
        )}/>
      </div>
    </div>
  );
}
