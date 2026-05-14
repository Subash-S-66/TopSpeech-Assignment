import { motion } from "framer-motion";

export default function OptionCard({ label, selected, onSelect }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -3 }}
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-2xl border p-4 text-left transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        selected
          ? "border-brand-500 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg"
          : "border-slate-200 bg-white/80 text-slate-900 hover:border-brand-300 hover:shadow-md",
      ].join(" ")}
    >
      <span className="text-sm font-semibold sm:text-base">{label}</span>
    </motion.button>
  );
}
