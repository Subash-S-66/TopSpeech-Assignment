export const STORAGE_KEY = "levelup.onboarding";

export const TOPICS = [
  "DSA",
  "Machine Learning",
  "Data Science",
  "Aptitude",
  "Web Development",
  "SQL",
  "System Design",
  "DevOps",
];

export const DAILY_TIMES = ["5 mins/day", "10 mins/day", "15 mins/day", "30 mins/day"];

export const GOALS = ["Job interviews", "College placements", "Career switch", "Skill growth"];

const DAILY_TIME_TO_QUESTIONS = {
  "5 mins/day": 3,
  "10 mins/day": 5,
  "15 mins/day": 7,
  "30 mins/day": 10,
};

export const getQuestionCountForTime = (dailyTime) => DAILY_TIME_TO_QUESTIONS[dailyTime] || 5;
