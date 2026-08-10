import React from "react";

const Input = React.forwardRef(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs text-gray-400">
          {label}
        </label>
      )}

      <input
        ref={ref}
        {...props}
        className={`bg-bg-hover border border-bg-border rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-accent transition ${className}`}
      />

      {error && (
        <span className="text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  );
});

export default Input;