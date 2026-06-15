import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, ChevronRight, FileText, Wand2 } from 'lucide-react';

interface OnboardingProps {
  onSubmitPosts: (posts: string[]) => void;
}

const SAMPLE_POSTS = [
  "🚀 Just launched our new AI-powered platform! We spent 6 months building in stealth, and today we are opening the beta. It has been a wild ride of late nights, endless code reviews, and constant iterations. But seeing our first beta users get value makes it all worth it. If you're looking to streamline your content creation, drop a comment below and I'll send you an invite link! #AI #Launch #FounderLife",
  "How do you build a high-performing remote team? After 3 years of scaling a fully remote engineering department, here are my top 3 takeaways:\n\n1. Documentation over meetings: If it's not written down, it doesn't exist. This enables asynchronous work across timezones.\n2. Over-communicate context: Always explain the 'why' behind decisions, not just the 'what'.\n3. Establish trust by default: Track outcomes and deliverables, not active Slack status.\n\nWhat would you add to this list? Let me know! 👇",
  "Is college still worth it for software engineers? 🎓\n\nI get asked this at least once a week. Here's my honest perspective after hiring over 50 developers:\n\n- Degrees prove you can finish a long-term goal. That's valuable.\n- Portfolios prove you can build software. That's essential.\n- Open-source contributions prove you can collaborate. That's a superpower.\n\nIf you have a degree but no portfolio, you will struggle. If you have no degree but a stellar portfolio, you will get hired. The industry has changed, focus on proof of skill.",
  "Stop optimizing for lines of code. Optimize for readability.\n\nClean code is not code that is clever. Clean code is code that your team can read, understand, and debug 6 months from now without having to ping you on Slack.\n\nWrite code like the next engineer is a serial killer who knows where you live. Keep it simple, leave comments on the 'why', and avoid over-engineering. Your future self will thank you.",
  "Work-life balance is a myth. What we should really optimize for is integration.\n\nSome weeks require 60 hours of deep focus on a launch. Other weeks require taking three afternoons off to spend with family. Instead of aiming for a rigid 50/50 split every day, look at your energy levels and project cycles. Burnout doesn't come from hard work; it comes from working on things that don't align with your values. Make time for what matters."
];

export default function Onboarding({ onSubmitPosts }: OnboardingProps) {
  // Initialize with 5 empty posts
  const [posts, setPosts] = useState<string[]>(['', '', '', '', '']);
  const MIN_CHAR_COUNT = 50;

  const handleTextChange = (index: number, val: string) => {
    const nextPosts = [...posts];
    nextPosts[index] = val;
    setPosts(nextPosts);
  };

  const handleAddPost = () => {
    setPosts([...posts, '']);
  };

  const handleRemovePost = (index: number) => {
    // Only allow removal if we have more than 5 posts
    if (posts.length <= 5) return;
    const nextPosts = posts.filter((_, idx) => idx !== index);
    setPosts(nextPosts);
  };

  const handleLoadSamples = () => {
    setPosts([...SAMPLE_POSTS]);
  };

  // Check how many posts are valid (length >= MIN_CHAR_COUNT)
  const validPostsCount = posts.filter(p => p.trim().length >= MIN_CHAR_COUNT).length;
  const isSubmitDisabled = validPostsCount < 5;
  const progressPercent = Math.min((validPostsCount / 5) * 100, 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    // Filter out empty or too short posts just in case, but keep those that passed validation
    const completedPosts = posts.filter(p => p.trim().length >= MIN_CHAR_COUNT);
    onSubmitPosts(completedPosts);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 z-10 animate-fade-in-up">
      {/* Headings */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-espresso via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Train Your AI Writing Persona
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          Upload at least 5 of your past LinkedIn posts. The AI will analyze your structure, hook strategy, tone, formatting, and CTAs to map your unique writing DNA.
        </p>

        <button
          onClick={handleLoadSamples}
          type="button"
          className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 transition-all duration-200 cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
          <span>Load 5 High-Quality Sample Posts (For Fast Testing)</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="glass-card rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Profile Training Progress</h3>
            <p className="text-xs text-slate-500">
              {validPostsCount} of 5 required posts completed ({Math.round(progressPercent)}%)
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300/10">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {posts.map((postContent, idx) => {
            const charCount = postContent.length;
            const isValid = charCount >= MIN_CHAR_COUNT;
            const isTooShort = charCount > 0 && charCount < MIN_CHAR_COUNT;

            return (
              <div key={idx} className="glass-card rounded-2xl p-5 relative group transition-all duration-200">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-500/5 px-2 py-0.5 rounded-md border border-indigo-500/10">
                      Post #{idx + 1}
                    </span>
                    {isValid && (
                      <span className="inline-flex items-center text-xs text-emerald-600 bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/15 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Ready for analysis
                      </span>
                    )}
                    {isTooShort && (
                      <span className="text-xs text-amber-600 bg-amber-500/5 px-2.5 py-0.5 rounded-full border border-amber-500/15 font-medium">
                        Need {MIN_CHAR_COUNT - charCount} more characters
                      </span>
                    )}
                    {charCount === 0 && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 font-medium">
                        Empty
                      </span>
                    )}
                  </div>

                  {posts.length > 5 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePost(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-rose-500/5 transition-all cursor-pointer"
                      title="Delete this input card"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>

                <textarea
                  value={postContent}
                  onChange={(e) => handleTextChange(idx, e.target.value)}
                  placeholder="Paste or type a previous LinkedIn post here... e.g. 'Today, I want to talk about engineering productivity...'"
                  className="glass-input w-full min-h-[120px] max-h-[300px] p-3.5 rounded-xl text-sm placeholder-slate-400 focus:outline-none resize-y"
                />

                <div className="flex justify-end mt-2">
                  <span className={`text-[10px] font-mono ${isValid ? 'text-slate-500' : 'text-slate-400'}`}>
                    {charCount} characters
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleAddPost}
            className="inline-flex items-center justify-center py-3 px-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-sm transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2 text-indigo-500" />
            <span>Add Another Post</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`inline-flex items-center justify-center py-3.5 px-8 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg cursor-pointer ${
              isSubmitDisabled
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-purple-600/10 hover:shadow-purple-600/20 border border-purple-500/20'
            }`}
          >
            <span>Analyze Writing Style</span>
            <ChevronRight className="w-4.5 h-4.5 ml-1.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
