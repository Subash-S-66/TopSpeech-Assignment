import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { fetchQuizQuestions } from "../../services/gemini";
import { getLearningStats, saveLessonResult } from "../../utils/storage";

const normalize = (value) => value.trim().toLowerCase();

export default function QuizPage() {
  const navigate = useNavigate();
  const learningStats = useMemo(() => getLearningStats(), []);
  const topic = learningStats.topic || "DSA";

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const generated = await fetchQuizQuestions(topic, learningStats.currentDifficulty);
      setQuestions(generated.slice(0, 5));
      setLoading(false);
    };
    load();
  }, [topic, learningStats.currentDifficulty]);

  if (loading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!questions.length) {
    return (
      <section className="glass-panel w-full max-w-xl rounded-3xl p-8 text-center">
        <h1 className="text-2xl font-black text-slate-900">No quiz available right now</h1>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to dashboard
        </button>
      </section>
    );
  }

  const total = questions.length;
  const question = questions[index];
  const answered = result !== null;
  const progress = Math.round(((index + 1) / total) * 100);

  const evaluateAnswer = () => {
    const userInput = choice;
    if (!normalize(userInput)) return;

    const correct = normalize(userInput) === normalize(question.answer);
    if (correct) setScore((prev) => prev + 1);

    setResult(correct ? "correct" : "wrong");
  };

  const nextQuestion = () => {
    if (index === total - 1) {
      saveLessonResult({ topic, score: result === "correct" ? score + 1 : score, total });
      navigate("/lesson-complete", { replace: true });
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
          <span>Question {index + 1}/{total}</span>
          <span className="capitalize">Difficulty {learningStats.currentDifficulty}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            key={index}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={question.id}
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -24, scale: 0.98 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="glass-panel rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold text-slate-900">{question.question}</h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{question.difficulty}</p>

          <div className="mt-4 grid gap-3">
            {question.options.map((option) => {
              const selected = choice === option;
              return (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -2 }}
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => setChoice(option)}
                  className={[
                    "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-slate-200 bg-white/75 text-slate-800 hover:border-slate-300",
                  ].join(" ")}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {!answered ? (
            <button
              type="button"
              onClick={evaluateAnswer}
              disabled={!choice}
              className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check answer
            </button>
          ) : (
            <div
              className={[
                "mt-5 rounded-2xl border p-4",
                result === "correct"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800",
              ].join(" ")}
            >
              {result === "correct" ? (
                <motion.p
                  initial={{ scale: 0.95, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-sm font-bold"
                >
                  Correct. Great work!
                </motion.p>
              ) : (
                <p className="text-sm font-semibold">Not quite. Keep going.</p>
              )}
              <p className="mt-2 text-sm">Correct answer: {question.answer}</p>
              <p className="mt-1 text-sm">{question.explanation}</p>
              <button
                type="button"
                onClick={nextQuestion}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                {index === total - 1 ? "Finish quiz" : "Next question"}
              </button>
            </div>
          )}
        </motion.article>
      </AnimatePresence>
    </section>
  );
}
