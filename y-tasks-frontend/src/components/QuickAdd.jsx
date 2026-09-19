import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function QuickAdd({ onAdd }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    const ok = await onAdd(trimmed);
    setSubmitting(false);
    if (ok) setValue("");
  };

  return (
    <div className="relative border-b border-line-strong">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 py-3.5">
        <Plus size={18} strokeWidth={2} className="shrink-0 text-ink-faint" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Add a task and press enter…"
          className="w-full border-0 bg-transparent p-0 text-[15px] text-ink outline-none placeholder:text-ink-faint"
        />
        <motion.button
          type="submit"
          animate={{ opacity: value.trim() ? 1 : 0.001 }}
          whileTap={{ scale: 0.94 }}
          disabled={!value.trim() || submitting}
          className="shrink-0 rounded-[5px] bg-ink px-3 py-1.5 text-[13px] font-semibold text-paper disabled:cursor-default"
        >
          Add
        </motion.button>
      </form>
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-px left-0 h-[2px] bg-cobalt transition-all duration-300 ease-out"
        style={{ width: focused ? "100%" : "0%" }}
      />
    </div>
  );
}
