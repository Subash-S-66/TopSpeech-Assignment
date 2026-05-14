import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { loadSpeechState } from "../../utils/speechStorage";

export default function TopSpeechComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const summary = location.state?.summary || loadSpeechState();

  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-panel w-full max-w-2xl rounded-3xl p-6 text-slate-900 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Lesson Complete</p>
      <h1 className="mt-2 text-3xl font-black">You showed up today.</h1>
      <p className="mt-2 text-sm text-slate-600">Consistency matters more than perfection in speech therapy.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase text-emerald-700">XP Earned</p>
          <p className="mt-1 text-2xl font-black text-emerald-900">+{summary.lastLessonXp || 0}</p>
        </div>
        <div className="rounded-2xl bg-orange-50 p-4">
          <p className="text-xs font-semibold uppercase text-orange-700">Streak</p>
          <p className="mt-1 text-2xl font-black text-orange-900">{summary.streakDays || 0} days</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Next challenge preview</p>
        <p className="mt-1 text-sm font-semibold">Tomorrow: R in connected speech with gentle pacing cues.</p>
      </div>

      <div className="mt-5 flex gap-3">
        <button type="button" onClick={() => navigate("/topspeech/lesson")} className="w-1/2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-bold text-white">
          Do another lesson
        </button>
        <button type="button" onClick={() => navigate("/topspeech")} className="w-1/2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">
          Back home
        </button>
      </div>
    </motion.section>
  );
}
