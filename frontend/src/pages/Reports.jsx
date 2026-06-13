import { useEffect, useState } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import Table from '../components/Table';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [low, setLow] = useState([]);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [s, l, m] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/reports/low-stock'),
        api.get('/reports/movements')
      ]);
      setSummary(s.data.summary);
      setLow(l.data.items || []);
      setMovements(m.data.items || []);
    };
    load().catch(console.error);
  }, []);

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="topbar"><div><h1>Reports</h1><p className="muted">Insights and summaries</p></div></div>
      <div className="grid cards">
        <StatCard title="Products" value={summary?.totalProducts ?? '-'} />
        <StatCard title="Low Stock" value={summary?.lowStockCount ?? '-'} />
        <StatCard title="Movements" value={summary?.totalMovements ?? '-'} />
        <StatCard title="Total Quantity" value={summary?.totalQuantity ?? '-'} />
      </div>

      <div className="card">
        <h3>Low Stock Items</h3>
        <Table columns={['Product', 'Qty', 'Min Qty']} data={low} renderRow={(item) => (
          <tr key={item._id}>
            <td>{item.name}</td><td>{item.quantity}</td><td>{item.minQuantity}</td>
          </tr>
        )}/>
      </div>

      <div className="card">
        <h3>Recent Movements</h3>
        <Table columns={['Product', 'Type', 'Qty', 'Balance']} data={movements} renderRow={(item) => (
          <tr key={item._id}>
            <td>{item.product?.name || '-'}</td><td>{item.type}</td><td>{item.quantity}</td><td>{item.balanceAfter}</td>
          </tr>
        )}/>
      </div>
    </div>
  );
}
