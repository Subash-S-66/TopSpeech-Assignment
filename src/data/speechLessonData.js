const difficultyNotes = {
  easy: "Take your time. Accuracy over speed.",
  medium: "Steady pace with clear articulation.",
  hard: "Challenge mode: keep precision under pressure.",
};

const rWords = [
  "rain",
  "road",
  "river",
  "rocket",
  "rose",
  "rabbit",
  "ring",
  "rope",
  "rider",
  "rhyme",
  "raven",
  "robin",
  "ramp",
  "reach",
  "relay",
  "ridge",
  "ripple",
  "rust",
];

const wrongStarts = [
  "lain",
  "load",
  "liver",
  "locket",
  "lose",
  "wabbit",
  "ling",
  "lope",
  "lider",
  "lime",
  "laven",
  "lobin",
  "lamp",
  "leach",
  "lilay",
  "ledge",
  "lipple",
  "lust",
];

const listenPhrases = [
  ["rain", "road"],
  ["river", "rocket"],
  ["rose", "rabbit"],
  ["ring", "rope"],
  ["rider", "rhyme"],
  ["raven", "robin"],
  ["ramp", "reach"],
  ["relay", "ridge"],
  ["ripple", "rust"],
  ["road", "ramp"],
  ["rocket", "relay"],
  ["river", "ripple"],
];

const sentencePairs = [
  ["Rita reads red recipes", "Lita leads led lepices"],
  ["Rory rides a red rover", "Lory lides a led lover"],
  ["Rina brings ripe berries", "Lina blings lipe belries"],
  ["Rob runs around rocks", "Lob luns alound locks"],
  ["Ravi writes with rhythm", "Lavi wlites with lythm"],
  ["Rosa reached the river", "Losa leached the liver"],
  ["Rachel reviews her report", "Lachel levies her leport"],
  ["Riley rides rapidly", "Liley lides lapidly"],
  ["Rowan read the riddle", "Lowan lead the liddle"],
  ["The runner reached the ramp", "The lunner leached the lamp"],
  ["Ariel rehearses every phrase", "Aliel lehearses every flase"],
  ["The robot repaired the rover", "The lobot lepaired the lover"],
];

const postureOptions = [
  ["Relaxed jaw + slight tongue lift", "Tight jaw", "Tongue pressed flat", "Lips pushed tight"],
  ["Steady airflow + relaxed lips", "Hold breath", "Forceful jaw clench", "Tongue pulled back hard"],
  ["Gentle tongue shaping", "Rigid tongue", "Closed throat", "No breath support"],
  ["Tongue tip near alveolar ridge", "Tongue stuck low", "Jaw locked", "Cheeks puffed"],
  ["Soft voice onset", "Hard vocal attack", "Mouth closed", "Breath held"],
];

const makeMinimalPairCard = (idx, difficulty) => {
  const word = rWords[idx % rWords.length];
  const wrong = wrongStarts[idx % wrongStarts.length];
  const options = [wrong, word, `${word.slice(1)}`, `${word}e`];
  return {
    id: `pair-${idx + 1}`,
    type: "minimal-pair",
    prompt: `Choose the correct R-word for practice. ${difficultyNotes[difficulty]}`,
    question: `Target word: ${word}`,
    options,
    answer: word,
    explanation: `"${word}" begins with a clear initial R target.`,
    difficulty,
  };
};

const makeListenRepeatCard = (idx, difficulty) => {
  const [firstWord, secondWord] = listenPhrases[idx % listenPhrases.length];
  return {
    id: `listen-${idx + 1}`,
    type: "listen-repeat",
    prompt: `Listen and repeat: "${firstWord} ${secondWord}". ${difficultyNotes[difficulty]}`,
    question: "How did your attempt feel?",
    options: ["Clear and stable", "Mostly clear", "Need another try", "Skipped"],
    answer: "Clear and stable",
    explanation: "Aim for steady airflow and avoid tongue tension.",
    difficulty,
  };
};

const makeMirrorCard = (idx, difficulty) => {
  const set = postureOptions[idx % postureOptions.length];
  return {
    id: `mirror-${idx + 1}`,
    type: "mirror-cue",
    prompt: `Mirror mode: check jaw and tongue posture. ${difficultyNotes[difficulty]}`,
    question: "Which cue matches good R posture?",
    options: set,
    answer: set[0],
    explanation: "Relaxation and controlled tongue shape improve clarity.",
    difficulty,
  };
};

const makeSentenceCard = (idx, difficulty) => {
  const [correct, wrong] = sentencePairs[idx % sentencePairs.length];
  const options = [wrong, correct, "I like apples", "The sky is blue"];
  return {
    id: `sentence-${idx + 1}`,
    type: "sentence-choice",
    prompt: `Select the sentence with stronger R targets. ${difficultyNotes[difficulty]}`,
    question: "Choose one",
    options,
    answer: correct,
    explanation: "This option contains clear repeated R sounds for practice.",
    difficulty,
  };
};

export const buildSpeechLessonCards = (count = 5, difficulty = "medium") => {
  const total = Math.max(12, count);
  const cards = [];

  for (let i = 0; i < total; i += 1) {
    const typeIndex = i % 4;
    const offset = Math.floor(i / 4);
    if (typeIndex === 0) cards.push(makeListenRepeatCard(i, difficulty));
    if (typeIndex === 1) cards.push(makeMinimalPairCard(i + offset, difficulty));
    if (typeIndex === 2) cards.push(makeMirrorCard(i + offset, difficulty));
    if (typeIndex === 3) cards.push(makeSentenceCard(i + offset, difficulty));
  }

  return cards;
};
