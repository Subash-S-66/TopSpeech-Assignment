import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GOALS } from "../../data/onboardingData";
import { cancelPathEditSession, finishPathEditSession, saveOnboarding } from "../../utils/storage";
import OnboardingCard from "../../components/OnboardingCard";
import OptionCard from "../../components/OptionCard";
import ProgressDots from "../../components/ProgressDots";

export default function GoalStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";
  const [selected, setSelected] = useState("");

  const handleComplete = () => {
    if (!selected) return;
    saveOnboarding({ goal: selected, completedAt: new Date().toISOString() });
    finishPathEditSession();
    navigate("/dashboard", { replace: true });
  };

  const handleBack = () => {
    navigate(isEditMode ? "/onboarding/time?edit=1" : "/onboarding/time");
  };

  const handleCancel = () => {
    cancelPathEditSession();
    navigate("/dashboard", { replace: true });
  };

  return (
    <OnboardingCard title="What is your learning goal?" subtitle="We will adapt content around this focus.">
      <ProgressDots step={3} total={3} />
      {isEditMode ? (
        <button
          type="button"
          onClick={handleCancel}
          className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back to Dashboard
        </button>
      ) : null}
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
          onClick={handleBack}
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
