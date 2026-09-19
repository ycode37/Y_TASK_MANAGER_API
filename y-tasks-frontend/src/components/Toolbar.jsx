import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const STATUSES = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "done", label: "Done" },
];

const SORTS = [
  { key: "-createdAt", label: "Newest" },
  { key: "createdAt", label: "Oldest" },
  { key: "taskName", label: "Name, A–Z" },
  { key: "-taskName", label: "Name, Z–A" },
];

export default function Toolbar({ status, onStatusChange, sort, onSortChange, onSearchChange }) {
  const [searchValue, setSearchValue] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearchChange(searchValue), 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-ink-faint">
        <Search size={15} strokeWidth={2} />
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search tasks"
          className="w-full min-w-0 border-0 bg-transparent p-0 text-[14px] text-ink outline-none placeholder:text-ink-faint sm:w-40"
        />
      </div>

      <div className="flex items-center gap-5">
        <div className="relative flex items-center gap-1 rounded-full bg-paper-dim p-0.5">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onStatusChange(s.key)}
              className="relative z-10 rounded-full px-3 py-1 text-[13px] font-medium transition-colors"
              style={{ color: status === s.key ? "var(--color-paper)" : "var(--color-ink-soft)" }}
            >
              {status === s.key && (
                <motion.span
                  layoutId="status-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  className="absolute inset-0 -z-10 rounded-full bg-ink"
                />
              )}
              {s.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort tasks"
          className="border-0 bg-transparent text-[13px] font-medium text-ink-soft outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
