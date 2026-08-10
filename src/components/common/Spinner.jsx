export default function Spinner({ size = 24 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="border-2 border-bg-border border-t-accent rounded-full animate-spin"
    />
  );
}
