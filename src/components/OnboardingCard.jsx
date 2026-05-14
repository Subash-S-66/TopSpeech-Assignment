import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

export default function OnboardingCard({ title, subtitle, children }) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-panel w-full max-w-2xl rounded-3xl p-6 shadow-card sm:p-8"
    >
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-600 sm:text-base">{subtitle}</p> : null}
      </header>
      {children}
    </motion.section>
  );
}
