import { useState } from 'react';
import { Sparkles, Edit2, Check, X, Sliders, MessageSquare, Smile, FileSpreadsheet, LayoutList, RefreshCw, LogOut } from 'lucide-react';

export interface WritingProfile {
  personaName: string;
  personaDescription: string;
  tone: string[];
  hookStyle: string;
  hookExample: string;
  avgLength: number;
  emojiUsage: string;
  emojiPercent: number;
  ctaStyle: string[];
  sentenceStructure: string;
  storytellingPattern: string;
  vocabularyComplexity: string;
  formattingStyle: string;
}

interface ProfileDashboardProps {
  profile: WritingProfile;
  onUpdateProfile: (updated: WritingProfile) => void;
  onReset: () => void;
  onLogout: () => void;
  onProceedToTopics: () => void;
}

export default function ProfileDashboard({
  profile,
  onUpdateProfile,
  onReset,
  onLogout,
  onProceedToTopics,
}: ProfileDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<WritingProfile>({ ...profile });

  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleToneToggle = (toneTag: string) => {
    let nextTones = [...editedProfile.tone];
    if (nextTones.includes(toneTag)) {
      if (nextTones.length > 1) {
        nextTones = nextTones.filter((t) => t !== toneTag);
      }
    } else {
      nextTones.push(toneTag);
    }
    setEditedProfile({ ...editedProfile, tone: nextTones });
  };

  const handleCtaToggle = (ctaTag: string) => {
    let nextCtas = [...editedProfile.ctaStyle];
    if (nextCtas.includes(ctaTag)) {
      if (nextCtas.length > 1) {
        nextCtas = nextCtas.filter((c) => c !== ctaTag);
      }
    } else {
      nextCtas.push(ctaTag);
    }
    setEditedProfile({ ...editedProfile, ctaStyle: nextCtas });
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-8 z-10 animate-fade-in-up">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase bg-indigo-500/5 px-2.5 py-1 rounded-md border border-indigo-500/20 text-indigo-600 font-semibold">
            Writing DNA Analysis
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 mt-1">
            Your Professional Writing DNA
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all text-xs cursor-pointer"
            title="Recalibrate Profile (Upload Posts)"
          >
            <RefreshCw className="w-4 h-4 mr-2 text-indigo-500" />
            <span>Recalibrate</span>
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all text-xs cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Persona insight Card - Span 2 Columns */}
        <div className="glass-card rounded-2xl p-6 md:p-8 md:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div className="radial-glow -top-1/4 -right-1/4 w-72 h-72 opacity-50 pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">AI Persona Classification</span>
            </div>

            {isEditing ? (
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="personaName">
                    Persona Classification Name
                  </label>
                  <input
                    type="text"
                    id="personaName"
                    value={editedProfile.personaName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, personaName: e.target.value })}
                    className="glass-input w-full px-3 py-2 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="personaDescription">
                    Style Description
                  </label>
                  <textarea
                    id="personaDescription"
                    value={editedProfile.personaDescription}
                    onChange={(e) => setEditedProfile({ ...editedProfile, personaDescription: e.target.value })}
                    className="glass-input w-full h-24 px-3 py-2 rounded-lg text-sm resize-none"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                  {profile.personaName}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                  {profile.personaDescription}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
            <span className="text-[11px] font-mono text-indigo-600 font-medium">Tone Fingerprint Verified</span>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-medium transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                Customize Parameters
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 text-xs font-medium transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 1. Tone card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-800">Tone & Vibrancy</h3>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <span className="block text-xs font-medium text-slate-500">Select Tone Profiles:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Professional', 'Friendly', 'Bold', 'Educational', 'Inspirational', 'Casual', 'Analytical'].map((t) => {
                    const isSelected = editedProfile.tone.includes(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => handleToneToggle(t)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {profile.tone.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/5 border border-indigo-500/15 text-indigo-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Visual Sliders */}
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>PROFESSIONAL</span>
                      <span className="text-indigo-600">80%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full bg-indigo-500" style={{ width: '80%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>EDUCATIONAL</span>
                      <span className="text-purple-600">90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full bg-purple-500" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-4">Vibe Intensity: High</span>
        </div>

        {/* 2. Hook Style card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-semibold text-slate-800">Opening Hook Pattern</h3>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="hookStyle">
                    Hook Format Type
                  </label>
                  <select
                    id="hookStyle"
                    value={editedProfile.hookStyle}
                    onChange={(e) => setEditedProfile({ ...editedProfile, hookStyle: e.target.value })}
                    className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                  >
                    <option value="Question-Based">Question-Based</option>
                    <option value="Statement-Based">Statement-Based</option>
                    <option value="Story-Driven">Story-Driven</option>
                    <option value="Stat-Based">Stat-Based</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="hookExample">
                    Hook Template Example
                  </label>
                  <input
                    type="text"
                    id="hookExample"
                    value={editedProfile.hookExample}
                    onChange={(e) => setEditedProfile({ ...editedProfile, hookExample: e.target.value })}
                    className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs px-2.5 py-1 rounded-md bg-purple-500/5 border border-purple-500/15 text-purple-600 font-semibold">
                  {profile.hookStyle}
                </span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mt-2">
                  <span className="block text-[10px] font-mono text-slate-400 mb-1">SAMPLE PREVIEW</span>
                  <p className="text-xs italic text-slate-600">
                    "{profile.hookExample}"
                  </p>
                </div>
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-4">Impression Rate: 92%</span>
        </div>

        {/* 3. Emoji Usage card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Smile className="w-4 h-4 text-yellow-600" />
              <h3 className="text-sm font-semibold text-slate-800">Emoji Density</h3>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Density Label
                  </label>
                  <select
                    value={editedProfile.emojiUsage}
                    onChange={(e) => setEditedProfile({ ...editedProfile, emojiUsage: e.target.value })}
                    className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                  >
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Percentage</span>
                    <span>{editedProfile.emojiPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editedProfile.emojiPercent}
                    onChange={(e) => setEditedProfile({ ...editedProfile, emojiPercent: parseInt(e.target.value) })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                {/* Circular indicator */}
                <div className="relative w-18 h-18 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="36" cy="36" r="30" stroke="rgba(0,0,0,0.05)" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      stroke="#a855f7"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="188.4"
                      strokeDashoffset={188.4 - (188.4 * profile.emojiPercent) / 100}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-slate-800">{profile.emojiPercent}%</span>
                </div>

                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-yellow-500/5 border border-yellow-500/15 text-yellow-700 block mb-1 w-max">
                    {profile.emojiUsage}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Calculated emoji insertion per paragraph.
                  </p>
                </div>
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-4">Type: Engagement Optimizer</span>
        </div>

        {/* 4. Average Length & Structure card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-800">Size & Structure</h3>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Average Length (Words)</span>
                    <span>{editedProfile.avgLength} words</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={editedProfile.avgLength}
                    onChange={(e) => setEditedProfile({ ...editedProfile, avgLength: parseInt(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="sentenceStructure">
                    Sentence Structure
                  </label>
                  <select
                    id="sentenceStructure"
                    value={editedProfile.sentenceStructure}
                    onChange={(e) => setEditedProfile({ ...editedProfile, sentenceStructure: e.target.value })}
                    className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                  >
                    <option value="Short & Punchy">Short & Punchy</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Complex & Structured">Complex & Structured</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>Average Length</span>
                    <span className="text-emerald-600 font-semibold">{profile.avgLength} words</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-emerald-600"
                      style={{ width: `${Math.min((profile.avgLength / 400) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 pt-0.5">Ideal for reader retention bounds.</p>
                </div>

                <div>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Syntax Pattern</span>
                  <span className="text-xs text-slate-700 font-semibold">{profile.sentenceStructure}</span>
                </div>
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-4">Formatting Type: Segmented</span>
        </div>

        {/* 5. CTA Style & Formatting card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LayoutList className="w-4 h-4 text-cyan-600" />
              <h3 className="text-sm font-semibold text-slate-800">CTAs & Layouts</h3>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-slate-600">Preferred CTA Styles:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Engagement Question', 'Direct Link', 'Resource Offer', 'Interactive Poll', 'Value Pitch'].map((c) => {
                      const isSelected = editedProfile.ctaStyle.includes(c);
                      return (
                        <button
                          type="button"
                          key={c}
                          onClick={() => handleCtaToggle(c)}
                          className={`text-[10px] px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-700 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="formattingStyle">
                    Spacing & Formatting
                  </label>
                  <input
                    type="text"
                    id="formattingStyle"
                    value={editedProfile.formattingStyle}
                    onChange={(e) => setEditedProfile({ ...editedProfile, formattingStyle: e.target.value })}
                    className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Typical Outro Call to Actions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.ctaStyle.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-50 border border-cyan-150 text-cyan-600"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Whitespace layout</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{profile.formattingStyle}</p>
                </div>
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-4">Outro Style: Interactive</span>
        </div>

        {/* 6. Vocabulary Complexity & Storytelling Pattern */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-semibold text-slate-800">Stylistic DNA</h3>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="vocabularyComplexity">
                    Vocabulary Range
                  </label>
                  <select
                    id="vocabularyComplexity"
                    value={editedProfile.vocabularyComplexity}
                    onChange={(e) => setEditedProfile({ ...editedProfile, vocabularyComplexity: e.target.value })}
                    className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                  >
                    <option value="Conversational & Direct">Conversational & Direct</option>
                    <option value="Technical & Analytical">Technical & Analytical</option>
                    <option value="Advanced & Formal">Advanced & Formal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1" htmlFor="storytellingPattern">
                    Storytelling Method
                  </label>
                  <select
                    id="storytellingPattern"
                    value={editedProfile.storytellingPattern}
                    onChange={(e) => setEditedProfile({ ...editedProfile, storytellingPattern: e.target.value })}
                    className="glass-input w-full px-3 py-2 rounded-lg text-xs"
                  >
                    <option value="Before-After-Bridge">Before-After-Bridge</option>
                    <option value="Hero's Journey (Short)">Hero's Journey (Short)</option>
                    <option value="Hook-Value-CTA Grid">Hook-Value-CTA Grid</option>
                    <option value="Question & Answer">Question & Answer</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Vocabulary Density</span>
                  <span className="text-xs text-slate-700 font-semibold">{profile.vocabularyComplexity}</span>
                </div>

                <div>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Storytelling Paradigm</span>
                  <span className="text-xs text-slate-700 font-semibold">{profile.storytellingPattern}</span>
                </div>
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-4">Model ID: lpg-v1.4</span>
        </div>
      </div>

      {/* Trigger Button to Proceed to Topic Generator */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onProceedToTopics}
          disabled={isEditing}
          className={`group inline-flex items-center justify-center py-4 px-10 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl border cursor-pointer ${
            isEditing
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:to-purple-700 text-white shadow-purple-600/10 hover:shadow-purple-600/20 border-purple-500/20'
          }`}
        >
          <span>Unlock Content Ideas (Generate Topics)</span>
          <Sparkles className="w-5 h-5 ml-2 text-yellow-300 group-hover:animate-bounce" />
        </button>
      </div>
    </div>
  );
}
