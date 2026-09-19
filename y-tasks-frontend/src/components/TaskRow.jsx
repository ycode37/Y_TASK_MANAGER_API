import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function TaskRow({ task, onToggle, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.taskName);
  const inputRef = useRef(null);

  const startEdit = () => {
    setDraft(task.taskName);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.taskName) {
      onRename(task._id, trimmed);
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, transition: { duration: 0.22 } }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      data-done={task.done}
      className="task-row group flex items-center gap-3.5 border-b border-line py-3.5 first:pt-0 last:border-b-0"
    >
      <button
        type="button"
        onClick={() => onToggle(task._id, !task.done)}
        aria-pressed={task.done}
        aria-label={task.done ? "Mark task as not done" : "Mark task as done"}
        className="shrink-0 rounded-full"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle
            className="check-circle"
            cx="11"
            cy="11"
            r="9.5"
            stroke={task.done ? "var(--color-moss)" : "var(--color-line-strong)"}
            fill={task.done ? "var(--color-moss)" : "transparent"}
          />
          <path
            className="check-mark"
            d="M6.5 11.3L9.5 14.3L15.5 7.8"
            stroke="var(--color-paper)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      <div className="relative min-w-0 flex-1">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-full border-0 bg-transparent p-0 text-[15px] text-ink outline-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="relative inline-block max-w-full truncate align-top text-left text-[15px]"
            style={{ color: task.done ? "var(--color-ink-soft)" : "var(--color-ink)" }}
            title="Click to rename"
          >
            {task.taskName}
            <span className="strike-line" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDelete(task._id)}
        aria-label="Delete task"
        className="shrink-0 rounded p-1 text-ink-faint opacity-0 transition-opacity hover:text-rust focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Trash2 size={16} strokeWidth={1.75} />
      </button>
    </motion.li>
  );
}
