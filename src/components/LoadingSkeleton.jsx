import { motion } from "framer-motion";

export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="glass-panel w-full max-w-2xl rounded-3xl p-6">
      <div className="mb-5 h-5 w-40 animate-pulse rounded-full bg-slate-200" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0.45 }}
            animate={{ opacity: [0.45, 0.9, 0.45] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.08 }}
            className="h-12 rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    </div>
  );
}
