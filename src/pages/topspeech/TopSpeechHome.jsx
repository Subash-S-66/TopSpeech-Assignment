import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DAILY_TIMES } from "../../data/onboardingData";
import { loadSpeechState, saveSpeechState } from "../../utils/speechStorage";

export default function TopSpeechHome() {
  const navigate = useNavigate();
  const stats = useMemo(() => loadSpeechState(), []);

  const [difficulty, setDifficulty] = useState(stats.currentDifficulty);
  const [dailyTime, setDailyTime] = useState(stats.dailyTime);
  const [showSettings, setShowSettings] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const xpGoal = stats.xpGoal || 1500;
  const xpProgress = Math.max(0, Math.min(100, Math.round((stats.totalXp / xpGoal) * 100)));

  const accuracyGoal = 100;
  const accuracyProgress = stats.lastScorePercent || 0;

  const handleEditPath = () => {
    setShowSettings(!showSettings);
  };

  const handleStartLesson = () => {
    saveSpeechState({ currentDifficulty: difficulty, dailyTime });
    navigate("/topspeech/lesson");
  };

  const handleStartLevelUp = () => {
    navigate("/levelup");
  };

  return (
    <section className="relative w-full max-w-4xl pb-24 text-slate-900 sm:pb-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-6 rounded-3xl border border-white/60 bg-gradient-to-r from-teal-500/90 via-cyan-500/80 to-emerald-500/85 p-6 text-white shadow-lg sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">Today Speech Challenge</h1>
          </div>
          <button
            onClick={handleEditPath}
            className="flex-shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-teal-600 transition hover:bg-white/90"
          >
            {showSettings ? "Hide Settings" : "Customize Settings"}
          </button>
        </div>
      </motion.header>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-white/40 bg-gradient-to-br from-cyan-100/80 to-blue-100/60 p-6 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold text-slate-600">Total XP</p>
          <p className="mt-3 text-4xl font-black text-slate-900">{stats.totalXp.toLocaleString()}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-300/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400"
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-600">{stats.totalXp.toLocaleString()} / {xpGoal.toLocaleString()} XP to next level</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/40 bg-gradient-to-br from-cyan-100/80 to-blue-100/60 p-6 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold text-slate-600">Current Streak</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-4xl" aria-hidden>🔥</span>
            <p className="text-4xl font-black text-slate-900">{stats.streakDays} days</p>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-600">
            Adaptive mode: <span className="capitalize font-semibold text-slate-800">{stats.currentDifficulty}</span>
          </p>
        </motion.article>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.article
            initial={{ opacity: 0, y: -14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-6 rounded-3xl border border-white/40 bg-gradient-to-br from-cyan-100/80 to-blue-100/60 p-6 backdrop-blur-sm"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm font-bold text-slate-900 mb-4"
            >
              Customize Your Learning
            </motion.p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <motion.label
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Difficulty</span>
                <motion.select
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </motion.select>
              </motion.label>
              <motion.label
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Daily Time</span>
                <motion.select
                  value={dailyTime}
                  onChange={(event) => setDailyTime(event.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-200 transition"
                >
                  {DAILY_TIMES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </motion.select>
              </motion.label>
            </div>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                saveSpeechState({ currentDifficulty: difficulty, dailyTime });
                setSavedToast(true);
                setShowSettings(false);
                setTimeout(() => setSavedToast(false), 2000);
              }}
              className="mt-4 w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Save Settings
            </motion.button>
          </motion.article>
        )}
      </AnimatePresence>

      {/* Daily Challenges Section */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 rounded-3xl border border-white/40 bg-gradient-to-br from-cyan-100/80 to-blue-100/60 p-6 backdrop-blur-sm"
      >
        <h2 className="text-sm font-bold text-slate-900 mb-1">Daily Challenges</h2>
        <p className="text-xs text-slate-600 mb-5">Complete your daily challenges to earn XP and maintain your streak</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* TopSpeech Challenge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/50 bg-white/60 p-5 backdrop-blur-sm hover:border-white/70 transition"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600">TopSpeech</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">Today R-Sound Challenge</h3>
            <p className="mt-1 text-xs text-slate-600">Clinically warm speech drill with adaptive cards</p>
            <button
              onClick={handleStartLesson}
              className="mt-4 w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Open TopSpeech lesson
            </button>
          </motion.div>

          {/* LevelUp Challenge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/50 bg-white/60 p-5 backdrop-blur-sm hover:border-white/70 transition"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">LevelUp</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900">Today Aptitude Challenge</h3>
            <p className="mt-1 text-xs text-slate-600">Time: <span className="font-semibold">10 mins/day | XP: +80 base + bonus</span></p>
            <button
              onClick={handleStartLevelUp}
              className="mt-4 w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Start LevelUp lesson
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Progress Milestones */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl border border-white/40 bg-gradient-to-br from-cyan-100/80 to-blue-100/60 p-6 backdrop-blur-sm"
      >
        <h2 className="text-sm font-bold text-slate-900 mb-5">Progress Milestones</h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Streak Goal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-white/50 bg-white/60 p-5 text-center backdrop-blur-sm"
          >
            <span className="inline-block rounded-full bg-orange-400 px-3 py-1 text-xs font-bold text-white">
              In progress
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Streak Goal</h3>
            <p className="mt-2 text-2xl font-black text-slate-900">{stats.streakDays} / 7 days</p>
          </motion.div>

          {/* XP Goal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/50 bg-white/60 p-5 text-center backdrop-blur-sm"
          >
            <span className="inline-block rounded-full bg-blue-400 px-3 py-1 text-xs font-bold text-white">
              In progress
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">XP Goal</h3>
            <p className="mt-2 text-2xl font-black text-slate-900">{stats.totalXp} / {xpGoal} XP</p>
          </motion.div>

          {/* Accuracy Goal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl border border-white/50 bg-white/60 p-5 text-center backdrop-blur-sm"
          >
            <span className="inline-block rounded-full bg-green-400 px-3 py-1 text-xs font-bold text-white">
              In progress
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Accuracy Goal</h3>
            <p className="mt-2 text-2xl font-black text-slate-900">{accuracyProgress} / 100%</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Save Toast Notification */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg sm:bottom-6"
          >
            ✓ Settings saved successfully
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
