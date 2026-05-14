import { STORAGE_KEY } from "../data/onboardingData";

const LESSON_DEFAULTS = {
  streakDays: 1,
  totalXp: 0,
  currentDifficulty: "medium",
  lastScorePercent: 0,
  lastLessonXp: 0,
  lastLessonTopic: "",
};

export const loadOnboarding = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const saveOnboarding = (data) => {
  const current = loadOnboarding();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
};

export const clearOnboarding = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getLearningStats = () => {
  const state = loadOnboarding();
  return {
    ...LESSON_DEFAULTS,
    ...state,
  };
};

const getNextDifficulty = (scorePercent, currentDifficulty) => {
  const order = ["easy", "medium", "hard"];
  const index = Math.max(0, order.indexOf(currentDifficulty));

  if (scorePercent >= 80 && index < order.length - 1) return order[index + 1];
  if (scorePercent < 40 && index > 0) return order[index - 1];
  return order[index];
};

export const saveLessonResult = ({ topic, score, total }) => {
  const safeTotal = Math.max(1, total);
  const scorePercent = Math.round((score / safeTotal) * 100);
  const current = getLearningStats();

  const xpEarned = 80 + score * 25;
  const nextDifficulty = getNextDifficulty(scorePercent, current.currentDifficulty);

  const payload = {
    totalXp: current.totalXp + xpEarned,
    streakDays: current.streakDays + 1,
    lastScorePercent: scorePercent,
    lastLessonXp: xpEarned,
    lastLessonTopic: topic,
    currentDifficulty: nextDifficulty,
    completedAt: new Date().toISOString(),
  };

  saveOnboarding(payload);

  return {
    ...payload,
    score,
    total: safeTotal,
  };
};
