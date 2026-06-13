export default function Table({ columns, data, renderRow }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {data.length ? data.map(renderRow) : (
            <tr><td colSpan={columns.length} className="muted">No data found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
