import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InstallPrompt from "../components/pwa/InstallPrompt";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/" && location.pathname !== "/topspeech-entry";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/select", { replace: true });
  };

  return (
    <div className="relative isolate flex min-h-screen w-full flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-8">
      <div className="absolute inset-0 -z-20 bg-hero-gradient opacity-90" />
      <motion.div
        animate={{ scale: [1, 1.04, 1], rotate: [0, 3, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute -left-20 top-16 -z-10 h-56 w-56 rounded-full bg-white/20 blur-2xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="absolute -bottom-24 -right-16 -z-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl"
      />

      <div className="relative z-10 flex w-full items-center justify-between pb-4 sm:pb-6">
        {showBackButton ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/80 px-4 py-2 text-xs font-bold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white sm:text-sm"
          >
            <span aria-hidden="true">←</span>
            Back
          </button>
        ) : (
          <span />
        )}

        <InstallPrompt variant="button" className="bg-white text-slate-900 hover:bg-slate-100" />
      </div>

      <div className="relative z-10 flex w-full flex-1 items-start justify-center sm:items-center">
        <Outlet />
      </div>
    </div>
  );
}
