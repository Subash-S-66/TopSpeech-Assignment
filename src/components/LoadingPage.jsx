import { motion } from "framer-motion";

export default function LoadingPage({
  title = "Preparing your lesson",
  message = "Generating questions...",
  subtitle = "This usually takes a few seconds.",
  rows = 4,
  accent = "from-teal-500 via-cyan-400 to-blue-500",
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/25 backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(240,249,255,0.55)_34%,_rgba(15,23,42,0.08)_100%)]" />
      <motion.div
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        className={`absolute -left-24 top-12 h-72 w-72 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-3xl`}
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -12, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute right-[-4rem] bottom-[-5rem] h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl"
      />

      <div className="relative flex min-h-full items-center justify-center px-4 py-8 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8"
        >
          <div className="mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{title}</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{message}</h2>
              <p className="mt-2 max-w-lg text-sm text-slate-600 sm:text-base">{subtitle}</p>
            </div>
          </div>

          <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200/80">
            <motion.div
              initial={{ x: "-40%" }}
              animate={{ x: ["-40%", "120%"] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className={`h-full w-1/2 rounded-full bg-gradient-to-r ${accent}`}
            />
          </div>

          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.55 }}
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ repeat: Infinity, duration: 1.25, delay: index * 0.08 }}
                className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-100 to-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${accent} opacity-90`} />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-5/6 rounded-full bg-slate-200" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-200/80" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
