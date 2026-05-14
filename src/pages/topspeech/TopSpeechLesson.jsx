import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../components/LoadingPage";
import { applySpeechLessonResult, getSpeechQuestionCount, loadSpeechState } from "../../utils/speechStorage";
import { fetchSpeechLessonCards } from "../../services/speechGemini";

export default function TopSpeechLesson() {
  const navigate = useNavigate();
  const speechState = useMemo(() => loadSpeechState(), []);
  const totalCards = useMemo(() => getSpeechQuestionCount(), []);

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const generated = await fetchSpeechLessonCards({ count: totalCards, difficulty: speechState.currentDifficulty });
      setCards(generated);
      setLoading(false);
    };
    run();
  }, [speechState.currentDifficulty, totalCards]);

  if (loading) {
    return (
      <LoadingPage
        title="TopSpeech"
        message="Crafting your speech practice cards"
        subtitle="Gemini is generating a fresh R-sound lesson tailored to your current level."
        rows={Math.min(5, totalCards)}
        accent="from-teal-500 via-cyan-400 to-emerald-500"
      />
    );
  }

  if (!cards.length) {
    return (
      <LoadingPage
        title="TopSpeech"
        message="Refining your lesson"
        subtitle="We are rebuilding a clean set of practice cards right now."
        rows={4}
        accent="from-teal-500 via-cyan-400 to-emerald-500"
      />
    );
  }

  const card = cards[index];
  const total = cards.length;
  const progress = Math.round(((index + 1) / total) * 100);

  const checkAnswer = () => {
    if (!choice) return;
    const correct = choice.toLowerCase() === card.answer.toLowerCase();
    if (correct) setScore((prev) => prev + 1);
    setResult(correct ? "correct" : "wrong");
  };

  const next = () => {
    if (index === total - 1) {
      const finalScore = result === "correct" ? score + 1 : score;
      const summary = applySpeechLessonResult(finalScore, total);
      navigate("/topspeech/complete", { state: { summary } });
      return;
    }

    setIndex((prev) => prev + 1);
    setChoice("");
    setResult(null);
  };

  return (
    <section className="w-full max-w-2xl text-slate-900">
      <div className="glass-panel mb-4 rounded-3xl p-5">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
          <span>Exercise {index + 1}/{total}</span>
          <span className="capitalize">Difficulty {speechState.currentDifficulty}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <motion.div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400" animate={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={card.id}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          className="glass-panel rounded-3xl p-6"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">{card.type}</p>
          <h2 className="mt-2 text-lg font-bold">{card.prompt}</h2>
          <p className="mt-2 text-sm text-slate-600">{card.question}</p>

          <div className="mt-4 grid gap-2.5">
            {card.options.map((option) => {
              const active = choice === option;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={result !== null}
                  onClick={() => setChoice(option)}
                  className={[
                    "rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition",
                    active ? "border-teal-500 bg-teal-50 text-teal-900" : "border-slate-200 bg-white/80 hover:border-slate-300",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {result === null ? (
            <button
              type="button"
              disabled={!choice}
              onClick={checkAnswer}
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              Check
            </button>
          ) : (
            <div
              className={[
                "mt-5 rounded-2xl border p-4 text-sm",
                result === "correct" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800",
              ].join(" ")}
            >
              <p className="font-bold">{result === "correct" ? "Correct. Nice articulation." : "Not quite. Try one calm retry."}</p>
              <p className="mt-1">{card.explanation}</p>
              <button
                type="button"
                onClick={next}
                className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"
              >
                {index === total - 1 ? "Finish lesson" : "Next card"}
              </button>
            </div>
          )}
        </motion.article>
      </AnimatePresence>
    </section>
  );
}
