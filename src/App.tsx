import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Loader from './components/Loader';
import ProfileDashboard from './components/ProfileDashboard';
import type { WritingProfile } from './components/ProfileDashboard';
import TopicGenerator from './components/TopicGenerator';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

type ScreenView = 'AUTH' | 'ONBOARDING' | 'LOADING' | 'DASHBOARD' | 'TOPIC_GENERATION';

export default function App() {
  const [view, setView] = useState<ScreenView>('AUTH');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<WritingProfile | null>(null);
  const [temporaryPosts, setTemporaryPosts] = useState<string[]>([]);

  // Check login and profile presence in localStorage on startup
  useEffect(() => {
    const savedEmail = localStorage.getItem('lpg_user_email');
    if (savedEmail) {
      setUserEmail(savedEmail);
      const savedProfile = localStorage.getItem(`lpg_profile_${savedEmail}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
        setView('DASHBOARD');
      } else {
        setView('ONBOARDING');
      }
    } else {
      setView('AUTH');
    }
  }, []);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('lpg_user_email', email);
    
    // Check if this specific email already has a profile in localStorage
    const savedProfile = localStorage.getItem(`lpg_profile_${email}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setView('DASHBOARD');
    } else {
      setView('ONBOARDING');
    }
  };

  const handleOnboardingSubmit = (posts: string[]) => {
    setTemporaryPosts(posts);
    setView('LOADING');
  };

  const handleLoaderComplete = () => {
    if (!userEmail) return;

    // Dynamically generate the profile DNA based on post input keywords!
    const combinedText = temporaryPosts.join(' ').toLowerCase();
    
    let personaName = 'The Professional Storyteller';
    let personaDescription = 'You excel at transforming everyday professional occurrences into highly relatable, lesson-driven stories. Your writing bridges the gap between raw business outcomes and human-centric experiences, creating an inviting, conversational feed presence.';
    let tone = ['Professional', 'Friendly', 'Inspirational'];
    let hookStyle = 'Question-Based';
    let hookExample = 'Is it possible to scale a business without losing your mind?';
    let avgLength = 220;
    let emojiUsage = 'Moderate';
    let emojiPercent = 35;
    let ctaStyle = ['Engagement Question', 'Value Pitch'];
    let sentenceStructure = 'Conversational & Balanced';
    let storytellingPattern = 'Before-After-Bridge';
    let vocabularyComplexity = 'Conversational & Direct';
    let formattingStyle = 'Single sentence spacing with key bulleted details';

    // Heuristics for dynamic customization
    if (
      combinedText.includes('code') || 
      combinedText.includes('engineer') || 
      combinedText.includes('software') || 
      combinedText.includes('developer') ||
      combinedText.includes('technical')
    ) {
      personaName = 'The Technical Educator';
      personaDescription = 'You specialize in translating complex technical paradigms, engineering decisions, and architecture trade-offs into clear, educational insights. You structure your ideas logically, utilizing clean formatting and code analogies that resonate with both engineers and executives.';
      tone = ['Educational', 'Analytical', 'Professional'];
      hookStyle = 'Statement-Based';
      hookExample = 'Stop optimizing for lines of code. Optimize for readability.';
      avgLength = 180;
      emojiUsage = 'Low';
      emojiPercent = 15;
      ctaStyle = ['Engagement Question', 'Resource Offer'];
      sentenceStructure = 'Short & Punchy';
      storytellingPattern = 'Hook-Value-CTA Grid';
      vocabularyComplexity = 'Technical & Analytical';
      formattingStyle = 'Code-block styled spacing with technical summaries';
    } else if (
      combinedText.includes('founder') || 
      combinedText.includes('launch') || 
      combinedText.includes('stealth') || 
      combinedText.includes('business') || 
      combinedText.includes('product') ||
      combinedText.includes('startup')
    ) {
      personaName = 'The Growth Architect';
      personaDescription = 'Your writing radiates the fast-paced, high-stakes energy of building products and companies from scratch. You share raw startup metrics, lessons from failure, and strategic growth loops, positioning yourself as an authoritative builder in the SaaS space.';
      tone = ['Bold', 'Inspirational', 'Professional'];
      hookStyle = 'Story-Driven';
      hookExample = 'We spent 6 months building in stealth, and today we open the beta.';
      avgLength = 250;
      emojiUsage = 'Moderate';
      emojiPercent = 40;
      ctaStyle = ['Direct Link', 'Value Pitch'];
      sentenceStructure = 'Conversational & Fast-paced';
      storytellingPattern = "Hero's Journey (Short)";
      vocabularyComplexity = 'Conversational & Direct';
      formattingStyle = 'Spacious paragraphs with bold punchlines';
    } else if (
      combinedText.includes('remote') || 
      combinedText.includes('hiring') || 
      combinedText.includes('team') || 
      combinedText.includes('culture') || 
      combinedText.includes('people') ||
      combinedText.includes('manager')
    ) {
      personaName = 'The People & Operations Leader';
      personaDescription = 'You write extensively about remote culture, asynchronous workflows, and building high-trust distributed teams. Your posts combine operational step-by-step guides with human-centric observations, aiming to revolutionize the modern corporate workspace.';
      tone = ['Friendly', 'Educational', 'Inspirational'];
      hookStyle = 'Question-Based';
      hookExample = 'How do you build a high-performing remote team?';
      avgLength = 210;
      emojiUsage = 'Moderate';
      emojiPercent = 30;
      ctaStyle = ['Engagement Question', 'Interactive Poll'];
      sentenceStructure = 'Structured & Conversational';
      storytellingPattern = 'Before-After-Bridge';
      vocabularyComplexity = 'Conversational & Direct';
      formattingStyle = 'Bulleted layout checklists for operational readability';
    }

    const calculatedProfile: WritingProfile = {
      personaName,
      personaDescription,
      tone,
      hookStyle,
      hookExample,
      avgLength,
      emojiUsage,
      emojiPercent,
      ctaStyle,
      sentenceStructure,
      storytellingPattern,
      vocabularyComplexity,
      formattingStyle,
    };

    setProfile(calculatedProfile);
    localStorage.setItem(`lpg_profile_${userEmail}`, JSON.stringify(calculatedProfile));
    setView('DASHBOARD');
  };

  const handleUpdateProfile = (updated: WritingProfile) => {
    if (!userEmail) return;
    setProfile(updated);
    localStorage.setItem(`lpg_profile_${userEmail}`, JSON.stringify(updated));
  };

  const handleResetProfile = () => {
    if (!userEmail) return;
    if (confirm('Are you sure you want to recalibrate? This will clear your current profile and let you upload new posts.')) {
      setProfile(null);
      localStorage.removeItem(`lpg_profile_${userEmail}`);
      setView('ONBOARDING');
    }
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem('lpg_user_email');
    setView('AUTH');
  };

  return (
    <div className="min-h-screen bg-warm-bg relative flex flex-col justify-between">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/2 to-transparent pointer-events-none z-0" />

      {/* Main Navbar */}
      <header className="relative z-20 border-b border-warm-border bg-warm-card/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
              <LinkedinIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-brand-espresso flex items-center gap-1.5">
              LinkedIn DNA Generator
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
                v1.0-beta
              </span>
            </span>
          </div>

          {userEmail && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-mono">LOGGED IN AS</span>
                <span className="text-xs font-semibold text-brand-espresso">{userEmail}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-warm-border flex items-center justify-center font-bold text-xs text-white uppercase shadow-md shadow-indigo-600/10">
                {userEmail.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* View Orchestrator */}
      <main className="flex-grow flex flex-col justify-center py-6 relative z-10">
        {view === 'AUTH' && <Auth onLoginSuccess={handleLoginSuccess} />}
        {view === 'ONBOARDING' && <Onboarding onSubmitPosts={handleOnboardingSubmit} />}
        {view === 'LOADING' && <Loader onComplete={handleLoaderComplete} />}
        {view === 'DASHBOARD' && profile && (
          <ProfileDashboard
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onReset={handleResetProfile}
            onLogout={handleLogout}
            onProceedToTopics={() => setView('TOPIC_GENERATION')}
          />
        )}
        {view === 'TOPIC_GENERATION' && (
          <TopicGenerator onBack={() => setView('DASHBOARD')} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-warm-border py-4 text-center text-[10px] text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 AI LinkedIn Post Generator. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Powered by Gemini <Sparkles className="w-3 h-3 text-indigo-400" />
          </span>
        </div>
      </footer>
    </div>
  );
}
