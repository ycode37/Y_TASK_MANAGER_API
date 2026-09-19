import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "../store/useToastStore";

const toneBorder = {
  ink: "border-l-ink",
  moss: "border-l-moss",
  rust: "border-l-rust",
  cobalt: "border-l-cobalt",
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto w-full max-w-sm cursor-pointer border-l-2 bg-ink px-4 py-3 text-sm text-paper shadow-[0_8px_24px_rgba(0,0,0,0.18)] ${toneBorder[t.tone] || toneBorder.ink}`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
