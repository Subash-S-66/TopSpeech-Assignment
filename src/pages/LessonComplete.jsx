import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getLearningStats } from "../utils/storage";

const confetti = Array.from({ length: 20 }).map((_, idx) => ({
  id: idx,
  x: Math.random() * 100,
  delay: Math.random() * 0.7,
  duration: 1.6 + Math.random() * 1.2,
}));

export default function LessonComplete() {
  const navigate = useNavigate();
  const stats = useMemo(() => getLearningStats(), []);

  const message =
    stats.lastScorePercent >= 80
      ? "Excellent run. You are ready for a harder challenge."
      : stats.lastScorePercent >= 50
        ? "Great momentum. Keep the streak alive tomorrow."
        : "Solid effort. Repetition will lock this in.";

  const nextPreview = `Next: ${stats.lastLessonTopic || "DSA"} (${stats.currentDifficulty})`;

  return (
    <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 text-slate-900 shadow-card backdrop-blur-xl sm:p-8">
      {confetti.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ y: -40, opacity: 0, x: `${piece.x}%` }}
          animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: 180 }}
          transition={{ repeat: Infinity, duration: piece.duration, delay: piece.delay, ease: "linear" }}
          className="pointer-events-none absolute top-0 h-2 w-2 rounded-sm"
          style={{ left: `${piece.x}%`, background: piece.id % 2 ? "#34d399" : "#60a5fa" }}
        />
      ))}

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Lesson Complete</p>
        <h1 className="mt-2 text-3xl font-black">Great work</h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-700">XP earned</p>
            <p className="mt-1 text-2xl font-black text-emerald-800">+{stats.lastLessonXp}</p>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4">
            <p className="text-xs font-semibold uppercase text-orange-700">Streak updated</p>
            <p className="mt-1 text-2xl font-black text-orange-800">{stats.streakDays} days</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Next challenge preview</p>
          <p className="mt-2 text-sm font-semibold">{nextPreview}</p>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/quiz")}
            className="w-1/2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-400"
          >
            Next challenge
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-1/2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Back to home
          </button>
        </div>
      </div>
    </section>
  );
}
