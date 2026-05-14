import { getQuestionCountForTime } from "../data/onboardingData";

const SPEECH_KEY = "topspeech.lesson";

const defaultState = {
  streakDays: 0,
  totalXp: 0,
  xpGoal: 1200,
  currentDifficulty: "medium",
  dailyTime: "10 mins/day",
  lastLessonDate: "",
  lastLessonXp: 0,
  lastScorePercent: 0,
};

const dayKey = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const daysGap = (a, b) => {
  if (!a) return null;
  const d1 = new Date(`${a}T00:00:00`);
  const d2 = new Date(`${b}T00:00:00`);
  return Math.round((d2 - d1) / 86400000);
};

const nextDifficultyFromScore = (scorePercent, currentDifficulty) => {
  const order = ["easy", "medium", "hard"];
  const idx = Math.max(0, order.indexOf(currentDifficulty));
  if (scorePercent >= 80 && idx < order.length - 1) return order[idx + 1];
  if (scorePercent < 40 && idx > 0) return order[idx - 1];
  return order[idx];
};

const nextXpGoal = (goal, totalXp) => {
  let current = Math.max(600, goal || 1200);
  while (totalXp >= current) current += 400;
  return current;
};

export const loadSpeechState = () => {
  try {
    const raw = localStorage.getItem(SPEECH_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
};

export const saveSpeechState = (data) => {
  const current = loadSpeechState();
  localStorage.setItem(SPEECH_KEY, JSON.stringify({ ...current, ...data }));
};

export const getSpeechQuestionCount = () => {
  const state = loadSpeechState();
  return getQuestionCountForTime(state.dailyTime);
};

export const applySpeechLessonResult = (score, total) => {
  const current = loadSpeechState();
  const today = dayKey();
  const gap = daysGap(current.lastLessonDate, today);

  const streakDays = gap === null ? 1 : gap === 0 ? current.streakDays : gap === 1 ? current.streakDays + 1 : 1;
  const scorePercent = Math.round((score / Math.max(1, total)) * 100);
  const xpEarned = 60 + score * 20;
  const totalXp = current.totalXp + xpEarned;

  const result = {
    streakDays,
    totalXp,
    xpGoal: nextXpGoal(current.xpGoal, totalXp),
    currentDifficulty: nextDifficultyFromScore(scorePercent, current.currentDifficulty),
    lastLessonDate: today,
    lastLessonXp: xpEarned,
    lastScorePercent: scorePercent,
  };

  saveSpeechState(result);
  return { ...loadSpeechState(), ...result };
};
