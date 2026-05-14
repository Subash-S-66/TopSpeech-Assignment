import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOPICS } from "../../data/onboardingData";
import { saveOnboarding } from "../../utils/storage";
import OnboardingCard from "../../components/OnboardingCard";
import OptionCard from "../../components/OptionCard";
import ProgressDots from "../../components/ProgressDots";

export default function TopicStep() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const sortedTopics = useMemo(() => TOPICS, []);

  const handleContinue = () => {
    if (!selected) return;
    saveOnboarding({ topic: selected });
    navigate("/onboarding/time");
  };

  return (
    <OnboardingCard title="Pick your learning topic" subtitle="Choose where your streak starts.">
      <ProgressDots step={1} total={3} />
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
