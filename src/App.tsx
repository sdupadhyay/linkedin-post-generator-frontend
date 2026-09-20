import { useState, useEffect, useRef } from "react";
import { Sparkles, LogOut, Cpu, Settings2 } from "lucide-react";
import { initSupabase, getSupabase } from "./utils/supabaseClient";
import Auth from "./components/Auth";
import Onboarding from "./components/Onboarding";
import Loader from "./components/Loader";
import ProfileDashboard from "./components/ProfileDashboard";
import type { WritingProfile } from "./components/ProfileDashboard";
import TopicGenerator from "./components/TopicGenerator";

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

type ScreenView =
  | "AUTH"
  | "ONBOARDING"
  | "LOADING"
  | "DASHBOARD"
  | "TOPIC_GENERATION";

import OutlineLoadingScreen from "./components/OutlineLoadingScreen";
const TESTING_TOPIC_LOADING_SCREEN = false;

export default function App() {
  const [view, setView] = useState<ScreenView>("AUTH");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<WritingProfile | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-oss:120b");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [usedTokens, setUsedTokens] = useState<number>(0);
  const [tokenLimit, setTokenLimit] = useState<number>(10000);
  // Fetch usage when settings opens
  useEffect(() => {
    if (isSettingsOpen && userEmail) {
      const fetchUsage = async () => {
        try {
          const supabase = getSupabase();
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;
          
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
          const res = await fetch(`${apiUrl}/api/tokens/usage`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (typeof data.current_usage === 'number') {
              setUsedTokens(data.current_usage);
            }
            if (typeof data.total_token_limit === 'number') {
              setTokenLimit(data.total_token_limit);
            }
          }
        } catch (e) {
          console.error("Failed to fetch usage");
        }
      };
      fetchUsage();
    }
  }, [isSettingsOpen, userEmail]);

  // API loading synchronizations
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [apiState, setApiState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [temporaryProfile, setTemporaryProfile] =
    useState<WritingProfile | null>(null);

  // Synchronize view state in a ref to avoid stale closures in event listeners
  const viewRef = useRef<ScreenView>(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  // Initialize Supabase configuration on start
  useEffect(() => {
    async function setup() {
      try {
        await initSupabase();
        const supabase = getSupabase();

        // Restore existing user session if available
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          setUserEmail(session.user.email ?? null);
          await fetchUserProfile(session.user.id);
        } else {
          setView("AUTH");
        }

        // Set up auth state change listener
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            setUserEmail(session.user.email ?? null);
            // Only fetch profile if starting up or explicit sign-in/out occurs.
            // Prevents background token refreshes from resetting page routing.
            if (viewRef.current === "AUTH" || viewRef.current === "LOADING") {
              await fetchUserProfile(session.user.id);
            }
          } else {
            // Only reset state and redirect if the event is explicitly SIGNED_OUT,
            // or if the app is still loading and hasn't restored any session.
            if (event === "SIGNED_OUT" || viewRef.current === "LOADING") {
              setUserEmail(null);
              setProfile(null);
              setView("AUTH");
            }
          }
        });
      } catch (err: any) {
        console.error("Supabase Setup Failure:", err);
        setInitError(
          err.message ||
            "Failed to establish connection to configuration server.",
        );
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
        .from("user_dna")
        .select("dna_profile")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Failed to query user profile:", error);
      }

      if (data?.dna_profile) {
        const mapped = mapDnaToProfile(data.dna_profile);
        setProfile(mapped);
        setView("DASHBOARD");
      } else {
        setView("ONBOARDING");
      }
    } catch (err) {
      console.error("Profile query failed:", err);
      setView("ONBOARDING");
    }
  };

  // Maps backend raw schema to frontend's high-fidelity WritingProfile interface
  const mapDnaToProfile = (res: any): WritingProfile => {
    if (
      res &&
      res.tone &&
      typeof res.tone === "object" &&
      "value" in res.tone &&
      res.personaName
    ) {
      return res as WritingProfile; // Already mapped
    }

    const tone = {
      value: res.tone?.value || "conversational",
      reasoning:
        res.tone?.reasoning ||
        "The tone is conversational, friendly, and engaging.",
      confidence: res.tone?.confidence ?? 0.8,
    };

    const topic = {
      value: Array.isArray(res.topic?.value)
        ? res.topic.value
        : ["technology", "programming", "web development", "AI"],
      reasoning:
        res.topic?.reasoning ||
        "Main topics covered are technology, programming, and AI.",
      confidence: res.topic?.confidence ?? 0.9,
    };

    const avg_words = {
      value:
        typeof res.avg_words?.value === "number"
          ? res.avg_words.value
          : Number(res.avg_words?.value) || 250,
      reasoning:
        res.avg_words?.reasoning || "Average word count is around 250.",
      confidence: res.avg_words?.confidence ?? 0.9,
    };

    const hoop_type = {
      value: res.hoop_type?.value || "exciting introduction",
      reasoning:
        res.hoop_type?.reasoning ||
        "Uses direct hook points to optimize impressions.",
      confidence: res.hoop_type?.confidence ?? 0.7,
    };

    const writing_type = {
      value: res.writing_type?.value || "informative",
      reasoning:
        res.writing_type?.reasoning ||
        "The overall writing paradigm is informative and educational.",
      confidence: res.writing_type?.confidence ?? 0.8,
    };

    const paragraph_size = {
      value: res.paragraph_size?.value || "short",
      reasoning:
        res.paragraph_size?.reasoning ||
        "Uses short, clean paragraphs for readability.",
      confidence: res.paragraph_size?.confidence ?? 0.8,
    };

    const emoji_frequency = {
      value: res.emoji_frequency?.value || "high",
      reasoning:
        res.emoji_frequency?.reasoning ||
        "Emojis are used to enhance readability and personality.",
      confidence: res.emoji_frequency?.confidence ?? 0.8,
    };

    const target_audience = {
      value: res.target_audience?.value || "Professionals in your industry",
      reasoning:
        res.target_audience?.reasoning ||
        "Inferred target audience based on the complexity and subject of your posts.",
      confidence: res.target_audience?.confidence ?? 0.8,
    };

    // Compute fresh persona name based on fields
    const wType = (writing_type.value || "").toLowerCase();
    const toneVal = (tone.value || "").toLowerCase();
    let personaName = "The Technical Storyteller";
    if (wType.includes("inform") || wType.includes("educat")) {
      personaName = "The Authority Educator";
    } else if (toneVal.includes("bold") || toneVal.includes("assert")) {
      personaName = "The Bold Thought Leader";
    } else if (toneVal.includes("convers") || toneVal.includes("friend")) {
      personaName = "The Conversational Networker";
    }

    return {
      tone,
      topic,
      avg_words,
      hoop_type,
      writing_type,
      paragraph_size,
      emoji_frequency,
      target_audience,
      personaName,
      personaDescription: writing_type.reasoning,
    };
  };

  // Submits the onboarding posts list to backend /api/analyze endpoint
  const handleOnboardingSubmit = async (posts: string[]) => {
    setView("LOADING");
    setApiState("pending");
    setTemporaryProfile(null);

    try {
      const supabase = getSupabase();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(
          "Authentication session has expired. Please log in again.",
        );
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const dynamicProvider = selectedModel.includes("gpt-oss")
        ? "ollama"
        : "groq";
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          posts,
          model: selectedModel,
          provider: dynamicProvider,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error || "Backend analysis engine encountered an error.",
        );
      }

      const dnaProfileRaw = await response.json();
      const mappedProfile = mapDnaToProfile(dnaProfileRaw);

      setTemporaryProfile(mappedProfile);
      setApiState("success");
    } catch (err: any) {
      console.error("Analysis error:", err);
      alert(err.message || "Failed to extract writing style profile.");
      setApiState("error");
      setView("ONBOARDING");
    }
  };

  // Triggers DNA regeneration using saved posts from the backend
  const handleRegenerateDNA = async () => {
    setView("LOADING");
    setApiState("pending");
    setTemporaryProfile(null);

    try {
      const supabase = getSupabase();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(
          "Authentication session has expired. Please log in again.",
        );
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const dynamicProvider = selectedModel.includes("gpt-oss")
        ? "ollama"
        : "groq";

      const response = await fetch(`${apiUrl}/api/analyze/regenerate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          provider: dynamicProvider,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error || "Failed to regenerate DNA from saved posts.",
        );
      }

      const dnaProfileRaw = await response.json();
      const mappedProfile = mapDnaToProfile(dnaProfileRaw);

      setTemporaryProfile(mappedProfile);
      setApiState("success");
    } catch (err: any) {
      console.error("Regeneration error:", err);
      alert(err.message || "Failed to regenerate writing style profile.");
      setApiState("error");
      setView("DASHBOARD");
    }
  };

  // Called when the loader UI reaches 100% completion
  const handleLoaderComplete = () => {
    if (apiState === "success" && temporaryProfile) {
      setProfile(temporaryProfile);
      setView("DASHBOARD");
      setApiState("idle");
      setTemporaryProfile(null);
    } else if (apiState === "error") {
      setView("ONBOARDING");
      setApiState("idle");
    } else {
      // API call still in progress, loader will wait at 99%
      console.log("Loader completed but API is still pending. Holding view.");
    }
  };

  // Watch API success to auto-finish loader if it was waiting at 99%
  useEffect(() => {
    if (view === "LOADING" && apiState === "success" && temporaryProfile) {
      // Transition if the loader was already complete and waiting
      // We check if progress is done. App will transition via callback or directly.
    }
  }, [apiState, view, temporaryProfile]);

  const handleUpdateProfile = async (updated: WritingProfile) => {
    try {
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setProfile(updated);

      // Strip computed properties before database sync
      const { personaName, personaDescription, ...dnaProfileData } = updated;

      // Update database profile
      const { error } = await supabase
        .from("user_dna")
        .update({
          dna_profile: dnaProfileData,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to sync profile update with database:", error);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const handleResetProfile = async () => {
    try {
      const supabase = getSupabase();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (
        confirm(
          "Are you sure you want to recalibrate? This will clear your current profile and let you upload new posts.",
        )
      ) {
        setProfile(null);
        setView("ONBOARDING");

        const { error } = await supabase
          .from("user_dna")
          .delete()
          .eq("user_id", user.id);

        if (error) {
          console.error("Failed to clear DNA profile from database:", error);
        }
      }
    } catch (err) {
      console.error("Profile reset failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUserEmail(null);
      setProfile(null);
      setView("AUTH");
    }
  };

  // Initializing Credentials State Loader
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in-up">
        {/* Orbital AI Spinner */}
        <div className="relative w-32 h-32 mb-6 flex items-center justify-center mx-auto">
          {/* Outer Pulsing Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10 animate-pulse" />

          {/* Orbit Ring 1 - Cyan */}
          <div
            className="absolute w-26 h-26 rounded-full border-t border-b border-cyan-500/20 animate-spin"
            style={{ animationDuration: "8s" }}
          />

          {/* Orbit Ring 2 - Violet (Spinning Counter-Clockwise) */}
          <div
            className="absolute w-20 h-20 rounded-full border-l border-r border-purple-500/20 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "6s" }}
          />

          {/* Orbit Ring 3 - Indigo (Fast) */}
          <div
            className="absolute w-16 h-16 rounded-full border-t-2 border-indigo-500/40 animate-spin"
            style={{ animationDuration: "2.5s" }}
          />

          {/* Inner Hub Glass Sphere */}
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md relative">
            <Cpu className="w-4 h-4 text-indigo-600 animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5">
              <Sparkles
                className="w-3 h-3 text-cyan-600 animate-bounce"
                style={{ animationDuration: "1.5s" }}
              />
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-mono font-semibold text-indigo-600 uppercase tracking-wider mb-2.5 animate-pulse">
          <Sparkles
            className="w-3 h-3 text-cyan-500 animate-spin"
            style={{ animationDuration: "6s" }}
          />
          <span>Synchronizing Session</span>
        </div>

        <p className="text-sm font-bold text-slate-800 animate-pulse">
          Establishing Secure Handshake with Writing DNA Engine...
        </p>
        <p className="text-[11px] text-slate-500 max-w-xs mt-1 mx-auto">
          Authenticating SUPABASE gateway credentials and restoring persona
          index mappings.
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
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Connection Failure
        </h2>
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

  if (TESTING_TOPIC_LOADING_SCREEN) {
    return <OutlineLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-warm-bg relative flex flex-col justify-between">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/2 to-transparent pointer-events-none z-0" />
      {/* Top Navigation Bar */}
      {view !== "AUTH" && view !== "LOADING" && (
        <header className="relative z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
            {/* Left: Brand */}
            <div className="flex items-center">
              <span className="font-extrabold text-[22px] tracking-tight text-[#00bb7f]">
                AIPulse
              </span>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-6">
              {/* Settings Dropdown Container */}
              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`transition-colors cursor-pointer p-2 rounded-lg flex items-center ${isSettingsOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  title="Settings"
                >
                  <Settings2 className="w-5 h-5" />
                </button>

                {isSettingsOpen && (
                  <>
                    {/* Invisible overlay to close on click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)} />
                    
                    {/* The Dropdown Panel */}
                    <div className="absolute right-0 top-full mt-3 w-[340px] bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-50 animate-fade-in-up origin-top-right overflow-hidden">
                      <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                        <h3 className="text-[14px] font-extrabold text-slate-800">Account Preferences</h3>
                      </div>
                      
                      <div className="p-5 space-y-6">
                        {/* Usage Section */}
                        {(() => {
                          const usagePercentage = Math.min((usedTokens / tokenLimit) * 100, 100);
                          const isExhausted = usagePercentage >= 100;
                          const isNearLimit = usagePercentage > 90;
                          const activeColor = isNearLimit ? 'bg-rose-500' : 'bg-[#00bb7f]';
                          const activeBgLight = isNearLimit ? 'bg-rose-50' : 'bg-[#00bb7f]/10';

                          return (
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Daily Token Quota</h4>
                                <span className={`flex items-center justify-center w-5 h-5 rounded-md ${activeBgLight} transition-colors duration-300`} title={isExhausted ? "Quota Exhausted" : isNearLimit ? "High Usage" : "Normal Usage"}>
                                  <span className="relative flex h-1.5 w-1.5">
                                    {!isExhausted && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeColor} opacity-75`}></span>}
                                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${activeColor}`}></span>
                                  </span>
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${activeColor} transition-all duration-700 ${isExhausted ? 'opacity-80' : ''}`} style={{ width: `${usagePercentage}%` }} />
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <p className={`text-[10px] font-medium ${isExhausted ? 'text-rose-500' : 'text-slate-400'}`}>
                                  {isExhausted ? 'Quota exhausted. Resets at midnight UTC.' : 'Usage resets at midnight UTC.'}
                                </p>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Model Selection */}
                        <div>
                          <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">AI Engine</h4>
                          <div className="relative">
                            <select
                              value={selectedModel}
                              onChange={(e) => setSelectedModel(e.target.value)}
                              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00bb7f]/20 focus:border-[#00bb7f]/50 cursor-pointer transition-all shadow-sm"
                            >
                              <option value="gpt-oss:120b">gpt-oss:120b (Default)</option>
                              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Groq)</option>
                              <option value="llama3-8b-8192">llama3-8b-8192 (Groq)</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {userEmail && (
                <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-white shadow-sm flex items-center justify-center font-bold text-sm text-white uppercase relative">
                    {userEmail.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-[13px] font-bold text-slate-800">
                      {userEmail.split("@")[0]}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-[9px] font-bold text-slate-500 tracking-wider uppercase hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      LOGOUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
      {/* View Orchestrator */}
      <main className="flex-grow flex flex-col justify-center relative z-10">
        {view === "AUTH" && <Auth />}
        {view === "ONBOARDING" && (
          <Onboarding onSubmitPosts={handleOnboardingSubmit} />
        )}
        {view === "LOADING" && <Loader onComplete={handleLoaderComplete} />}
        {view === "DASHBOARD" && profile && (
          <ProfileDashboard
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onReset={handleResetProfile}
            onProceedToTopics={() => setView("TOPIC_GENERATION")}
            onRegenerateDNA={handleRegenerateDNA}
          />
        )}
        {view === "TOPIC_GENERATION" && profile && (
          <TopicGenerator
            profile={profile}
            onBack={() => setView("DASHBOARD")}
            selectedModel={selectedModel}
          />
        )}
      </main>

    </div>
  );
}
