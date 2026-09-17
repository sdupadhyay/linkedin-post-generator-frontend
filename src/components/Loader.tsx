import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 100 steps * 80ms = 8,000ms (8 seconds) to match the 6-9 sec API time
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // When the visual loading bar completes (100%), start polling the parent
    // to see if the actual API request has finished.
    if (progress === 100) {
      const interval = setInterval(() => {
        onComplete();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [progress, onComplete]);

  const steps = [
    {
      text: "Reading your writing style...",
      state: progress <= 33 ? "active" : "done",
    },
    {
      text: "Detecting storytelling patterns...",
      state: progress < 34 ? "pending" : progress <= 66 ? "active" : "done",
    },
    {
      text: "Extracting tone of voice...",
      state: progress < 67 ? "pending" : "active",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#fafcfb] flex flex-col justify-center overflow-hidden">
      {/* Subtle Dotted Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-70" />

      {/* Center Content */}
      <div className="relative z-10 max-w-[600px] mx-auto w-full px-6 flex flex-col items-center animate-fade-in-up">
        <h1 className="text-[32px] md:text-[38px] font-extrabold tracking-tight text-[#0f172a] mb-3 text-center">
          Decoding Your Writing DNA
        </h1>
        <p className="text-[14px] text-slate-500 font-medium text-center max-w-[420px] mb-12">
          We're learning how you naturally tell stories to mirror your unique
          voice with precision.
        </p>

        {/* Steps List */}
        <div className="w-full max-w-[440px] flex flex-col">
          {steps.map((step, idx) => {
            const isDone = step.state === "done";
            const isActive = step.state === "active";

            return (
              <div
                key={idx}
                className="flex items-center gap-4 py-4 border-b border-slate-200/60 last:border-0 transition-all duration-300"
              >
                <CheckCircle2
                  className={`w-[20px] h-[20px] transition-all duration-300 ${
                    isDone
                      ? "text-[#00bb7f]"
                      : isActive
                        ? "text-[#00bb7f] scale-110 drop-shadow-[0_0_8px_rgba(0,187,127,0.5)]"
                        : "text-slate-300"
                  }`}
                />

                {/* Text Styling with Shimmer for Active State */}
                <span
                  className={`text-[15.5px] font-bold transition-all duration-300 ${
                    isDone
                      ? "text-[#00bb7f]"
                      : isActive
                        ? "bg-gradient-to-r from-[#00bb7f] via-[#33e8a5] to-[#00bb7f] bg-[length:200%_auto] text-transparent bg-clip-text animate-shimmer"
                        : "text-[#0f172a]"
                  }`}
                >
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
