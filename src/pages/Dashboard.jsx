import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import InstallPrompt from "../components/pwa/InstallPrompt";
import { getLearningStats } from "../utils/storage";

const achievements = [
  { title: "7 day streak", tint: "from-orange-400 to-amber-500", icon: "STR" },
  { title: "fast learner", tint: "from-sky-400 to-blue-500", icon: "SPD" },
  { title: "quiz master", tint: "from-emerald-400 to-green-500", icon: "QZ" },
];

const navTabs = [
  { label: "Home", icon: "HM", active: true },
  { label: "Progress", icon: "PG", active: false },
  { label: "Profile", icon: "PR", active: false },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useMemo(() => getLearningStats(), []);

  const topic = stats.topic || "DSA";
  const currentStreak = stats.streakDays;
  const totalXp = stats.totalXp;
  const levelXpGoal = 1800;
  const progress = Math.max(0, Math.min(100, Math.round((totalXp / levelXpGoal) * 100)));

  return (
    <section className="w-full max-w-3xl pb-24 text-slate-900 sm:pb-6">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-4 rounded-3xl border border-white/60 bg-gradient-to-r from-emerald-400/85 via-cyan-400/80 to-blue-500/85 p-6 text-white shadow-card"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Today</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Today&apos;s {topic} Challenge</h1>
      </motion.header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-panel rounded-3xl p-5"
        >
          <p className="text-sm font-semibold text-slate-600">Total XP</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{totalXp.toLocaleString()}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-600">{totalXp} / {levelXpGoal} XP to next level</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-5"
        >
          <p className="text-sm font-semibold text-slate-600">Current Streak</p>
          <div className="mt-2 flex items-end gap-3">
            <motion.span
              animate={{ scale: [1, 1.15, 1], rotate: [0, -7, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              className="text-3xl font-black text-orange-500"
              aria-hidden
            >
              F
            </motion.span>
            <p className="text-3xl font-black text-slate-900">{currentStreak} days</p>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-600">Adaptive mode: {stats.currentDifficulty}</p>
        </motion.article>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-panel mt-4 rounded-3xl p-5"
      >
        <p className="text-sm font-semibold text-slate-600">Daily Challenge</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Master core {topic} concepts in 12 minutes</h2>
        <p className="mt-2 text-sm text-slate-600">XP reward: +80 base + accuracy bonus | Includes quiz + guided practice</p>
        <button
          type="button"
          onClick={() => navigate("/quiz")}
          className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Start lesson
        </button>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel mt-4 rounded-3xl p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">Recent Achievements</p>
          <button
            type="button"
            onClick={() => navigate("/onboarding/topic")}
            className="text-xs font-semibold text-blue-700 hover:text-blue-600"
          >
            Edit path
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {achievements.map((badge) => (
            <motion.div
              key={badge.title}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/70 bg-white/70 p-4"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-[10px] font-bold text-white ${badge.tint}`}>
                <span aria-hidden>{badge.icon}</span>
              </div>
              <p className="mt-3 text-sm font-semibold capitalize text-slate-900">{badge.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.article>

      <nav className="fixed bottom-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-white/70 bg-white/70 p-2 shadow-lg backdrop-blur-xl sm:hidden">
        <ul className="grid grid-cols-3 gap-1">
          {navTabs.map((tab) => (
            <li key={tab.label}>
              <button
                type="button"
                className={[
                  "flex w-full flex-col items-center justify-center rounded-xl px-2 py-2 text-xs font-semibold transition",
                  tab.active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-white/80",
                ].join(" ")}
              >
                <span className="text-[10px] font-black leading-none" aria-hidden>
                  {tab.icon}
                </span>
                <span className="mt-1">{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <InstallPrompt />
    </section>
  );
}
