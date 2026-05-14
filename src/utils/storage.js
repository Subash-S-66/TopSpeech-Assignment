import { getQuestionCountForTime, STORAGE_KEY } from "../data/onboardingData";

const EDIT_SNAPSHOT_KEY = "levelup.onboarding.editSnapshot";

const LESSON_DEFAULTS = {
  streakDays: 0,
  totalXp: 0,
  xpGoal: 1500,
  currentDifficulty: "medium",
  lastScorePercent: 0,
  lastLessonXp: 0,
  lastLessonTopic: "",
  lastLessonDate: "",
};

const getLocalDayKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateGapDays = (prevDayKey, currentDayKey) => {
  if (!prevDayKey) return null;

  const prev = new Date(`${prevDayKey}T00:00:00`);
  const current = new Date(`${currentDayKey}T00:00:00`);
  return Math.round((current - prev) / (1000 * 60 * 60 * 24));
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

export const startPathEditSession = () => {
  const current = loadOnboarding();
  localStorage.setItem(EDIT_SNAPSHOT_KEY, JSON.stringify(current));
};

export const cancelPathEditSession = () => {
  try {
    const raw = localStorage.getItem(EDIT_SNAPSHOT_KEY);
    if (raw) {
      localStorage.setItem(STORAGE_KEY, raw);
    }
  } finally {
    localStorage.removeItem(EDIT_SNAPSHOT_KEY);
  }
};

export const finishPathEditSession = () => {
  localStorage.removeItem(EDIT_SNAPSHOT_KEY);
};

export const getLearningStats = () => {
  const state = loadOnboarding();
  return {
    ...LESSON_DEFAULTS,
    ...state,
  };
};

export const getQuestionCountFromStats = () => {
  const stats = getLearningStats();
  return getQuestionCountForTime(stats.dailyTime);
};

const getNextDifficulty = (scorePercent, currentDifficulty) => {
  const order = ["easy", "medium", "hard"];
  const index = Math.max(0, order.indexOf(currentDifficulty));

  if (scorePercent >= 80 && index < order.length - 1) return order[index + 1];
  if (scorePercent < 40 && index > 0) return order[index - 1];
  return order[index];
};

const getUpdatedStreakDays = (currentStreak, lastLessonDate, todayKey) => {
  const gap = getDateGapDays(lastLessonDate, todayKey);

  if (gap === null) return 1;
  if (gap === 0) return currentStreak;
  if (gap === 1) return currentStreak + 1;
  return 1;
};

const getUpdatedXpGoal = (currentGoal, totalXp) => {
  let nextGoal = Math.max(500, currentGoal || 1500);
  while (totalXp >= nextGoal) {
    nextGoal += 500;
  }
  return nextGoal;
};

export const saveLessonResult = ({ topic, score, total }) => {
  const safeTotal = Math.max(1, total);
  const scorePercent = Math.round((score / safeTotal) * 100);
  const current = getLearningStats();
  const todayKey = getLocalDayKey();

  const xpEarned = 80 + score * 25;
  const updatedXp = current.totalXp + xpEarned;
  const nextDifficulty = getNextDifficulty(scorePercent, current.currentDifficulty);
  const updatedStreak = getUpdatedStreakDays(current.streakDays, current.lastLessonDate, todayKey);
  const nextXpGoal = getUpdatedXpGoal(current.xpGoal, updatedXp);

  const payload = {
    totalXp: updatedXp,
    xpGoal: nextXpGoal,
    streakDays: updatedStreak,
    lastScorePercent: scorePercent,
    lastLessonXp: xpEarned,
    lastLessonTopic: topic,
    lastLessonDate: todayKey,
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
