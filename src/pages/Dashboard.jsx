import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import InstallPrompt from "../components/pwa/InstallPrompt";
import { DAILY_TIMES } from "../data/onboardingData";
import { getLearningStats, saveOnboarding, startPathEditSession } from "../utils/storage";

const navTabs = [
  { label: "Home", icon: "HM", active: true },
  { label: "Progress", icon: "PG", active: false },
  { label: "Profile", icon: "PR", active: false },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useMemo(() => getLearningStats(), []);
  const [difficulty, setDifficulty] = useState(stats.currentDifficulty || "medium");
  const [dailyTime, setDailyTime] = useState(stats.dailyTime || DAILY_TIMES[1]);

  const topic = stats.topic || "DSA";
  const currentStreak = stats.streakDays;
  const totalXp = stats.totalXp;
  const levelXpGoal = stats.xpGoal || 1500;
  const bestAccuracy = stats.lastScorePercent || 0;
  const progress = Math.max(0, Math.min(100, Math.round((totalXp / levelXpGoal) * 100)));
  const milestones = [
    {
      title: "Streak Goal",
      current: currentStreak,
      target: 7,
      tint: "from-orange-400 to-amber-500",
      unit: "days",
    },
    {
      title: "XP Goal",
      current: totalXp,
      target: levelXpGoal,
      tint: "from-sky-400 to-blue-500",
      unit: "xp",
    },
    {
      title: "Accuracy Goal",
      current: bestAccuracy,
      target: 80,
      tint: "from-emerald-400 to-green-500",
      unit: "%",
    },
  ];

  const handleEditPath = () => {
    startPathEditSession();
    navigate("/onboarding/topic?edit=1");
  };

  return (
    <section className="w-full max-w-3xl pb-24 text-slate-900 sm:pb-6">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-4 rounded-3xl border border-white/60 bg-gradient-to-r from-emerald-400/85 via-cyan-400/80 to-blue-500/85 p-6 text-white shadow-card sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Today</p>
          <button
            type="button"
            onClick={handleEditPath}
            className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-slate-100 sm:px-4 sm:text-sm"
          >
            Edit Learning Path
          </button>
        </div>
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
              className="text-3xl"
              aria-hidden
            >
              {"\uD83D\uDD25"}
            </motion.span>
            <p className="text-3xl font-black text-slate-900">{currentStreak} days</p>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-600">
            Adaptive mode: <span className="capitalize">{stats.currentDifficulty}</span>
          </p>
        </motion.article>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-panel mt-4 rounded-3xl p-4 sm:p-5"
      >
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Difficulty</span>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-400"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Daily Time</span>
            <select
              value={dailyTime}
              onChange={(event) => setDailyTime(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-400"
            >
              {DAILY_TIMES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-sm font-semibold text-slate-600">Daily Challenge</p>
        <h2 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">Master core {topic} concepts in {dailyTime.replace("/day", "")}</h2>
        <p className="mt-1.5 text-sm text-slate-600">XP reward: +80 base + accuracy bonus | Includes quiz + guided practice</p>
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              saveOnboarding({ currentDifficulty: difficulty, dailyTime });
              navigate("/quiz");
            }}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Save and start lesson
          </button>
          <button
            type="button"
            onClick={() => saveOnboarding({ currentDifficulty: difficulty, dailyTime })}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Save preferences
          </button>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel mt-4 rounded-3xl p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-600">Progress Milestones</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {milestones.map((item) => {
            const pct = Math.max(0, Math.min(100, Math.round((item.current / item.target) * 100)));
            const done = pct >= 100;
            return (
              <motion.div
                key={item.title}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-white/70 bg-white/70 p-4"
              >
                <div className={`inline-flex h-10 items-center rounded-xl bg-gradient-to-br px-3 text-xs font-bold text-white ${item.tint}`}>
                  {done ? "Done" : "In progress"}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {item.current} / {item.target} {item.unit}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${item.tint}`}
                  />
                </div>
              </motion.div>
            );
          })}
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
