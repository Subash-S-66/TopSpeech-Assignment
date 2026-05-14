import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TopSpeechSplash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/topspeech/preferences", { replace: true });
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section className="flex w-full max-w-md flex-col items-center text-center text-white">
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur"
      >
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-4xl font-black tracking-tight"
        >
          TS
        </motion.span>
      </motion.div>

      <h1 className="text-4xl font-extrabold tracking-tight">TopSpeech</h1>
      <p className="mt-4 text-sm text-white/90 sm:text-base">Preparing your daily speech therapy session</p>

      <div className="mt-8 flex items-center gap-3" aria-label="Loading">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1, delay: dot * 0.15 }}
            className="h-3 w-3 rounded-full bg-white"
          />
        ))}
      </div>
    </section>
  );
}
