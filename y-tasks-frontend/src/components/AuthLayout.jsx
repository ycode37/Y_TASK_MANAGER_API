import { motion } from "framer-motion";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[380px]"
      >
        <div className="mb-10 flex flex-col items-start">
          <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-[6px] bg-ink text-[15px] font-semibold text-paper">
            Y.
          </div>
          <h1 className="font-display text-[28px] leading-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[15px] text-ink-soft">{subtitle}</p>}
        </div>

        {children}

        {footer && <div className="mt-8 text-[14px] text-ink-soft">{footer}</div>}
      </motion.div>
    </div>
  );
}
