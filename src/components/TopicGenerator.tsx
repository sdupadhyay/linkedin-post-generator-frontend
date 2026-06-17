import { useState } from 'react';
import { Lightbulb, Check, ChevronLeft, Sparkles, Compass, TrendingUp, Target, ShieldCheck, Code2, RefreshCw, Copy, CheckCheck, FileText } from 'lucide-react';
import { getSupabase } from '../utils/supabaseClient';
import type { WritingProfile } from './ProfileDashboard';

interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'High Engagement' | 'Authority' | 'Storytelling';
  icon: any;
}

interface TopicGeneratorProps {
  profile: WritingProfile;
  onBack: () => void;
}

export default function TopicGenerator({ profile, onBack }: TopicGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to reverse map frontend UI profile back to backend raw schema
  const mapProfileToDna = (p: WritingProfile) => {
    return {
      tone: { value: p.tone.value, confidence: p.tone.confidence, reasoning: p.tone.reasoning },
      hoop_type: { value: p.hoop_type.value, confidence: p.hoop_type.confidence, reasoning: p.hoop_type.reasoning },
      avg_words: { value: p.avg_words.value, confidence: p.avg_words.confidence, reasoning: p.avg_words.reasoning },
      emoji_frequency: { value: p.emoji_frequency.value, confidence: p.emoji_frequency.confidence, reasoning: p.emoji_frequency.reasoning },
      paragraph_size: { value: p.paragraph_size.value, confidence: p.paragraph_size.confidence, reasoning: p.paragraph_size.reasoning },
      writing_type: { value: p.writing_type.value, confidence: p.writing_type.confidence, reasoning: p.writing_type.reasoning },
      topic: { value: p.topic.value, confidence: p.topic.confidence, reasoning: p.topic.reasoning }
    };
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setTopics([]);
    setSelectedTopicId(null);
    setGeneratedPost(null);
    setErrorMsg(null);

    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication session has expired. Please sign in.');
      }

      const rawDnaProfile = mapProfileToDna(profile);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ dnaProfile: rawDnaProfile })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to query trending topics.');
      }

      const result = await response.json();
      
      if (!result.topics || !Array.isArray(result.topics)) {
        throw new Error('Backend topics endpoint returned an invalid payload structure.');
      }

      const mappedTopics = result.topics.map((t: any, idx: number) => {
        // Dynamically choose icon based on title matches
        let iconComp = Compass;
        const titleL = (t.topic_title || '').toLowerCase();
        if (titleL.includes('code') || titleL.includes('software') || titleL.includes('tech')) {
          iconComp = Code2;
        } else if (titleL.includes('grow') || titleL.includes('metric') || titleL.includes('scale')) {
          iconComp = TrendingUp;
        } else if (titleL.includes('hire') || titleL.includes('team') || titleL.includes('people')) {
          iconComp = Target;
        } else if (titleL.includes('vulner') || titleL.includes('launch') || titleL.includes('fail')) {
          iconComp = Lightbulb;
        } else if (titleL.includes('worth') || titleL.includes('portfolio') || titleL.includes('degree')) {
          iconComp = ShieldCheck;
        }

        return {
          id: `topic-${idx}`,
          title: t.topic_title || 'Suggested Angle',
          description: t.reasoning || 'Correlated topic angle matching your persona parameters.',
          category: t.confidence >= 0.9 ? 'Top Match' : 'Topic Suggestion',
          difficulty: idx % 3 === 0 ? 'High Engagement' : idx % 3 === 1 ? 'Authority' : 'Storytelling',
          icon: iconComp
        };
      });

      setTopics(mappedTopics);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate topics.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setGeneratedPost(null);
  };

  const handleGeneratePostDraft = async () => {
    if (!selectedTopicId) return;
    const selected = topics.find(t => t.id === selectedTopicId);
    if (!selected) return;

    setIsGeneratingPost(true);
    setGeneratedPost(null);
    setErrorMsg(null);

    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication session has expired. Please sign in.');
      }

      const rawDnaProfile = mapProfileToDna(profile);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          dnaProfile: rawDnaProfile,
          topic: {
            title: selected.title,
            reasoning: selected.description,
            isCustom: false
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate post draft.');
      }

      const result = await response.json();
      setGeneratedPost(result.post);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to draft your post.');
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedPost) return;
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-mono font-semibold text-purple-600 uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
          <span>Idea Generation Lab</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-espresso via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI-Suggested Topic Concepts
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          Generate structured post angles calibrated directly to your writing style profile. Select a topic card to initiate the generation process.
        </p>

        {errorMsg && (
          <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 max-w-md mx-auto">
            {errorMsg}
          </div>
        )}

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
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p className="text-sm text-slate-500 italic animate-pulse">
            Querying Tavily Trend API and matching with persona...
          </p>
        </div>
      )}

      {/* Grid of Topics */}
      {topics.length > 0 && !isLoading && (
        <div className="space-y-6 animate-fade-in-up">
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
                    <div className="absolute top-4 right-4 p-1 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center animate-pulse">
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
              onClick={handleGeneratePostDraft}
              disabled={!selectedTopicId || isGeneratingPost}
              className={`inline-flex items-center justify-center py-3.5 px-8 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg cursor-pointer ${
                !selectedTopicId || isGeneratingPost
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:to-purple-700 text-white shadow-purple-600/10 hover:shadow-purple-600/25 border border-purple-500/20'
              }`}
            >
              {isGeneratingPost ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              <span>Ghostwrite Post Draft</span>
            </button>
          </div>
        </div>
      )}

      {/* Generating Draft Loading State */}
      {isGeneratingPost && (
        <div className="mt-8 glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-fade-in-up border border-indigo-500/10 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-150 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Synthesizing Post Copy...</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Groq Llama 3 engine is composing your post. This will strictly respect your custom formatting, hooks, emojis, and paragraph guidelines.
          </p>
        </div>
      )}

      {/* Generated Post Output Display */}
      {generatedPost && (
        <div className="mt-8 glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up border border-indigo-500/25 shadow-md relative">
          <div className="radial-glow top-0 right-0 w-48 h-48 opacity-40 pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Generated LinkedIn Draft</h3>
                <p className="text-[10px] text-slate-500">Formulated in your custom tone</p>
              </div>
            </div>

            <button
              onClick={handleCopyToClipboard}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>

          {/* Draft text area box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 min-h-[150px] font-sans text-sm text-slate-700 leading-relaxed whitespace-pre-wrap select-text">
            {generatedPost}
          </div>
        </div>
      )}
    </div>
  );
}
