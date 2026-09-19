import { motion } from "framer-motion";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[6px] text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary: "bg-ink text-paper hover:bg-[#2b2f38] px-5 py-2.5",
  ghost: "text-ink-soft hover:text-ink px-3 py-2",
};

export default function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
