import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function AppLayout() {
  return (
    <div className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
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
      <Outlet />
    </div>
  );
}
