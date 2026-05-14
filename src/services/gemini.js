const normalizeQuestion = (item, index, topic) => {
  const options = Array.isArray(item.options) ? item.options.filter(Boolean).slice(0, 6) : [];
  const answer = typeof item.answer === "string" ? item.answer.trim() : "";

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
      question: "True/False: Binary search requires a sorted array.",
      options: ["True", "False"],
      answer: "True",
      explanation: "Binary search repeatedly halves a sorted range.",
      difficulty: "easy",
    },
    {
      question: "Flashcard: Time complexity of merge sort?",
      options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
      answer: "O(n log n)",
      explanation: "Merge sort splits recursively and merges linearly.",
      difficulty: "medium",
    },
    {
      question: "Short concept: What is a hash collision?",
      options: [],
      answer: "When two keys map to the same hash index",
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
    question: "True/False: Consistent daily practice outperforms sporadic long sessions.",
    options: ["True", "False"],
    answer: "True",
    explanation: "Consistency compounds understanding and recall.",
    difficulty: "easy",
  },
  {
    question: "Flashcard: What does MVP stand for in product building?",
    options: ["Most Valuable Process", "Minimum Viable Product", "Maximum Verified Plan", "Managed Value Pipeline"],
    answer: "Minimum Viable Product",
    explanation: "MVP is the smallest useful version to validate assumptions.",
    difficulty: "easy",
  },
  {
    question: "Short concept: Define feedback loop in one line.",
    options: [],
    answer: "A cycle where outcomes are measured and used to improve the next iteration",
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

export const getFallbackQuestions = (topic) => {
  const pack = fallbackByTopic[topic] || defaultFallback;
  return pack.map((item, index) => normalizeQuestion(item, index, topic));
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

export const fetchQuizQuestions = async (topic, difficulty = "medium") => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return getFallbackQuestions(topic);
  }

  const prompt = `Generate exactly 5 quiz questions for the topic: ${topic}. Target overall difficulty: ${difficulty}. Include these types across the set: MCQ, true/false, flashcard, short concept question. Return only JSON array. Each item must have this schema: {"question":"","options":[],"answer":"","explanation":"","difficulty":""}. For short concept question, keep options as [] and answer as a short expected response.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5 },
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini API failed with ${response.status}`);

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

    const normalized = parsed.slice(0, 5).map((item, index) => normalizeQuestion(item, index, topic));
    if (normalized.length < 5) throw new Error("Gemini returned fewer than 5 valid questions");

    return normalized;
  } catch {
    return getFallbackQuestions(topic);
  }
};
