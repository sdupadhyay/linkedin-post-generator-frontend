import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';

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

interface AuthProps {
  onLoginSuccess: (email: string) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate short network delay for premium feel
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('google.user@gmail.com');
    }, 1000);
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden py-12">
      {/* Background Neon Glows */}
      <div className="radial-glow top-1/4 -left-1/4 animate-pulse-glow" style={{ animationDelay: '0s' }} />
      <div className="radial-glow bottom-1/4 -right-1/4 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 mb-4 shadow-[0_0_20px_rgba(99,102,241,0.08)] animate-float">
            <LinkedinIcon className="w-8 h-8 text-indigo-500 mr-1.5" />
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-brand-espresso via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI LinkedIn Post Generator
          </h1>
          <p className="mt-3 text-sm text-slate-600 max-w-sm mx-auto">
            Design your custom writing DNA. Generate high-engagement posts in seconds matching your exact voice.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-slate-400 focus:outline-none"
                  placeholder="name@company.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-400" />
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-slate-400 focus:outline-none"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Social Sign-in */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {/* SVG Google Logo */}
                <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
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
                <span>Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
