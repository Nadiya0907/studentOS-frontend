export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-bg-card border border-bg-border rounded-2xl shadow-lg p-4 ${className}`}>
      {children}
    </div>
  );
}
