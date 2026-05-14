import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GOALS } from "../../data/onboardingData";
import { saveOnboarding } from "../../utils/storage";
import OnboardingCard from "../../components/OnboardingCard";
import OptionCard from "../../components/OptionCard";
import ProgressDots from "../../components/ProgressDots";

export default function GoalStep() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const handleComplete = () => {
    if (!selected) return;
    saveOnboarding({ goal: selected, completedAt: new Date().toISOString() });
    navigate("/dashboard", { replace: true });
  };

  return (
    <OnboardingCard title="What is your learning goal?" subtitle="We will adapt content around this focus.">
      <ProgressDots step={3} total={3} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GOALS.map((goal) => (
          <OptionCard
            key={goal}
            label={goal}
            selected={selected === goal}
            onSelect={() => setSelected(goal)}
          />
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => navigate("/onboarding/time")}
          className="w-1/3 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!selected}
          onClick={handleComplete}
          className="w-2/3 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start Learning
        </button>
      </div>
    </OnboardingCard>
  );
}
