import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DAILY_TIMES } from "../../data/onboardingData";
import { cancelPathEditSession, saveOnboarding } from "../../utils/storage";
import OnboardingCard from "../../components/OnboardingCard";
import OptionCard from "../../components/OptionCard";
import ProgressDots from "../../components/ProgressDots";

export default function TimeStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";
  const [selected, setSelected] = useState("");

  const handleContinue = () => {
    if (!selected) return;
    saveOnboarding({ dailyTime: selected });
    navigate(isEditMode ? "/onboarding/goal?edit=1" : "/onboarding/goal");
  };

  const handleBack = () => {
    navigate(isEditMode ? "/onboarding/topic?edit=1" : "/onboarding/topic");
  };

  const handleCancel = () => {
    cancelPathEditSession();
    navigate("/dashboard", { replace: true });
  };

  return (
    <OnboardingCard title="How much time per day?" subtitle="Consistency beats intensity.">
      <ProgressDots step={2} total={3} />
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
        {DAILY_TIMES.map((time) => (
          <OptionCard
            key={time}
            label={time}
            selected={selected === time}
            onSelect={() => setSelected(time)}
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
          onClick={handleContinue}
          className="w-2/3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </OnboardingCard>
  );
}
