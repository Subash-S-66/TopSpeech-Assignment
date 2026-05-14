import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppLayout from "./layouts/AppLayout";
import ModeSelect from "./pages/ModeSelect";
import SplashScreen from "./pages/SplashScreen";
import TopicStep from "./pages/onboarding/TopicStep";
import TimeStep from "./pages/onboarding/TimeStep";
import GoalStep from "./pages/onboarding/GoalStep";
import Dashboard from "./pages/Dashboard";
import LessonComplete from "./pages/LessonComplete";
import QuizPage from "./pages/quiz/QuizPage";
import TopSpeechHome from "./pages/topspeech/TopSpeechHome";
import TopSpeechLesson from "./pages/topspeech/TopSpeechLesson";
import TopSpeechComplete from "./pages/topspeech/TopSpeechComplete";
import TopSpeechSplash from "./pages/topspeech/TopSpeechSplash";
import TopSpeechPreferences from "./pages/topspeech/TopSpeechPreferences";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/select" element={<ModeSelect />} />
          <Route path="/levelup" element={<Dashboard />} />
          <Route path="/onboarding/topic" element={<TopicStep />} />
          <Route path="/onboarding/time" element={<TimeStep />} />
          <Route path="/onboarding/goal" element={<GoalStep />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/lesson-complete" element={<LessonComplete />} />
          <Route path="/topspeech-entry" element={<TopSpeechSplash />} />
          <Route path="/topspeech/preferences" element={<TopSpeechPreferences />} />
          <Route path="/topspeech" element={<TopSpeechHome />} />
          <Route path="/topspeech/lesson" element={<TopSpeechLesson />} />
          <Route path="/topspeech/complete" element={<TopSpeechComplete />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
