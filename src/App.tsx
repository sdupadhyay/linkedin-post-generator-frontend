import { useState, useEffect } from 'react';
import { Sparkles, LogOut } from 'lucide-react';
import { initSupabase, getSupabase } from './utils/supabaseClient';
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
  
  // API loading synchronizations
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [apiState, setApiState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [temporaryProfile, setTemporaryProfile] = useState<WritingProfile | null>(null);

  // Initialize Supabase configuration on start
  useEffect(() => {
    async function setup() {
      try {
        await initSupabase();
        const supabase = getSupabase();
        
        // Restore existing user session if available
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserEmail(session.user.email ?? null);
          await fetchUserProfile(session.user.id);
        } else {
          setView('AUTH');
        }

        // Set up auth state change listener
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session) {
            setUserEmail(session.user.email ?? null);
            await fetchUserProfile(session.user.id);
          } else {
            setUserEmail(null);
            setProfile(null);
            setView('AUTH');
          }
        });
      } catch (err: any) {
        console.error('Supabase Setup Failure:', err);
        setInitError(err.message || 'Failed to establish connection to configuration server.');
      } finally {
        setIsInitializing(false);
      }
    }
    setup();
  }, []);

  // Fetch writing DNA profile directly from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('user_dna')
        .select('dna_profile')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Failed to query user profile:', error);
      }

      if (data?.dna_profile) {
        const mapped = mapDnaToProfile(data.dna_profile);
        setProfile(mapped);
        setView('DASHBOARD');
      } else {
        setView('ONBOARDING');
      }
    } catch (err) {
      console.error('Profile query failed:', err);
      setView('ONBOARDING');
    }
  };

  // Maps backend raw schema to frontend's high-fidelity WritingProfile interface
  const mapDnaToProfile = (res: any): WritingProfile => {
    if (res && res.tone && typeof res.tone === 'object' && 'value' in res.tone && res.personaName) {
      return res as WritingProfile; // Already mapped
    }

    const tone = {
      value: res.tone?.value || 'conversational',
      reasoning: res.tone?.reasoning || 'The tone is conversational, friendly, and engaging.',
      confidence: res.tone?.confidence ?? 0.8
    };

    const topic = {
      value: Array.isArray(res.topic?.value) ? res.topic.value : ['technology', 'programming', 'web development', 'AI'],
      reasoning: res.topic?.reasoning || 'Main topics covered are technology, programming, and AI.',
      confidence: res.topic?.confidence ?? 0.9
    };

    const avg_words = {
      value: typeof res.avg_words?.value === 'number' ? res.avg_words.value : Number(res.avg_words?.value) || 250,
      reasoning: res.avg_words?.reasoning || 'Average word count is around 250.',
      confidence: res.avg_words?.confidence ?? 0.9
    };

    const hoop_type = {
      value: res.hoop_type?.value || 'exciting introduction',
      reasoning: res.hoop_type?.reasoning || 'Uses direct hook points to optimize impressions.',
      confidence: res.hoop_type?.confidence ?? 0.7
    };

    const writing_type = {
      value: res.writing_type?.value || 'informative',
      reasoning: res.writing_type?.reasoning || 'The overall writing paradigm is informative and educational.',
      confidence: res.writing_type?.confidence ?? 0.8
    };

    const paragraph_size = {
      value: res.paragraph_size?.value || 'short',
      reasoning: res.paragraph_size?.reasoning || 'Uses short, clean paragraphs for readability.',
      confidence: res.paragraph_size?.confidence ?? 0.8
    };

    const emoji_frequency = {
      value: res.emoji_frequency?.value || 'high',
      reasoning: res.emoji_frequency?.reasoning || 'Emojis are used to enhance readability and personality.',
      confidence: res.emoji_frequency?.confidence ?? 0.8
    };

    // Compute fresh persona name based on fields
    const wType = (writing_type.value || '').toLowerCase();
    const toneVal = (tone.value || '').toLowerCase();
    let personaName = 'The Technical Storyteller';
    if (wType.includes('inform') || wType.includes('educat')) {
      personaName = 'The Authority Educator';
    } else if (toneVal.includes('bold') || toneVal.includes('assert')) {
      personaName = 'The Bold Thought Leader';
    } else if (toneVal.includes('convers') || toneVal.includes('friend')) {
      personaName = 'The Conversational Networker';
    }

    return {
      tone,
      topic,
      avg_words,
      hoop_type,
      writing_type,
      paragraph_size,
      emoji_frequency,
      personaName,
      personaDescription: writing_type.reasoning
    };
  };

  // Submits the onboarding posts list to backend /api/analyze endpoint
  const handleOnboardingSubmit = async (posts: string[]) => {
    setView('LOADING');
    setApiState('pending');
    setTemporaryProfile(null);

    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication session has expired. Please log in again.');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ posts })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Backend analysis engine encountered an error.');
      }

      const dnaProfileRaw = await response.json();
      const mappedProfile = mapDnaToProfile(dnaProfileRaw);
      
      setTemporaryProfile(mappedProfile);
      setApiState('success');
    } catch (err: any) {
      console.error('Analysis error:', err);
      alert(err.message || 'Failed to extract writing style profile.');
      setApiState('error');
      setView('ONBOARDING');
    }
  };

  // Called when the loader UI reaches 100% completion
  const handleLoaderComplete = () => {
    if (apiState === 'success' && temporaryProfile) {
      setProfile(temporaryProfile);
      setView('DASHBOARD');
      setApiState('idle');
      setTemporaryProfile(null);
    } else if (apiState === 'error') {
      setView('ONBOARDING');
      setApiState('idle');
    } else {
      // API call still in progress, loader will wait at 99%
      console.log('Loader completed but API is still pending. Holding view.');
    }
  };

  // Watch API success to auto-finish loader if it was waiting at 99%
  useEffect(() => {
    if (view === 'LOADING' && apiState === 'success' && temporaryProfile) {
      // Transition if the loader was already complete and waiting
      // We check if progress is done. App will transition via callback or directly.
    }
  }, [apiState, view, temporaryProfile]);

  const handleUpdateProfile = async (updated: WritingProfile) => {
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfile(updated);
      
      // Strip computed properties before database sync
      const { personaName, personaDescription, ...dnaProfileData } = updated;
      
      // Update database profile
      const { error } = await supabase
        .from('user_dna')
        .update({
          dna_profile: dnaProfileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to sync profile update with database:', error);
      }
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  const handleResetProfile = async () => {
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (confirm('Are you sure you want to recalibrate? This will clear your current profile and let you upload new posts.')) {
        setProfile(null);
        setView('ONBOARDING');

        const { error } = await supabase
          .from('user_dna')
          .delete()
          .eq('user_id', user.id);

        if (error) {
          console.error('Failed to clear DNA profile from database:', error);
        }
      }
    } catch (err) {
      console.error('Profile reset failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUserEmail(null);
      setProfile(null);
      setView('AUTH');
    }
  };

  // Initializing Credentials State Loader
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-slate-500 animate-pulse">
          Establishing secure connection...
        </p>
      </div>
    );
  }

  // Supabase Load Error Screen
  if (initError) {
    return (
      <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 mb-4 animate-float">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Connection Failure</h2>
        <p className="text-sm text-slate-600 max-w-sm mb-6">{initError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg relative flex flex-col justify-between">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/2 to-transparent pointer-events-none z-0" />

      {/* Main Navbar */}
      <header className="relative z-20 border-b border-warm-border bg-warm-card/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-500">
              <LinkedinIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-brand-espresso flex items-center gap-1.5">
              LinkedIn DNA Generator
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 font-semibold">
                v1.0-beta
              </span>
            </span>
          </div>

          {userEmail && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-mono">LOGGED IN AS</span>
                <span className="text-xs font-semibold text-brand-espresso">{userEmail}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-warm-border flex items-center justify-center font-bold text-xs text-white uppercase shadow-md shadow-indigo-600/10">
                {userEmail.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all text-xs cursor-pointer shadow-sm hover:shadow"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* View Orchestrator */}
      <main className="flex-grow flex flex-col justify-center py-6 relative z-10">
        {view === 'AUTH' && <Auth />}
        {view === 'ONBOARDING' && <Onboarding onSubmitPosts={handleOnboardingSubmit} />}
        {view === 'LOADING' && <Loader onComplete={handleLoaderComplete} />}
        {view === 'DASHBOARD' && profile && (
          <ProfileDashboard
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onReset={handleResetProfile}
            onProceedToTopics={() => setView('TOPIC_GENERATION')}
          />
        )}
        {view === 'TOPIC_GENERATION' && profile && (
          <TopicGenerator profile={profile} onBack={() => setView('DASHBOARD')} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-warm-border py-4 text-center text-[10px] text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 AI LinkedIn Post Generator. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Powered by Gemini <Sparkles className="w-3 h-3 text-indigo-450" />
          </span>
        </div>
      </footer>
    </div>
  );
}
