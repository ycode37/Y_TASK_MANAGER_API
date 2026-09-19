import { useId, useState } from "react";

export default function Field({ label, error, type = "text", ...props }) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  return (
    <label htmlFor={id} className="mb-5 block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">{label}</span>
      <input
        id={id}
        type={type}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full border-0 border-b bg-transparent px-0 py-2 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-faint"
        style={{
          borderColor: error ? "var(--color-rust)" : "var(--color-line-strong)",
        }}
        {...props}
      />
      <span
        className="block h-[2px] bg-cobalt transition-all duration-300 ease-out"
        style={{ width: focused ? "100%" : "0%" }}
      />
      {error && <span className="mt-1.5 block text-[13px] text-rust">{error}</span>}
    </label>
  );
}
