export default function FormField({ label, children }) {
  return (
    <label className="grid" style={{ gap: '.35rem' }}>
      <span className="small muted">{label}</span>
      {children}
    </label>
  );
}
