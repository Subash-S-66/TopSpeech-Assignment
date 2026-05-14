import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingCard from "../../components/OnboardingCard";
import OptionCard from "../../components/OptionCard";
import ProgressDots from "../../components/ProgressDots";
import { DAILY_TIMES } from "../../data/onboardingData";
import { loadSpeechState, saveSpeechState } from "../../utils/speechStorage";

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function TopSpeechPreferences() {
  const navigate = useNavigate();
  const state = loadSpeechState();
  const [step, setStep] = useState(1);
  const [dailyTime, setDailyTime] = useState(state.dailyTime || DAILY_TIMES[1]);
  const [difficulty, setDifficulty] = useState(state.currentDifficulty || "medium");

  const savePrefs = () => saveSpeechState({ dailyTime, currentDifficulty: difficulty });

  if (step === 1) {
    return (
      <OnboardingCard title="How much time today?" subtitle="Pick your TopSpeech daily session length.">
        <ProgressDots step={1} total={2} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DAILY_TIMES.map((item) => (
            <OptionCard key={item} label={item} selected={dailyTime === item} onSelect={() => setDailyTime(item)} />
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/select")}
            className="w-1/3 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-2/3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue
          </button>
        </div>
      </OnboardingCard>
    );
  }

  return (
    <OnboardingCard title="Choose challenge level" subtitle="Adaptive difficulty will adjust after each lesson.">
      <ProgressDots step={2} total={2} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {DIFFICULTIES.map((item) => (
          <OptionCard
            key={item}
            label={item[0].toUpperCase() + item.slice(1)}
            selected={difficulty === item}
            onSelect={() => setDifficulty(item)}
          />
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-1/3 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            savePrefs();
            navigate("/topspeech/lesson");
          }}
          className="w-2/3 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
        >
          Save and start lesson
        </button>
      </div>
    </OnboardingCard>
  );
}
