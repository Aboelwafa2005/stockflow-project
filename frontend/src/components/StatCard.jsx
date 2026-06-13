export default function StatCard({ title, value, note }) {
  return (
    <div className="card">
      <div className="muted small">{title}</div>
      <h3>{value}</h3>
      {note && <p className="muted small">{note}</p>}
    </div>
  );
}
