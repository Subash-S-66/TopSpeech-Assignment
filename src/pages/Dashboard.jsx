import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import InstallPrompt from "../components/pwa/InstallPrompt";
import { DAILY_TIMES } from "../data/onboardingData";
import { getLearningStats, saveOnboarding, startPathEditSession } from "../utils/storage";
import { saveSpeechState } from "../utils/speechStorage";

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = useMemo(() => getLearningStats(), []);
  const initialDifficulty = stats.currentDifficulty || "medium";
  const initialDailyTime = stats.dailyTime || DAILY_TIMES[1];
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [dailyTime, setDailyTime] = useState(initialDailyTime);
  const [savedDifficulty, setSavedDifficulty] = useState(initialDifficulty);
  const [savedDailyTime, setSavedDailyTime] = useState(initialDailyTime);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const hasPreferenceChanges = difficulty !== savedDifficulty || dailyTime !== savedDailyTime;

  const topic = stats.topic || "DSA";
  const currentStreak = stats.streakDays;
  const totalXp = stats.totalXp;
  const levelXpGoal = stats.xpGoal || 1500;
  const bestAccuracy = stats.lastScorePercent || 0;
  const progress = Math.max(0, Math.min(100, Math.round((totalXp / levelXpGoal) * 100)));

  const milestones = [
    { title: "Streak Goal", current: currentStreak, target: 7, tint: "from-orange-400 to-amber-500", unit: "days" },
    { title: "XP Goal", current: totalXp, target: levelXpGoal, tint: "from-sky-400 to-blue-500", unit: "xp" },
    { title: "Accuracy Goal", current: bestAccuracy, target: 100, tint: "from-emerald-400 to-green-500", unit: "%" },
  ];

  const handleEditPath = () => {
    startPathEditSession();
    navigate("/onboarding/topic?edit=1");
  };

  const handleSavePreferences = () => {
    saveOnboarding({ currentDifficulty: difficulty, dailyTime });
    setSavedDifficulty(difficulty);
    setSavedDailyTime(dailyTime);
    setShowSavedToast(true);
    window.setTimeout(() => setShowSavedToast(false), 1600);
  };

  return (
    <section className="w-full max-w-3xl pb-24 text-slate-900 sm:pb-6">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative mb-4 rounded-3xl border border-white/60 bg-gradient-to-r from-emerald-400/85 via-cyan-400/80 to-blue-500/85 p-6 text-white shadow-card sm:p-7"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Today {topic} Challenge</h1>
            <p className="mt-1 text-sm text-white/85">Track your LevelUp progress and install the app for quick access.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <InstallPrompt variant="button" className="bg-white text-slate-900 hover:bg-slate-100" />
            <button
              type="button"
              onClick={handleEditPath}
              className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 sm:px-4 sm:text-sm"
            >
              Edit Learning Path
            </button>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel rounded-3xl p-5">
          <p className="text-sm font-semibold text-slate-600">Total XP</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{totalXp.toLocaleString()}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-600">{totalXp} / {levelXpGoal} XP to next level</p>
        </motion.article>

        <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-3xl p-5">
          <p className="text-sm font-semibold text-slate-600">Current Streak</p>
          <div className="mt-2 flex items-end gap-3">
            <motion.span animate={{ scale: [1, 1.15, 1], rotate: [0, -7, 7, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} className="text-3xl" aria-hidden>
              {"\uD83D\uDD25"}
            </motion.span>
            <p className="text-3xl font-black text-slate-900">{currentStreak} days</p>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-600">Adaptive mode: <span className="capitalize">{stats.currentDifficulty}</span></p>
        </motion.article>
      </div>

      <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel mt-4 rounded-3xl p-4 sm:p-5">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Difficulty</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-400">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Daily Time</span>
            <select value={dailyTime} onChange={(event) => setDailyTime(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-400">
              {DAILY_TIMES.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-sm font-semibold text-slate-600">Daily Challenges</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">LevelUp</p>
            <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">Today {topic} Challenge</h2>
            <p className="mt-1 text-xs text-slate-600">Time: {dailyTime} | XP: +80 base + bonus</p>
            <button
              type="button"
              onClick={() => {
                saveOnboarding({ currentDifficulty: difficulty, dailyTime });
                navigate("/quiz");
              }}
              className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              Start LevelUp lesson
            </button>
          </div>

          <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">TopSpeech</p>
            <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">Today R-Sound Practice</h2>
            <p className="mt-1 text-xs text-slate-600">Session length: {dailyTime} with adaptive speech cards</p>
            <button
              type="button"
              onClick={() => {
                saveSpeechState({ dailyTime });
                navigate("/topspeech/preferences");
              }}
              className="mt-3 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-500"
            >
              Start TopSpeech lesson
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {hasPreferenceChanges ? (
            <button type="button" onClick={handleSavePreferences} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Save preferences
            </button>
          ) : null}
          <div className="text-xs text-slate-500">Preferences apply to LevelUp challenge.</div>
        </div>
      </motion.article>

      <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel mt-4 rounded-3xl p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-600">Progress Milestones</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {milestones.map((item) => {
            const pct = Math.max(0, Math.min(100, Math.round((item.current / item.target) * 100)));
            const done = pct >= 100;
            return (
              <motion.div key={item.title} whileHover={{ y: -3 }} className="rounded-2xl border border-white/70 bg-white/70 p-4">
                <div className={`inline-flex h-10 items-center rounded-xl bg-gradient-to-br px-3 text-xs font-bold text-white ${item.tint}`}>{done ? "Done" : "In progress"}</div>
                <p className="mt-3 text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-600">{item.current} / {item.target} {item.unit}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className={`h-full rounded-full bg-gradient-to-r ${item.tint}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.article>

      {showSavedToast ? (
        <motion.div initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-lg sm:bottom-6">
          {"\u2713"} Preferences saved
        </motion.div>
      ) : null}
    </section>
  );
}
