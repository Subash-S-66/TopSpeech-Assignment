import { useEffect, useState } from "react";

export default function InstallPrompt({ variant = "card", className = "" }) {
  const [promptEvent, setPromptEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setPromptEvent(event);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    setVisible(false);
    setPromptEvent(null);
  };

  if (!visible) return null;

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={install}
        className={[
          "rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:text-sm",
          className,
        ].join(" ")}
      >
        Install app
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-xl sm:bottom-5">
      <p className="text-sm font-semibold text-slate-900">Install LevelUp for faster daily learning.</p>
      <button
        type="button"
        onClick={install}
        className="mt-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
      >
        Install app
      </button>
    </div>
  );
}
