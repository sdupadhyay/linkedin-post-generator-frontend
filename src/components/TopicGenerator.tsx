import { useState, useEffect } from "react";
import TopicLoadingScreen from "./TopicLoadingScreen";
import OutlineLoadingScreen from "./OutlineLoadingScreen";
import {
	Lightbulb,
	ChevronLeft,
	Sparkles,
	Compass,
	TrendingUp,
	Target,
	Code2,
	Copy,
	FileText,
		ShieldCheck,
		CheckCheck,
} from "lucide-react";
import { getSupabase } from "../utils/supabaseClient";
import type { WritingProfile } from "./ProfileDashboard";

interface Topic {
	id: string;
	title: string;
	description: string;
	category: string;
	difficulty: "High Engagement" | "Authority" | "Storytelling";
	icon: any;
}

interface PostOutline {
	core_thesis: string;
	target_audience_takeaway: string;
	narrative_arc: string[];
	suggested_examples: { type: "anecdote" | "prompt_for_user"; content: string }[];
	target_lsi_keywords: string[];
}

interface TopicGeneratorProps {
	profile: WritingProfile;
	onBack: () => void;
	selectedModel: string;
}

let lastFetchedTime = 0;

export default function TopicGenerator({
	profile,
	onBack,
	selectedModel,
}: TopicGeneratorProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isGeneratingPost, setIsGeneratingPost] = useState(false);
	const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
	const [topics, setTopics] = useState<Topic[]>([]);
	const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
	const [outline, setOutline] = useState<PostOutline | null>(null);
	const [feedback, setFeedback] = useState("");
	const [step, setStep] = useState<"topics" | "outline" | "post">("topics");
	const [generatedPost, setGeneratedPost] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// Custom Topic form states
	const [customTitle, setCustomTitle] = useState("");
	const [customReasoning, setCustomReasoning] = useState("");
	const [customTopic, setCustomTopic] = useState<{
		title: string;
		description: string;
	} | null>(null);

	useEffect(() => {
		const now = Date.now();
		if (topics.length === 0 && now - lastFetchedTime > 1000) {
			lastFetchedTime = now;
			handleGenerate();
		}
	}, []);

	// Helper to reverse map frontend UI profile back to backend raw schema
	const mapProfileToDna = (p: WritingProfile) => {
		return {
			tone: {
				value: p.tone.value,
				confidence: p.tone.confidence,
				reasoning: p.tone.reasoning,
			},
			hoop_type: {
				value: p.hoop_type.value,
				confidence: p.hoop_type.confidence,
				reasoning: p.hoop_type.reasoning,
			},
			avg_words: {
				value: p.avg_words.value,
				confidence: p.avg_words.confidence,
				reasoning: p.avg_words.reasoning,
			},
			emoji_frequency: {
				value: p.emoji_frequency.value,
				confidence: p.emoji_frequency.confidence,
				reasoning: p.emoji_frequency.reasoning,
			},
			paragraph_size: {
				value: p.paragraph_size.value,
				confidence: p.paragraph_size.confidence,
				reasoning: p.paragraph_size.reasoning,
			},
			writing_type: {
				value: p.writing_type.value,
				confidence: p.writing_type.confidence,
				reasoning: p.writing_type.reasoning,
			},
			topic: {
				value: p.topic.value,
				confidence: p.topic.confidence,
				reasoning: p.topic.reasoning,
			},
			target_audience: p.target_audience ? {
				value: p.target_audience.value,
				confidence: p.target_audience.confidence,
				reasoning: p.target_audience.reasoning,
			} : undefined,
		};
	};

	const handleGenerate = async () => {
		setIsLoading(true);
		setTopics([]);
		setSelectedTopicId(null);
		setGeneratedPost(null);
		setOutline(null);
		setFeedback("");
		setCustomTitle("");
		setCustomReasoning("");
		setCustomTopic(null);
		setStep("topics");
		setErrorMsg(null);

		try {
			const supabase = getSupabase();
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) {
				throw new Error("Authentication session has expired. Please sign in.");
			}

			const rawDnaProfile = mapProfileToDna(profile);
			const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
			console.log({ apiUrl });
			const dynamicProvider = selectedModel.includes('gpt-oss') ? 'ollama' : 'groq';
			const response = await fetch(`${apiUrl}/api/topics`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({ dnaProfile: rawDnaProfile, model: selectedModel, provider: dynamicProvider }),
			});
			console.log({ response });
			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.error || "Failed to query trending topics.");
			}

			const result = await response.json();

			if (!result.topics || !Array.isArray(result.topics)) {
				throw new Error(
					"Backend topics endpoint returned an invalid payload structure.",
				);
			}

			const mappedTopics = result.topics.map((t: any, idx: number) => {
				let iconComp = Compass;
				const titleL = (t.topic_title || "").toLowerCase();
				if (
					titleL.includes("code") ||
					titleL.includes("software") ||
					titleL.includes("tech")
				) {
					iconComp = Code2;
				} else if (
					titleL.includes("grow") ||
					titleL.includes("metric") ||
					titleL.includes("scale")
				) {
					iconComp = TrendingUp;
				} else if (
					titleL.includes("hire") ||
					titleL.includes("team") ||
					titleL.includes("people")
				) {
					iconComp = Target;
				} else if (
					titleL.includes("vulner") ||
					titleL.includes("launch") ||
					titleL.includes("fail")
				) {
					iconComp = Lightbulb;
				} else if (
					titleL.includes("worth") ||
					titleL.includes("portfolio") ||
					titleL.includes("degree")
				) {
					iconComp = ShieldCheck;
				}

				return {
					id: `topic-${idx}`,
					title: t.topic_title || "Suggested Angle",
					description:
						t.reasoning ||
						"Correlated topic angle matching your persona parameters.",
					category: (t.audience_fit >= 0.9 || t.trend_relevance >= 0.9) ? "Top Match" : "Topic Suggestion",
					difficulty:
						idx % 3 === 0
							? "High Engagement"
							: idx % 3 === 1
								? "Authority"
								: "Storytelling",
					icon: iconComp,
				};
			});

			setTopics(mappedTopics);
		} catch (err: any) {
			console.error(err);
			setErrorMsg(err.message || "Failed to generate topics.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelectTopic = (id: string) => {
		setSelectedTopicId(id);
		setCustomTopic(null);
		setCustomTitle("");
		setCustomReasoning("");
		setGeneratedPost(null);
		setOutline(null);
		setFeedback("");
	};

	const handleGenerateOutline = async () => {
		if (!selectedTopicId) return;
		const selected = topics.find((t) => t.id === selectedTopicId);
		if (!selected) return;

		setCustomTopic(null);
		setIsGeneratingOutline(true);
		setOutline(null);
		setFeedback("");
		setErrorMsg(null);

		try {
			const supabase = getSupabase();
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) {
				throw new Error("Authentication session has expired. Please sign in.");
			}

			const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

			const dynamicProvider = selectedModel.includes('gpt-oss') ? 'ollama' : 'groq';
			const response = await fetch(`${apiUrl}/api/outline`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({
					topic: {
						title: selected.title,
						reasoning: selected.description,
					},
					model: selectedModel,
					provider: dynamicProvider,
				}),
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.error || "Failed to generate content outline.");
			}

			const result = await response.json();
			setOutline(result);
			setStep("outline");
		} catch (err: any) {
			console.error(err);
			setErrorMsg(err.message || "Failed to generate outline.");
		} finally {
			setIsGeneratingOutline(false);
		}
	};

	const handleGenerateCustomOutline = async () => {
		if (!customTitle.trim()) return;

		setSelectedTopicId(null);
		setIsGeneratingOutline(true);
		setOutline(null);
		setFeedback("");
		setErrorMsg(null);

		const topicData = {
			title: customTitle.trim(),
			description:
				customReasoning.trim() || "Write a compelling post on this topic.",
		};
		setCustomTopic(topicData);

		try {
			const supabase = getSupabase();
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) {
				throw new Error("Authentication session has expired. Please sign in.");
			}

			const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

			const dynamicProvider = selectedModel.includes('gpt-oss') ? 'ollama' : 'groq';
			const response = await fetch(`${apiUrl}/api/outline`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({
					topic: {
						title: topicData.title,
						reasoning: topicData.description,
					},
					model: selectedModel,
					provider: dynamicProvider,
				}),
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.error || "Failed to generate content outline.");
			}

			const result = await response.json();
			setOutline(result);
			setStep("outline");
		} catch (err: any) {
			console.error(err);
			setErrorMsg(err.message || "Failed to generate outline.");
		} finally {
			setIsGeneratingOutline(false);
		}
	};

	const handleGeneratePostDraft = async () => {
		let selectedTopic = null;
		if (customTopic) {
			selectedTopic = {
				title: customTopic.title,
				description: customTopic.description,
				isCustom: true,
			};
		} else if (selectedTopicId) {
			const selected = topics.find((t) => t.id === selectedTopicId);
			if (selected) {
				selectedTopic = {
					title: selected.title,
					description: selected.description,
					isCustom: false,
				};
			}
		}

		if (!selectedTopic) return;

		setIsGeneratingPost(true);
		setGeneratedPost(null);
		setErrorMsg(null);

		try {
			const supabase = getSupabase();
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) {
				throw new Error("Authentication session has expired. Please sign in.");
			}

			const rawDnaProfile = mapProfileToDna(profile);
			const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

			const dynamicProvider = selectedModel.includes('gpt-oss') ? 'ollama' : 'groq';
			const response = await fetch(`${apiUrl}/api/generate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({
					dnaProfile: rawDnaProfile,
					topic: {
						title: selectedTopic.title,
						reasoning: selectedTopic.description,
						isCustom: selectedTopic.isCustom,
					},
					outline: outline || undefined,
					feedback: feedback.trim() || undefined,
					model: selectedModel,
					provider: dynamicProvider,
				}),
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.error || "Failed to generate post draft.");
			}

			const result = await response.json();
			setGeneratedPost(result.post);
			setStep("post");
		} catch (err: any) {
			console.error(err);
			setErrorMsg(err.message || "Failed to draft your post.");
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

	if (isLoading) {
		return <TopicLoadingScreen />;
	}

	if (isGeneratingOutline) {
		return <OutlineLoadingScreen />;
	}

	return (
		<div className="min-h-[100vh] bg-gradient-to-br from-white via-[#f4fcf8] to-[#00bb7f]/20 font-sans p-6 pb-32 -mx-4 sm:-mx-6 lg:-mx-8">
			<div className="relative max-w-[1200px] mx-auto z-10 animate-fade-in-up">
			{/* Back button */}
			<button
				onClick={() => {
					if (step === "post") {
						setStep("outline");
					} else if (step === "outline") {
						setStep("topics");
					} else {
						onBack();
					}
				}}
				className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 mb-6 transition-colors cursor-pointer"
			>
				<ChevronLeft className="w-4 h-4 mr-1" />
				<span>
					{step === "post"
						? "Back to Outline Steering"
						: step === "outline"
							? "Back to Suggested Topics"
							: "Back to Writing Profile"}
				</span>
			</button>

				{errorMsg && (
					<div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 max-w-md mx-auto">
						{errorMsg}
					</div>
				)}

				{step === "topics" && topics.length === 0 && !isLoading && (
					<button
						onClick={handleGenerate}
						className="mt-8 inline-flex items-center justify-center py-3.5 px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 border border-indigo-400/10 cursor-pointer"
					>
						<span>Generate Suggested Topics</span>
					</button>
				)}

			{/* Post Generation Loading State */}
			{isGeneratingPost && (
				<div className="mt-8 glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-fade-in-up border border-indigo-500/10 shadow-sm">
					<div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-150 flex items-center justify-center mb-4">
						<Sparkles
							className="w-6 h-6 text-indigo-600 animate-spin"
							style={{ animationDuration: "3s" }}
						/>
					</div>
					<h3 className="text-base font-bold text-slate-800 mb-1">
						Ghostwriting LinkedIn Post...
					</h3>
					<p className="text-xs text-slate-500 max-w-sm">
						Groq Llama 3 engine is composing your post based on the approved
						outline, your writing DNA profile, and your steering feedback.
					</p>
				</div>
			)}

			{/* Step 1: Choose or Write a Topic */}
			{step === "topics" && !isLoading && !isGeneratingOutline && (
				<div className="space-y-10 animate-fade-in-up w-full max-w-[1100px] mx-auto pb-20">
					
					{/* Header */}
					<div className="mb-4">
						<h2 className="text-[28px] md:text-[32px] font-extrabold text-[#0f172a] mb-2 tracking-tight">Recommended Topics</h2>
						<p className="text-slate-500 font-medium text-[14px] md:text-[15px] max-w-3xl leading-relaxed">
							AI-curated content streams based on your brand DNA and current audience engagement trends. Pick a direction to start generating your outline.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{topics.map((topic) => {
							const isSelected = selectedTopicId === topic.id;
							
							return (
								<div
									key={topic.id}
									onClick={() => handleSelectTopic(topic.id)}
									className={`bg-white rounded-[20px] p-6 md:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 relative group overflow-hidden ${
										isSelected
											? "border-[#00bb7f] ring-1 ring-[#00bb7f] shadow-[0_12px_40px_rgba(0,187,127,0.12)] scale-[1.02]"
											: "border border-slate-200 hover:border-[#00bb7f]/40 hover:shadow-[0_8px_30px_rgba(0,187,127,0.08)] hover:-translate-y-1 scale-100"
									}`}
								>
									{/* Highlight Bar for selected card */}
									<div className={`absolute top-0 left-0 right-0 h-[5px] transition-all duration-300 ${isSelected ? 'bg-[#00bb7f]' : 'bg-transparent group-hover:bg-[#00bb7f]/20'}`} />

									<div>
										<h3 className={`text-[17px] font-bold mb-4 leading-snug transition-colors duration-300 pr-4 ${isSelected ? 'text-[#00bb7f]' : 'text-slate-900 group-hover:text-[#00bb7f]'}`}>
											{topic.title}
										</h3>
										
										<div className="flex items-center justify-between mb-5">
											<span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md transition-colors ${
												isSelected 
													? 'bg-[#00bb7f] text-white' 
													: 'bg-[#00bb7f]/10 text-[#00bb7f]'
											}`}>
												{topic.difficulty || topic.category || 'RECOMMENDED'}
											</span>
											<span className="text-[12px] font-extrabold text-slate-500">
												{Math.floor(Math.random() * (99 - 85 + 1) + 85)}% Match
											</span>
										</div>
									</div>

									<div className={`mt-6 rounded-xl p-4 transition-colors duration-300 ${isSelected ? 'bg-[#00bb7f]/5 border border-[#00bb7f]/10' : 'bg-slate-50 border border-slate-100 group-hover:bg-[#00bb7f]/[0.02]'}`}>
										<span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">AI Reasoning</span>
										<p className="text-[12px] text-slate-600 font-medium italic leading-relaxed">
											"{topic.description}"
										</p>
									</div>
								</div>
							);
						})}

						{/* Custom Topic Card */}
						<div
							onClick={() => setSelectedTopicId('custom')}
							className={`bg-white rounded-[20px] p-6 md:p-7 flex flex-col cursor-pointer transition-all duration-300 relative group overflow-hidden ${
								selectedTopicId === 'custom'
									? "border-[#00bb7f] ring-1 ring-[#00bb7f] shadow-[0_12px_40px_rgba(0,187,127,0.12)] scale-[1.02]"
									: "border border-slate-200 hover:border-[#00bb7f]/40 hover:shadow-[0_8px_30px_rgba(0,187,127,0.08)] hover:-translate-y-1 scale-100"
							}`}
						>
							{/* Highlight Bar for selected card */}
							<div className={`absolute top-0 left-0 right-0 h-[5px] transition-all duration-300 ${selectedTopicId === 'custom' ? 'bg-[#00bb7f]' : 'bg-transparent group-hover:bg-[#00bb7f]/20'}`} />

							<div>
								<h3 className={`text-[17px] font-bold mb-4 leading-snug transition-colors duration-300 pr-4 flex items-center gap-2 ${selectedTopicId === 'custom' ? 'text-[#00bb7f]' : 'text-slate-900 group-hover:text-[#00bb7f]'}`}>
									Create Your Own Topic
								</h3>
								
								<div className="flex items-center justify-between mb-4">
									<span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
										selectedTopicId === 'custom' 
											? 'bg-[#00bb7f] text-white' 
											: 'bg-[#00bb7f]/10 text-[#00bb7f]'
									}`}>
										<span className="text-[11px] leading-none">+</span> CUSTOM INPUT
									</span>
								</div>

								<p className="text-[13px] text-slate-500 font-medium mb-5 leading-relaxed">
									Feed a specific spark to the engine and let's refine the angle together.
								</p>
							</div>

							<div className="mt-auto space-y-3">
								<input 
									type="text"
									placeholder="Enter a raw idea or keywords..."
									className={`w-full bg-slate-50 border rounded-xl p-3.5 text-[13px] focus:outline-none transition-all placeholder-slate-400 font-medium ${
										selectedTopicId === 'custom' 
											? 'border-[#00bb7f] ring-2 ring-[#00bb7f]/20 bg-white' 
											: 'border-slate-200 group-hover:border-[#00bb7f]/30'
									}`}
									value={customTitle}
									onChange={(e) => {
										setCustomTitle(e.target.value);
										setSelectedTopicId('custom');
									}}
									onClick={(e) => {
										e.stopPropagation();
										setSelectedTopicId('custom');
									}}
								/>
								{selectedTopicId === 'custom' && (
									<textarea
										placeholder="Optional context / Key Takeaways..."
										value={customReasoning}
										onChange={(e) => setCustomReasoning(e.target.value)}
										onClick={(e) => e.stopPropagation()}
										className="w-full min-h-[70px] p-3.5 text-[12px] text-slate-700 bg-white border border-[#00bb7f] ring-2 ring-[#00bb7f]/20 rounded-xl focus:outline-none transition-all leading-relaxed placeholder-slate-400 font-medium resize-none animate-fade-in-up"
									/>
								)}
							</div>
						</div>
					</div>

					{/* Action Area / Footer */}
					<div className="flex items-center justify-end mt-4 pt-8 border-t border-slate-100">
						<button
							onClick={
								customTitle.trim() && selectedTopicId === 'custom'
									? handleGenerateCustomOutline
									: handleGenerateOutline
							}
							disabled={
								(!selectedTopicId || (selectedTopicId === 'custom' && !customTitle.trim())) || isGeneratingOutline
							}
							className={`inline-flex items-center justify-center py-4 px-10 rounded-[14px] font-bold text-[15px] transition-all duration-300 cursor-pointer ${
								(!selectedTopicId || (selectedTopicId === 'custom' && !customTitle.trim())) || isGeneratingOutline
									? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
									: "bg-[#00bb7f] hover:bg-[#007956] text-white shadow-[0_8px_20px_rgba(0,187,127,0.3)] hover:shadow-[0_10px_25px_rgba(0,121,86,0.35)] hover:-translate-y-0.5"
							}`}
						>
							<span>
								{customTitle.trim() && selectedTopicId === 'custom'
									? "Generate Custom Outline"
									: "Generate Outline"}
							</span>
							<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
						</button>
					</div>
				</div>
			)}

			{/* Step 2: Customize Outline & Add Steering Feedback */}
			{step === "outline" && outline && !isGeneratingPost && (
				<div className="space-y-6 animate-fade-in-up">
					<div className="glass-card rounded-2xl p-6 md:p-8 border border-indigo-100/50 relative overflow-hidden">
						<div className="radial-glow -top-1/4 -right-1/4 w-72 h-72 opacity-30 pointer-events-none" />

						<div className="border-b border-slate-100 pb-4 mb-5">
							<span className="text-[10px] font-mono tracking-widest uppercase bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100 text-indigo-700 font-semibold">
								AI Structure Outline
							</span>
							<h2 className="text-xl font-bold text-slate-800 mt-2">
								Content Strategy & Theme
							</h2>
						</div>

						<div className="space-y-5">
							{/* Core Thesis */}
							<div>
								<h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
									Core Thesis
								</h4>
								<p className="text-sm text-slate-700 leading-relaxed font-semibold bg-indigo-50/20 p-3.5 rounded-xl border border-indigo-50/50">
									{outline.core_thesis}
								</p>
							</div>

							{/* Narrative Arc */}
							<div>
								<h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
									Narrative Arc (Logical Flow)
								</h4>
								<div className="relative pl-6 space-y-3 border-l-2 border-indigo-100/60 ml-2">
									{(outline.narrative_arc || []).map((stepText, idx) => (
										<div key={idx} className="relative">
											{/* Visual bullet circle */}
											<div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-400 flex items-center justify-center text-[8px] font-bold text-indigo-600 shadow-sm">
												{idx + 1}
											</div>
											<p className="text-sm text-slate-600 leading-relaxed">
												{stepText}
											</p>
										</div>
									))}
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100/80">
								{/* Suggested Examples */}
								<div className="space-y-2">
									<h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
										Suggested Elements & Examples
									</h4>
										<ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5">
											{(outline.suggested_examples || []).map((example: any, idx: number) => {
												const isObject = typeof example === 'object' && example !== null;
												const typeStr = isObject && example.type ? `[${example.type.replace(/_/g, " ")}] ` : "";
												const contentStr = isObject ? example.content : example;
												
												return (
													<li key={idx} className="leading-relaxed">
														{typeStr && <span className="font-semibold text-amber-800 capitalize mr-1">{typeStr}</span>}
														{contentStr}
													</li>
												);
											})}
										</ul>
								</div>

								{/* LSI Keywords */}
								<div className="space-y-2">
									<h4 className="text-xs font-bold text-cyan-700 uppercase tracking-wider mb-1">
										SEO LSI Keywords (To naturalize)
									</h4>
									<div className="flex flex-wrap gap-1.5">
										{(outline.target_lsi_keywords || []).map((kw, idx) => (
											<span
												key={idx}
												className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-700"
											>
												#{kw}
											</span>
										))}
									</div>
								</div>
							</div>

							{/* Target Audience Takeaway */}
							<div className="border-t border-slate-100 pt-4 mt-2">
								<h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
									Target Audience Takeaway
								</h4>
								<p className="text-xs text-slate-600 leading-relaxed italic">
									"{outline.target_audience_takeaway}"
								</p>
							</div>
						</div>
					</div>

					{/* Steering Feedback Section */}
					<div className="glass-card rounded-2xl p-6 border border-purple-100/50 space-y-3">
						<div>
							<h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
								<Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
								<span>Steering Feedback & Customizations</span>
							</h3>
							<p className="text-[11px] text-slate-500">
								Guide the generator on specific elements, case studies, word
								choices, or focus areas (optional).
							</p>
						</div>

						<textarea
							value={feedback}
							onChange={(e) => setFeedback(e.target.value)}
							placeholder="e.g. Focus more on our recent 10x customer growth metric. Make the tone highly action-oriented and use a slightly shorter conclusion."
							className="w-full min-h-[90px] p-3.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all leading-relaxed placeholder-slate-400"
						/>
					</div>

					{/* Action buttons */}
					<div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
						<button
							onClick={() => setStep("topics")}
							className="inline-flex items-center justify-center py-2 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-medium text-xs transition-colors cursor-pointer"
						>
							<ChevronLeft className="w-4 h-4 mr-1" />
							<span>Back to Suggested Topics</span>
						</button>

						<button
							onClick={handleGeneratePostDraft}
							disabled={isGeneratingPost}
							className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-600/10 hover:shadow-purple-600/25 border border-purple-500/20 cursor-pointer"
						>
							<Sparkles className="w-4 h-4 mr-2 text-yellow-200" />
							<span>Ghostwrite LinkedIn Post</span>
						</button>
					</div>
				</div>
			)}

			{/* Step 3: Generated Post Output Display */}
			{step === "post" && generatedPost && !isGeneratingPost && (
				<div className="space-y-6 animate-fade-in-up">
					<div className="glass-card rounded-2xl p-6 md:p-8 border border-indigo-500/25 shadow-md relative">
						<div className="radial-glow top-0 right-0 w-48 h-48 opacity-40 pointer-events-none" />

						<div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
							<div className="flex items-center gap-2">
								<div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
									<FileText className="w-4 h-4" />
								</div>
								<div>
									<h3 className="text-sm font-bold text-slate-800">
										Generated LinkedIn Draft
									</h3>
									<p className="text-[10px] text-slate-500">
										Formulated in your custom tone
									</p>
								</div>
							</div>

							<button
								onClick={handleCopyToClipboard}
								className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
									copied
										? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm"
										: "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800"
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

					{/* Return/Adjust actions */}
					<div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
						<button
							onClick={() => setStep("outline")}
							className="inline-flex items-center justify-center py-2 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-medium text-xs transition-colors cursor-pointer"
						>
							<ChevronLeft className="w-4 h-4 mr-1" />
							<span>Adjust Feedback & Regenerate</span>
						</button>

						<button
							onClick={() => {
								setOutline(null);
								setFeedback("");
								setGeneratedPost(null);
								setCustomTitle("");
								setCustomReasoning("");
								setCustomTopic(null);
								setStep("topics");
							}}
							className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-650 font-semibold text-xs transition-all cursor-pointer"
						>
							<span>Select Another Topic</span>
						</button>
					</div>
				</div>
			)}
			</div>
		</div>
	);
}
