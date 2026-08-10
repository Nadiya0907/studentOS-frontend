export default function Button({
  children,
  type = "button",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-accent-gradient transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}