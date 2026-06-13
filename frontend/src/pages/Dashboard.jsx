import { useEffect, useState } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [sumRes, lowRes] = await Promise.all([
        api.get('/reports/summary'),
        api.get('/reports/low-stock')
      ]);
      setSummary(sumRes.data.summary);
      setLowStock(lowRes.data.items || []);
    };
    load().catch(console.error);
  }, []);

  return (
    <div className="grid" style={{ gap: '1rem' }}>
      <div className="topbar">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Inventory overview</p>
        </div>
      </div>

      <div className="grid cards">
        <StatCard title="Total Products" value={summary?.totalProducts ?? '-'} />
        <StatCard title="Low Stock Items" value={summary?.lowStockCount ?? '-'} />
        <StatCard title="Total Movements" value={summary?.totalMovements ?? '-'} />
        <StatCard title="Total Quantity" value={summary?.totalQuantity ?? '-'} />
      </div>

      <div className="card">
        <h3>Low Stock Alerts</h3>
        {lowStock.length ? (
          <div className="grid">
            {lowStock.map((item) => (
              <div key={item._id} className="notice">
                {item.name} — {item.quantity} left, minimum {item.minQuantity}
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No low stock products.</p>
        )}
      </div>
    </div>
  );
}
