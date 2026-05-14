import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TOPICS } from "../../data/onboardingData";
import { cancelPathEditSession, saveOnboarding } from "../../utils/storage";
import OnboardingCard from "../../components/OnboardingCard";
import OptionCard from "../../components/OptionCard";
import ProgressDots from "../../components/ProgressDots";

export default function TopicStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";
  const [selected, setSelected] = useState("");

  const sortedTopics = useMemo(() => TOPICS, []);

  const handleContinue = () => {
    if (!selected) return;
    saveOnboarding({ topic: selected });
    navigate(isEditMode ? "/onboarding/time?edit=1" : "/onboarding/time");
  };

  const handleCancel = () => {
    cancelPathEditSession();
    navigate("/dashboard", { replace: true });
  };

  return (
    <OnboardingCard title="Pick your learning topic" subtitle="Choose where your streak starts.">
      <ProgressDots step={1} total={3} />
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
        {sortedTopics.map((topic) => (
          <OptionCard
            key={topic}
            label={topic}
            selected={selected === topic}
            onSelect={() => setSelected(topic)}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={!selected}
        onClick={handleContinue}
        className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </OnboardingCard>
  );
}
