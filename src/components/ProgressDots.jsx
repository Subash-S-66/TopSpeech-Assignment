export default function ProgressDots({ step, total }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2" aria-label="Progress">
      {Array.from({ length: total }).map((_, idx) => {
        const active = idx + 1 === step;
        return (
          <div
            key={idx}
            className={[
              "h-2 rounded-full transition-all duration-300",
              active ? "w-8 bg-brand-600" : "w-2 bg-slate-300",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
