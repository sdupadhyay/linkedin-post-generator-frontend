import { useState } from 'react';
import { Lightbulb, Check, ChevronLeft, Sparkles, AlertCircle, Compass, TrendingUp, Target, ShieldCheck, Code2, RefreshCw } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'High Engagement' | 'Authority' | 'Storytelling';
  icon: any;
}

interface TopicGeneratorProps {
  onBack: () => void;
}

const MOCK_TOPICS: Topic[] = [
  {
    id: 'topic-1',
    title: 'The Async Communication Advantage',
    description: 'Explain why writing down context beats meeting 5 times a week, detailed with practical examples from scaling remote engineering.',
    category: 'Remote Culture',
    difficulty: 'Authority',
    icon: Compass,
  },
  {
    id: 'topic-2',
    title: 'Code Readability vs Clever Code',
    description: 'Why you should write code for the next engineer instead of showing off complexity. Focuses on long-term project maintenance.',
    category: 'Software Architecture',
    difficulty: 'High Engagement',
    icon: Code2,
  },
  {
    id: 'topic-3',
    title: 'The Myth of Constant Work-Life Balance',
    description: 'Advocating for fluid work-life integration over rigid splits. Fits perfectly into the personal storytelling style of your DNA.',
    category: 'Career Growth',
    difficulty: 'Storytelling',
    icon: TrendingUp,
  },
  {
    id: 'topic-4',
    title: 'Hiring for Outcomes, Not Presence',
    description: 'A critical analysis of modern trust-first management frameworks vs. clock-watching culture in tech departments.',
    category: 'Tech Leadership',
    difficulty: 'Authority',
    icon: Target,
  },
  {
    id: 'topic-5',
    title: 'Why Portfolio Beats Degree in 2026',
    description: 'Deep dive into hiring experiences showing that tangible proof-of-work dominates resumes for modern engineering tasks.',
    category: 'Tech Careers',
    difficulty: 'High Engagement',
    icon: ShieldCheck,
  },
  {
    id: 'topic-6',
    title: 'Late Nights and Early Launches',
    description: 'A vulnerable founder-story outline about pushing products through stealth mode and managing launch day anxiety.',
    category: 'Entrepreneurship',
    difficulty: 'Storytelling',
    icon: Lightbulb,
  },
];

export default function TopicGenerator({ onBack }: TopicGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsLoading(true);
    setTopics([]);
    setSelectedTopicId(null);
    setAlertMsg(null);

    // Simulate API fetch delay
    setTimeout(() => {
      setTopics(MOCK_TOPICS);
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setAlertMsg(null);
  };

  const handleProceed = () => {
    if (!selectedTopicId) return;
    const selected = topics.find(t => t.id === selectedTopicId);
    if (selected) {
      setAlertMsg(`🎉 You selected "${selected.title}"! \n\nIn the next phase of development, this topic will trigger the Post Editor, generating a complete draft following your custom AI Writing DNA.`);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8 z-10 animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 mb-6 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Back to Writing Profile</span>
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-mono font-semibold text-purple-600 uppercase tracking-wider mb-3 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
          <span>Idea Generation Lab</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-espresso via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI-Suggested Topic Concepts
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          Generate structured post angles calibrated directly to your writing style profile. Select a topic card to initiate the generation process.
        </p>

        {topics.length === 0 && !isLoading && (
          <button
            onClick={handleGenerate}
            className="mt-8 inline-flex items-center justify-center py-3.5 px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 border border-indigo-400/10 cursor-pointer"
          >
            <span>Generate Suggested Topics</span>
          </button>
        )}
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-500 italic animate-pulse">
            Querying LLM engine for persona-specific angles...
          </p>
        </div>
      )}

      {/* Grid of Topics */}
      {topics.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topics.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              const IconComp = topic.icon;

              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic.id)}
                  className={`glass-card rounded-2xl p-5 cursor-pointer relative overflow-hidden transition-all duration-300 select-none ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-md scale-[1.01]'
                      : 'hover:scale-[1.01]'
                  }`}
                >
                  {/* Select indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 p-1 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div className="flex items-start gap-4 pr-6">
                    <div className={`p-3 rounded-xl border ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded uppercase">
                          {topic.category}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                          topic.difficulty === 'Storytelling'
                            ? 'text-yellow-700 bg-yellow-50 border border-yellow-200'
                            : topic.difficulty === 'Authority'
                            ? 'text-purple-700 bg-purple-50 border border-purple-200'
                            : 'text-cyan-700 bg-cyan-50 border border-cyan-200'
                        }`}>
                          {topic.difficulty}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-800 pr-2">
                        {topic.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-8">
            <button
              onClick={handleGenerate}
              className="inline-flex items-center justify-center py-2 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-medium text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2 text-indigo-500" />
              <span>Regenerate Suggestions</span>
            </button>

            <button
              onClick={handleProceed}
              disabled={!selectedTopicId}
              className={`inline-flex items-center justify-center py-3.5 px-8 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg cursor-pointer ${
                !selectedTopicId
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:to-purple-700 text-white shadow-purple-600/10 hover:shadow-purple-600/25 border border-purple-500/20'
              }`}
            >
              <span>Proceed to Post Draft Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Alert Modal */}
      {alertMsg && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 md:p-8 max-w-md w-full animate-fade-in-up border border-indigo-500/20 shadow-lg relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Next Steps</h3>
                <p className="text-xs text-slate-500 mt-0.5">Development Roadmap</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {alertMsg}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setAlertMsg(null)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
