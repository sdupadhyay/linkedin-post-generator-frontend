import React, { useState } from "react";
import {
  Plus,
  Settings2,
  FileText,
  ArrowRight,
  Wand2,
  CheckCircle2,
} from "lucide-react";

interface OnboardingProps {
  onSubmitPosts: (posts: string[]) => void;
}

const SAMPLE_POSTS = [
  "🚀 Just launched our new AI-powered platform! We spent 6 months building in stealth, and today we are opening the beta. It has been a wild ride of late nights, endless code reviews, and constant iterations. But seeing our first beta users get value makes it all worth it. If you're looking to streamline your content creation, drop a comment below and I'll send you an invite link! #AI #Launch #FounderLife",
  "How do you build a high-performing remote team? After 3 years of scaling a fully remote engineering department, here are my top 3 takeaways:\n\n1. Documentation over meetings: If it's not written down, it doesn't exist. This enables asynchronous work across timezones.\n2. Over-communicate context: Always explain the 'why' behind decisions, not just the 'what'.\n3. Establish trust by default: Track outcomes and deliverables, not active Slack status.\n\nWhat would you add to this list? Let me know! 👇",
  "Is college still worth it for software engineers? 🎓\n\nI get asked this at least once a week. Here's my honest perspective after hiring over 50 developers:\n\n- Degrees prove you can finish a long-term goal. That's valuable.\n- Portfolios prove you can build software. That's essential.\n- Open-source contributions prove you can collaborate. That's a superpower.\n\nIf you have a degree but no portfolio, you will struggle. If you have no degree but a stellar portfolio, you will get hired. The industry has changed, focus on proof of skill.",
  "Stop optimizing for lines of code. Optimize for readability.\n\nClean code is not code that is clever. Clean code is code that your team can read, understand, and debug 6 months from now without having to ping you on Slack.\n\nWrite code like the next engineer is a serial killer who knows where you live. Keep it simple, leave comments on the 'why', and avoid over-engineering. Your future self will thank you.",
  "Work-life balance is a myth. What we should really optimize for is integration.\n\nSome weeks require 60 hours of deep focus on a launch. Other weeks require taking three afternoons off to spend with family. Instead of aiming for a rigid 50/50 split every day, look at your energy levels and project cycles. Burnout doesn't come from hard work; it comes from working on things that don't align with your values. Make time for what matters.",
];

export default function Onboarding({ onSubmitPosts }: OnboardingProps) {
  const [posts, setPosts] = useState<string[]>(["", "", "", "", ""]);
  const MIN_CHAR_COUNT = 50;

  const handleTextChange = (index: number, val: string) => {
    const nextPosts = [...posts];
    nextPosts[index] = val;
    setPosts(nextPosts);
  };

  const handleAddPost = () => {
    setPosts([...posts, ""]);
  };

  const handleLoadSamples = () => {
    setPosts([...SAMPLE_POSTS]);
  };

  const validPostsCount = posts.filter(
    (p) => p.trim().length >= MIN_CHAR_COUNT,
  ).length;
  const isSubmitDisabled = validPostsCount < 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    const completedPosts = posts.filter(
      (p) => p.trim().length >= MIN_CHAR_COUNT,
    );
    onSubmitPosts(completedPosts);
  };

  return (
    <div className="w-full min-h-screen bg-[#fafcfb] flex flex-col items-center pt-16 pb-24 px-4">
      {/* Headings */}
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#0f172a] mb-3">
          Train Your AI Writing DNA
        </h1>
        <p className="text-[15px] text-slate-500 font-medium max-w-xl mx-auto">
          Provide 5 previous posts so we can learn your unique voice, tone, and
          rhythm.
        </p>

        <button
          onClick={handleLoadSamples}
          type="button"
          className="mt-6 inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold bg-[#00bb7f]/10 hover:bg-[#00bb7f]/15 text-[#007956] border border-[#00bb7f]/20 transition-all duration-200 cursor-pointer uppercase tracking-wider"
        >
          <Wand2 className="w-3.5 h-3.5 mr-1.5" />
          <span>Load Sample Posts (For Fast Testing)</span>
        </button>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[800px] space-y-5 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        {posts.map((postContent, idx) => {
          const charCount = postContent.length;
          const isValid = charCount >= MIN_CHAR_COUNT;
          const isTooShort = charCount > 0 && charCount < MIN_CHAR_COUNT;

          return (
            <div
              key={idx}
              className={`bg-white border ${isValid ? "border-[#00bb7f]/50" : "border-slate-200"} rounded-[14px] p-5 shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              {/* Inner Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-extrabold uppercase tracking-widest">
                  <FileText
                    className={`w-4 h-4 ${isValid ? "text-[#00bb7f]" : "text-slate-400"}`}
                  />
                  <span>LinkedIn Post #{idx + 1}</span>
                  {isValid && (
                    <CheckCircle2 className="w-4 h-4 text-[#00bb7f] ml-1" />
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isTooShort && (
                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold uppercase">
                      Need {MIN_CHAR_COUNT - charCount} more chars
                    </span>
                  )}
                  <span
                    className={`text-[9px] font-bold px-2 py-1 rounded tracking-widest uppercase ${isValid ? "bg-[#00bb7f] text-white" : "text-[#00bb7f] bg-[#00bb7f]/10"}`}
                  >
                    {isValid ? "Ready" : "Required"}
                  </span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={postContent}
                onChange={(e) => handleTextChange(idx, e.target.value)}
                placeholder="Paste your post here..."
                className="w-full min-h-[120px] text-[15px] text-slate-700 placeholder-slate-400 bg-transparent border-none focus:outline-none focus:ring-0 resize-y leading-relaxed"
              />

              <div className="flex justify-end mt-1">
                <span
                  className={`text-[10px] font-mono ${isValid ? "text-[#00bb7f]" : "text-slate-400"}`}
                >
                  {charCount} characters
                </span>
              </div>
            </div>
          );
        })}

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-8 pt-8">
          <button
            type="button"
            onClick={handleAddPost}
            className="inline-flex items-center justify-center py-2.5 px-6 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs tracking-wide transition-all cursor-pointer shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4 mr-2 text-[#00bb7f]" />
            Add Another Post
          </button>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`inline-flex items-center justify-center py-4 px-10 rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer ${
              isSubmitDisabled
                ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                : "bg-[#00bb7f] hover:bg-[#007956] text-white shadow-[0_8px_20px_rgba(0,187,127,0.3)] hover:shadow-[0_10px_25px_rgba(0,121,86,0.35)] hover:-translate-y-0.5"
            }`}
          >
            <Settings2 className="w-4 h-4 mr-2" />
            <span>Analyze My Writing Style</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}
