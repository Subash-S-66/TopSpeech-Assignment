import { buildSpeechLessonCards } from "../data/speechLessonData";

const RECENT_KEY = "topspeech.recentQuestions";
const RECENT_LIMIT = 30;
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest", "gemini-1.5-flash"];
const inFlightRequests = new Map();
const DISABLED_MODELS_KEY = "topspeech.disabledGeminiModels";
const GEMINI_COOLDOWN_KEY = "topspeech.geminiCooldownUntil";
const GEMINI_COOLDOWN_MS = 5 * 60 * 1000;

const parseJsonFromText = (text) => {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
  return JSON.parse(cleaned);
};

const normalizeQuestionKey = (value) => (value || "").trim().toLowerCase();

const loadRecentQuestions = () => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const loadDisabledModels = () => {
  try {
    const raw = localStorage.getItem(DISABLED_MODELS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const saveDisabledModel = (model) => {
  try {
    const current = loadDisabledModels();
    const next = [...new Set([...current, model])];
    localStorage.setItem(DISABLED_MODELS_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures and continue with in-memory behavior.
  }
};

const setGeminiCooldown = () => {
  try {
    localStorage.setItem(GEMINI_COOLDOWN_KEY, String(Date.now() + GEMINI_COOLDOWN_MS));
  } catch {
    // Ignore storage failures.
  }
};

const isGeminiOnCooldown = () => {
  try {
    const raw = localStorage.getItem(GEMINI_COOLDOWN_KEY);
    const until = Number(raw || 0);
    return Number.isFinite(until) && until > Date.now();
  } catch {
    return false;
  }
};

const saveRecentQuestions = (questions) => {
  const current = loadRecentQuestions();
  const merged = [...questions.map(normalizeQuestionKey), ...current]
    .filter(Boolean)
    .filter((item, idx, arr) => arr.indexOf(item) === idx)
    .slice(0, RECENT_LIMIT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(merged));
};

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const logQuestionsToConsole = (cards, source) => {
  if (typeof console === "undefined" || !Array.isArray(cards)) return;

  console.groupCollapsed?.(`[TopSpeech] ${source} questions (${cards.length})`);
  cards.forEach((card, index) => {
    console.log(`${index + 1}. ${card.question}`, card);
  });
  console.groupEnd?.();
};

const buildGeminiRequest = (prompt, apiKey, model) =>
  fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8 },
    }),
  });

const normalize = (item, idx) => {
  const optionsRaw = Array.isArray(item.options) ? item.options.filter(Boolean).slice(0, 4) : [];
  const options = optionsRaw.length === 4 ? optionsRaw : ["Option A", "Option B", "Option C", "Option D"];
  const answerRaw = typeof item.answer === "string" ? item.answer.trim() : "";

  return {
    id: `speech-${idx + 1}`,
    type: typeof item.type === "string" ? item.type : "speech-practice",
    prompt: typeof item.prompt === "string" && item.prompt.trim() ? item.prompt.trim() : "Practice the R sound calmly.",
    question: typeof item.question === "string" && item.question.trim() ? item.question.trim() : "Choose the best cue.",
    options,
    answer: options.includes(answerRaw) ? answerRaw : options[0],
    explanation:
      typeof item.explanation === "string" && item.explanation.trim()
        ? item.explanation.trim()
        : "Focus on relaxed jaw and steady airflow.",
    difficulty: typeof item.difficulty === "string" && item.difficulty.trim() ? item.difficulty.trim() : "medium",
  };
};

const uniqueAgainstRecent = (cards, count, recent) => {
  const recentSet = new Set(recent.map(normalizeQuestionKey));
  const unique = [];

  for (const card of cards) {
    const key = normalizeQuestionKey(card.question);
    if (!recentSet.has(key) && !unique.some((item) => normalizeQuestionKey(item.question) === key)) {
      unique.push(card);
    }
    if (unique.length >= count) break;
  }

  return unique;
};

const fallbackCards = (count, difficulty, recent) => {
  const base = buildSpeechLessonCards(Math.max(count * 2, 10), difficulty);
  const shuffled = shuffle(base);
  const firstPass = uniqueAgainstRecent(shuffled, count, recent);

  if (firstPass.length >= count) return firstPass;

  // If we run out, add lightweight phrasing variation so cards are still distinct.
  const needed = count - firstPass.length;
  const extras = shuffle(base).slice(0, needed).map((card, idx) => ({
    ...card,
    id: `${card.id}-v${idx + 1}`,
    question: `${card.question} (variation ${idx + 1})`,
  }));

  return [...firstPass, ...extras].slice(0, count);
};

export const fetchSpeechLessonCards = async ({ count = 5, difficulty = "medium" }) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const recent = loadRecentQuestions();
  const disabledModels = new Set(loadDisabledModels());
  const activeModels = GEMINI_MODELS.filter((model) => !disabledModels.has(model));
  const requestKey = `${count}:${difficulty}:${recent.slice(0, 10).join("|")}`;

  if (inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey);
  }

  const requestPromise = (async () => {
    if (!apiKey) {
      const fallback = fallbackCards(count, difficulty, recent);
      saveRecentQuestions(fallback.map((item) => item.question));
      logQuestionsToConsole(fallback, "Fallback");
      return fallback;
    }

    if (isGeminiOnCooldown() || activeModels.length === 0) {
      const fallback = fallbackCards(count, difficulty, recent);
      saveRecentQuestions(fallback.map((item) => item.question));
      logQuestionsToConsole(fallback, "Fallback");
      return fallback;
    }

    const avoidList = recent.slice(0, 10).join(" |");
    const prompt = `Create exactly ${count} MCQ exercise cards for rhotacism (R sound speech therapy). Return only JSON array with this schema: {"type":"","prompt":"","question":"","options":[],"answer":"","explanation":"","difficulty":"${difficulty}"}. Rules: exactly 4 options; answer must match one option; tone should be warm and clinically supportive; avoid repeating these recent questions: ${avoidList || "none"}. Generate fresh wording.`;

    try {
      let response = null;
      let activeModel = activeModels[0];

      for (const model of activeModels) {
        // Retry different model names because some environments expose a subset of Gemini models.
        // Unavailable models should not stop the lesson; we move on to the next candidate.
        // eslint-disable-next-line no-await-in-loop
        const candidate = await buildGeminiRequest(prompt, apiKey, model);
        if (candidate.ok) {
          response = candidate;
          activeModel = model;
          break;
        }

        if (candidate.status === 404) {
          saveDisabledModel(model);
          continue;
        }

        if (candidate.status === 429 || candidate.status === 403 || candidate.status === 503) {
          setGeminiCooldown();
          continue;
        }

        continue;
      }

      if (!response || !response.ok) throw new Error("Gemini failed");

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join("\n")
          .trim() || "";

      if (!text) throw new Error("Empty model response");

      const parsed = parseJsonFromText(text);
      if (!Array.isArray(parsed) || parsed.length < count) throw new Error("Invalid card count");

      const normalized = parsed.map((item, idx) => normalize(item, idx));
      const unique = uniqueAgainstRecent(normalized, count, recent);

      if (unique.length < count) {
        const fallback = fallbackCards(count, difficulty, recent);
        saveRecentQuestions(fallback.map((item) => item.question));
        logQuestionsToConsole(fallback, "Fallback");
        return fallback;
      }

      saveRecentQuestions(unique.map((item) => item.question));
      logQuestionsToConsole(unique, `Gemini (${activeModel})`);
      return unique.slice(0, count);
    } catch {
      const fallback = fallbackCards(count, difficulty, recent);
      saveRecentQuestions(fallback.map((item) => item.question));
      logQuestionsToConsole(fallback, "Fallback");
      return fallback;
    }
  })();

  inFlightRequests.set(requestKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightRequests.delete(requestKey);
  }
};
