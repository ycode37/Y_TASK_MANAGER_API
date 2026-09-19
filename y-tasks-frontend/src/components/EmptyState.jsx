import { motion } from "framer-motion";

export default function EmptyState({ filtered }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex flex-col items-center py-16 text-center"
    >
      <p className="font-display text-[19px] text-ink">
        {filtered ? "Nothing matches." : "Your list is empty."}
      </p>
      <p className="mt-1.5 max-w-[260px] text-[14px] text-ink-soft">
        {filtered
          ? "Try a different search or clear the filter."
          : "Add your first task above to get started."}
      </p>
    </motion.div>
  );
}
