import React, { useState } from "react";
import { getSupabase } from "../utils/supabaseClient";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setInfo("");
    setIsLoading(true);

    try {
      const supabase = getSupabase();
      if (isSignUp) {
        // Sign Up Flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (data.user && data.session === null) {
          setInfo(
            "Registration successful! Please check your email for a confirmation link.",
          );
        } else {
          setInfo("Account created successfully!");
        }
      } else {
        // Sign In Flow
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        }
      }
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setInfo("");
    setIsLoading(true);

    try {
      const supabase = getSupabase();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "OAuth error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-[#fafcfb]">
      {/* Subtle Dotted Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

      <div className="relative z-10 w-full max-w-[480px] animate-fade-in-up mt-8 mb-12">
        {/* Header Area */}
        <div className="text-center mb-10 flex flex-col items-center">
          {/* <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#00bb7f]/10 border border-[#00bb7f]/20 text-[#007956] text-xs font-bold tracking-wide mb-6">
          </span> */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Your AI Twin for{" "}
            <span className="text-[#00bb7f] italic font-serif">LinkedIn</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
            Stop writing, start mirroring. AIPulse learns your unique voice,
            expertise, and rhythm to generate LinkedIn content that sounds
            exactly like you.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100">
          {/* Segment Control Toggle */}
          <div className="flex p-1 bg-[#f4f7f6] rounded-xl mb-8 border border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError("");
                setInfo("");
              }}
              className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
                !isSignUp
                  ? "bg-white text-[#00bb7f] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError("");
                setInfo("");
              }}
              className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
                isSignUp
                  ? "bg-white text-[#00bb7f] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          {info && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#00bb7f]/10 border border-[#00bb7f]/20 text-xs text-[#007956] font-medium">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00bb7f]/20 focus:border-[#00bb7f] transition-all bg-white font-medium"
                placeholder="name@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                className="block text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00bb7f]/20 focus:border-[#00bb7f] transition-all bg-white font-medium"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#00bb7f] hover:bg-[#007956] text-white font-bold text-sm transition-all shadow-[0_4px_14px_0_rgba(0,187,127,0.39)] hover:shadow-[0_6px_20px_rgba(0,121,86,0.23)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold tracking-widest uppercase text-slate-400">
              <span className="px-4 bg-white">OR</span>
            </div>
          </div>

          {/* Social Sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#00bb7f]/30 border-t-[#00bb7f] rounded-full animate-spin mx-auto" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.414 0-6.19-2.775-6.19-6.19 0-3.414 2.776-6.19 6.19-6.19 1.483 0 2.825.524 3.89 1.394l3.142-3.142C18.17 1.932 15.352 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.87-4.243 10.87-11.24 0-.648-.076-1.295-.19-1.955H12.24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.7 7.447l3.753 2.898c.954-2.486 3.33-4.188 6.087-4.188 1.483 0 2.825.524 3.89 1.394l3.142-3.142C18.17 1.932 15.352 1 12.24 1 8.528 1 5.347 3.619 3.7 7.447Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12.24 23.48c3.112 0 5.93-1.002 7.973-2.74l-3.328-2.735c-1.229.805-2.79 1.36-4.645 1.36-2.756 0-5.133-1.702-6.087-4.188L2.4 18.075c1.647 3.828 4.828 6.447 8.528 6.447Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.11 12.24c0-.648-.076-1.295-.19-1.955H12.24V14.4h6.887c-.286 1.066-.867 2.019-1.638 2.74l3.328 2.735c1.948-1.795 3.293-4.433 3.293-7.635Z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Footer Text */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="underline hover:text-slate-800 transition-colors"
              >
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
