const normalizeQuestion = (item, index, topic) => {
  const optionsRaw = Array.isArray(item.options) ? item.options.filter(Boolean).slice(0, 4) : [];
  const options = optionsRaw.length === 4 ? optionsRaw : ["Option A", "Option B", "Option C", "Option D"];
  const answerRaw = typeof item.answer === "string" ? item.answer.trim() : "";
  const answer = options.includes(answerRaw) ? answerRaw : options[0];

  return {
    id: `q-${index + 1}`,
    question: typeof item.question === "string" && item.question.trim() ? item.question.trim() : `${topic} concept question ${index + 1}`,
    options,
    answer,
    explanation:
      typeof item.explanation === "string" && item.explanation.trim()
        ? item.explanation.trim()
        : "Review the concept and try similar examples.",
    difficulty: typeof item.difficulty === "string" && item.difficulty.trim() ? item.difficulty.trim() : "medium",
  };
};

const fallbackByTopic = {
  DSA: [
    {
      question: "MCQ: Which data structure uses FIFO order?",
      options: ["Stack", "Queue", "Heap", "Trie"],
      answer: "Queue",
      explanation: "A queue processes first-in-first-out operations.",
      difficulty: "easy",
    },
    {
      question: "MCQ: Binary search works correctly on which kind of array?",
      options: ["Random array", "Sorted array", "Reverse-only array", "Sparse array only"],
      answer: "Sorted array",
      explanation: "Binary search repeatedly halves a sorted range.",
      difficulty: "easy",
    },
    {
      question: "MCQ: Time complexity of merge sort?",
      options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
      answer: "O(n log n)",
      explanation: "Merge sort splits recursively and merges linearly.",
      difficulty: "medium",
    },
    {
      question: "MCQ: What is a hash collision?",
      options: [
        "When two keys map to the same index",
        "When a hash table is empty",
        "When sorting fails",
        "When recursion exceeds stack size",
      ],
      answer: "When two keys map to the same index",
      explanation: "Collisions happen when distinct keys produce same bucket/index.",
      difficulty: "medium",
    },
    {
      question: "MCQ: Which traversal uses a queue in trees?",
      options: ["Inorder", "Preorder", "Postorder", "Level-order"],
      answer: "Level-order",
      explanation: "Level-order BFS uses a queue to process nodes by depth.",
      difficulty: "easy",
    },
  ],
};

const defaultFallback = [
  {
    question: "MCQ: Which approach improves mastery fastest?",
    options: ["Random guessing", "Spaced repetition", "Skipping basics", "One-time cramming"],
    answer: "Spaced repetition",
    explanation: "Spaced recall improves retention and long-term performance.",
    difficulty: "easy",
  },
  {
    question: "MCQ: Which pattern usually improves retention more?",
    options: ["One long weekly session", "Consistent daily practice", "No revision", "Only final review"],
    answer: "Consistent daily practice",
    explanation: "Consistency compounds understanding and recall.",
    difficulty: "easy",
  },
  {
    question: "MCQ: What does MVP stand for in product building?",
    options: ["Most Valuable Process", "Minimum Viable Product", "Maximum Verified Plan", "Managed Value Pipeline"],
    answer: "Minimum Viable Product",
    explanation: "MVP is the smallest useful version to validate assumptions.",
    difficulty: "easy",
  },
  {
    question: "MCQ: What best defines a feedback loop?",
    options: [
      "Ignoring outcomes and repeating the same plan",
      "Measuring outcomes and improving the next iteration",
      "Collecting data once and never reviewing it",
      "Working without goals",
    ],
    answer: "Measuring outcomes and improving the next iteration",
    explanation: "Feedback loops connect results back into better decisions.",
    difficulty: "medium",
  },
  {
    question: "MCQ: Which is best for tracking improvement?",
    options: ["No metrics", "One final test only", "Regular measurable checkpoints", "Memory alone"],
    answer: "Regular measurable checkpoints",
    explanation: "Checkpoints make progress visible and actionable.",
    difficulty: "easy",
  },
];

export const getFallbackQuestions = (topic, questionCount = 5) => {
  const pack = fallbackByTopic[topic] || defaultFallback;
  const normalized = pack.map((item, index) => normalizeQuestion(item, index, topic));
  return Array.from({ length: questionCount }).map((_, index) => {
    const source = normalized[index % normalized.length];
    return { ...source, id: `q-${index + 1}` };
  });
};

const DISABLED_MODELS_KEY = "quiz.disabledGeminiModels";
const GEMINI_COOLDOWN_KEY = "quiz.geminiCooldownUntil";
const GEMINI_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest", "gemini-1.5-flash"];

const buildGeminiRequest = (prompt, apiKey, model) =>
  fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5 },
    }),
  });

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
    const cur = loadDisabledModels();
    const next = Array.from(new Set([...cur, model]));
    localStorage.setItem(DISABLED_MODELS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
};

const setGeminiCooldown = () => {
  try {
    localStorage.setItem(GEMINI_COOLDOWN_KEY, String(Date.now() + GEMINI_COOLDOWN_MS));
  } catch {}
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

const parseJsonFromText = (text) => {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");
  if (firstBracket >= 0 && lastBracket > firstBracket) {
    return JSON.parse(cleaned.slice(firstBracket, lastBracket + 1));
  }
  return JSON.parse(cleaned);
};

export const fetchQuizQuestions = async (topic, difficulty = "medium", questionCount = 5) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return getFallbackQuestions(topic, questionCount);
  }

  const prompt = `Generate exactly ${questionCount} MCQ quiz questions for the topic: ${topic}. Target overall difficulty: ${difficulty}. Return only JSON array. Each item must have this schema: {"question":"","options":[],"answer":"","explanation":"","difficulty":""}. Rules: every question must include exactly 4 options; answer must match one of the options exactly.`;

  try {
    // If models are disabled or we're in cooldown, avoid calling Gemini
    if (isGeminiOnCooldown()) return getFallbackQuestions(topic, questionCount);

    const disabled = new Set(loadDisabledModels());
    const activeModels = GEMINI_MODELS.filter((m) => !disabled.has(m));
    if (activeModels.length === 0) return getFallbackQuestions(topic, questionCount);

    let response = null;
    let activeModel = activeModels[0];

      if (candidate.status === 404) {
    for (const model of activeModels) {
      // Try models in priority order and keep going when a model is unavailable.
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

    if (!response || !response.ok) throw new Error(`Gemini API failed`);

    const data = await response.json();
    const modelText =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || "";

    if (!modelText) throw new Error("Gemini returned empty response");

    const parsed = parseJsonFromText(modelText);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Gemini response is not a valid question array");
    }

    const normalized = parsed
      .slice(0, questionCount)
      .map((item, index) => normalizeQuestion(item, index, topic))
      .filter((item) => item.options.length === 4);
    if (normalized.length < questionCount) throw new Error("Gemini returned fewer than requested valid questions");

    return normalized;
  } catch {
    return getFallbackQuestions(topic, questionCount);
  }
};
