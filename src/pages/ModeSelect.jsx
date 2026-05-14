import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const choices = [
  {
    title: "LevelUp Learning",
    subtitle: "Coding topics, quizzes, XP, streak tracking",
    action: "/onboarding/topic",
    tint: "from-blue-500 to-cyan-400",
  },
  {
    title: "TopSpeech Daily Lesson",
    subtitle: "Speech therapy lesson prototype for rhotacism",
    action: "/topspeech-entry",
    tint: "from-emerald-500 to-teal-400",
  },
];

export default function ModeSelect() {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-3xl text-white">
      <h1 className="text-center text-3xl font-black tracking-tight sm:text-4xl">Choose Experience</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-white/85 sm:text-base">
        Select which prototype you want to open.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {choices.map((item, idx) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate(item.action)}
            className={`rounded-3xl border border-white/40 bg-gradient-to-br ${item.tint} p-6 text-left shadow-card`}
          >
            <h2 className="text-xl font-black">{item.title}</h2>
            <p className="mt-2 text-sm text-white/90">{item.subtitle}</p>
            <span className="mt-5 inline-block rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">
              Open
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
