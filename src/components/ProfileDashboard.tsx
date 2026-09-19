import { useState } from "react";
import {
	Edit2,
	Check,
	X,
	Cpu,
	Database,
	Lightbulb,
	AlignLeft,
	Anchor,
	Edit3,
	ListTree,
	Smile,
	Tag,
	Zap,
	ChevronDown,
} from "lucide-react";
import TrainingData from "./TrainingData";

export interface DnaField<T> {
	value: T;
	reasoning: string;
	confidence: number;
}

export interface WritingProfile {
	tone: DnaField<string>;
	topic: DnaField<string[]>;
	avg_words: DnaField<number>;
	hoop_type: DnaField<string>;
	writing_type: DnaField<string>;
	paragraph_size: DnaField<string>;
	emoji_frequency: DnaField<string>;
	target_audience: DnaField<string>;

	// Mapped UI properties
	personaName: string;
	personaDescription: string;
}

interface ProfileDashboardProps {
	profile: WritingProfile;
	onUpdateProfile: (updated: WritingProfile) => void;
	onReset: () => void;
	onProceedToTopics: () => void;
	onRegenerateDNA: () => void;
}

export default function ProfileDashboard({
	profile,
	onUpdateProfile,
	onReset,
	onProceedToTopics,
	onRegenerateDNA,
}: ProfileDashboardProps) {
	const [activeTab, setActiveTab] = useState<"dna" | "training">("dna");
	const [isEditing, setIsEditing] = useState(false);
	const [editedProfile, setEditedProfile] = useState<WritingProfile>({
		...profile,
	});

	const handleSave = () => {
		// Compute fresh persona name based on updated fields
		const wType = (editedProfile.writing_type.value || "").toLowerCase();
		const toneVal = (editedProfile.tone.value || "").toLowerCase();
		let personaName = "The Technical Storyteller";
		if (wType.includes("inform") || wType.includes("educat")) {
			personaName = "The Authority Educator";
		} else if (toneVal.includes("bold") || toneVal.includes("assert")) {
			personaName = "The Bold Thought Leader";
		} else if (toneVal.includes("convers") || toneVal.includes("friend")) {
			personaName = "The Conversational Networker";
		}

		const updated = {
			...editedProfile,
			personaName,
			personaDescription: editedProfile.writing_type.reasoning,
		};
		onUpdateProfile(updated);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedProfile({ ...profile });
		setIsEditing(false);
	};

	const renderConfidence = (score: number) => {
		const pct = Math.round(score * 100);
		return (
			<div className="flex flex-col items-end">
				<span className="text-[9px] font-extrabold tracking-widest uppercase text-slate-400 mb-1">
					Confidence
				</span>
				<span className="text-[11px] font-bold text-[#5B5BFF] bg-[#5B5BFF]/10 px-2 py-0.5 rounded-md">
					{pct}%
				</span>
			</div>
		);
	};

	return (
		<div className="relative w-full h-full min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#f4fcf8] to-[#00bb7f]/20">
			<div className="relative max-w-[1200px] mx-auto px-6 py-12 z-10 animate-fade-in-up">
			
			{/* Header Area */}
			<div className="flex flex-col lg:flex-row lg:items-start justify-between mb-10 gap-6">
				<div className="flex-1">
					<h1 className="text-[32px] md:text-[38px] font-extrabold text-[#0f172a] tracking-tight mb-3">
						Writing Profile DNA
					</h1>
					<p className="text-[15px] text-slate-500 max-w-2xl font-medium leading-relaxed mb-6">
						Your unique linguistic fingerprint extracted from your recent publications. This profile guides every AI generation to maintain consistency.
					</p>

					<div className="flex bg-white border border-slate-200 p-1 rounded-xl w-fit shadow-sm">
						<button
							onClick={() => setActiveTab('dna')}
							className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
								activeTab === 'dna' 
									? 'bg-[#00bb7f]/10 text-[#007956]' 
									: 'text-slate-500 hover:text-slate-700'
							}`}
						>
							<Cpu className="w-4 h-4" />
							DNA Overview
						</button>
						<button
							onClick={() => setActiveTab('training')}
							className={`px-5 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
								activeTab === 'training' 
									? 'bg-[#00bb7f]/10 text-[#007956]' 
									: 'text-slate-500 hover:text-slate-700'
							}`}
						>
							<Database className="w-4 h-4" />
							Training Data
						</button>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					{!isEditing ? (
						<button
							onClick={() => setIsEditing(true)}
							className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-[13px] font-bold transition-all shadow-sm cursor-pointer"
						>
							<Edit2 className="w-4 h-4 mr-2 text-slate-500" />
							Edit Profile
						</button>
					) : (
						<>
							<button
								onClick={handleSave}
								className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#00bb7f] text-white text-[13px] font-bold transition-all shadow-md hover:bg-[#007956] cursor-pointer"
							>
								<Check className="w-4 h-4 mr-2" />
								Save Changes
							</button>
							<button
								onClick={handleCancel}
								className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[13px] font-bold transition-all shadow-sm cursor-pointer"
							>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</button>
						</>
					)}
				</div>
			</div>

			{activeTab === 'training' ? (
				<TrainingData onRegenerateDNA={onRegenerateDNA} />
			) : (
				<>
					{/* Grid of 6 Main Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
						
						{/* 1. Primary Tone */}
						<div className="bg-white border border-slate-200 rounded-[16px] p-6 lg:p-7 shadow-sm hover:shadow-md hover:border-[#00bb7f]/20 transition-all flex flex-col justify-between">
							<div>
								<div className="flex justify-between items-start mb-6">
									<div className="w-10 h-10 rounded-[10px] bg-indigo-50 flex items-center justify-center text-indigo-500">
										<Lightbulb className="w-5 h-5" />
									</div>
									{renderConfidence(isEditing ? editedProfile.tone.confidence : profile.tone.confidence)}
								</div>

								<span className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-1 block">
									Primary Tone
								</span>
								<div className="relative mb-5">
									<h3 className={`text-[20px] leading-tight font-extrabold text-[#0f172a] capitalize max-w-full ${isEditing ? 'flex items-center' : ''}`}>
										{isEditing ? (
											<span className="border-b border-dashed border-[#00bb7f] flex items-center gap-1 max-w-full">
												<span className="truncate block">{editedProfile.tone.value}</span>
												<ChevronDown className="w-3 h-3 text-[#00bb7f] flex-shrink-0" />
											</span>
										) : (
											<span>{profile.tone.value}</span>
										)}
									</h3>
									{isEditing && (
										<select
											value={editedProfile.tone.value?.toLowerCase()}
											onChange={(e) => setEditedProfile({ ...editedProfile, tone: { ...editedProfile.tone, value: e.target.value }})}
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										>
											{editedProfile.tone.value && !["conversational", "authoritative", "bold", "informative", "inspirational", "humorous", "analytical", "empathetic"].includes(editedProfile.tone.value.toLowerCase()) && (
												<option value={editedProfile.tone.value.toLowerCase()}>{editedProfile.tone.value}</option>
											)}
											<option value="conversational">Conversational</option>
											<option value="authoritative">Authoritative</option>
											<option value="bold">Bold / Contrarian</option>
											<option value="informative">Informative</option>
											<option value="inspirational">Inspirational</option>
											<option value="humorous">Humorous / Witty</option>
											<option value="analytical">Analytical</option>
											<option value="empathetic">Empathetic & Authoritative</option>
										</select>
									)}
								</div>
							</div>
							
							<div>
								<span className="text-[12px] font-bold text-slate-800 block mb-1">Reasoning:</span>
								<p 
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => isEditing && setEditedProfile({...editedProfile, tone: {...editedProfile.tone, reasoning: e.currentTarget.innerText}})}
									className={`text-[13.5px] text-slate-600 leading-relaxed outline-none transition-colors ${isEditing ? 'border-b border-dashed border-[#00bb7f] focus:bg-slate-50' : ''}`}
								>
									{isEditing ? editedProfile.tone.reasoning : profile.tone.reasoning}
								</p>
							</div>
						</div>

						{/* 2. Average Length */}
						<div className="bg-white border border-slate-200 rounded-[16px] p-6 lg:p-7 shadow-sm hover:shadow-md hover:border-[#00bb7f]/20 transition-all flex flex-col justify-between">
							<div>
								<div className="flex justify-between items-start mb-6">
									<div className="w-10 h-10 rounded-[10px] bg-purple-50 flex items-center justify-center text-purple-500">
										<AlignLeft className="w-5 h-5" />
									</div>
									{renderConfidence(isEditing ? editedProfile.avg_words.confidence : profile.avg_words.confidence)}
								</div>

								<span className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-1 block">
									Average Length
								</span>
								<div className="relative mb-5">
									<h3 className={`text-[20px] leading-tight font-extrabold text-[#0f172a] capitalize max-w-full ${isEditing ? 'flex items-center' : ''}`}>
										{isEditing ? (
											<span className="border-b border-dashed border-[#00bb7f] flex items-center gap-1 max-w-full">
												<span className="truncate block">{editedProfile.avg_words.value} Words</span>
												<ChevronDown className="w-3 h-3 text-[#00bb7f] flex-shrink-0" />
											</span>
										) : (
											<span>{profile.avg_words.value} Words</span>
										)}
									</h3>
									{isEditing && (
										<select
											value={editedProfile.avg_words.value}
											onChange={(e) => setEditedProfile({...editedProfile, avg_words: { ...editedProfile.avg_words, value: parseInt(e.target.value) || 200 }})}
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										>
											{editedProfile.avg_words.value && ![100, 150, 200, 250, 300, 350, 400, 450, 500, 1240].includes(editedProfile.avg_words.value) && (
												<option value={editedProfile.avg_words.value}>{editedProfile.avg_words.value}</option>
											)}
											<option value={100}>100</option>
											<option value={200}>200</option>
											<option value={300}>300</option>
											<option value={400}>400</option>
											<option value={500}>500</option>
											<option value={1240}>1,240</option>
										</select>
									)}
								</div>
							</div>
							
							<div>
								<span className="text-[12px] font-bold text-slate-800 block mb-1">Reasoning:</span>
								<p 
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => isEditing && setEditedProfile({...editedProfile, avg_words: {...editedProfile.avg_words, reasoning: e.currentTarget.innerText}})}
									className={`text-[13.5px] text-slate-600 leading-relaxed outline-none transition-colors ${isEditing ? 'border-b border-dashed border-[#00bb7f] focus:bg-slate-50' : ''}`}
								>
									{isEditing ? editedProfile.avg_words.reasoning : profile.avg_words.reasoning}
								</p>
							</div>
						</div>

						{/* 3. Primary Hook */}
						<div className="bg-white border border-slate-200 rounded-[16px] p-6 lg:p-7 shadow-sm hover:shadow-md hover:border-[#00bb7f]/20 transition-all flex flex-col justify-between overflow-hidden">
							<div>
								<div className="flex justify-between items-start mb-6">
									<div className="w-10 h-10 rounded-[10px] bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
										<Anchor className="w-5 h-5" />
									</div>
									{renderConfidence(isEditing ? editedProfile.hoop_type.confidence : profile.hoop_type.confidence)}
								</div>

								<span className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-1 block">
									Primary Hook
								</span>
								<div className="relative mb-5">
									<h3 className={`text-[20px] leading-tight font-extrabold text-[#0f172a] capitalize max-w-full ${isEditing ? 'flex items-center' : ''}`}>
										{isEditing ? (
											<span className="border-b border-dashed border-[#00bb7f] flex items-center gap-1 max-w-full">
												<span className="truncate block">{editedProfile.hoop_type.value}</span>
												<ChevronDown className="w-3 h-3 text-[#00bb7f] flex-shrink-0" />
											</span>
										) : (
											<span>{profile.hoop_type.value}</span>
										)}
									</h3>
									{isEditing && (
										<select
											value={editedProfile.hoop_type.value?.toLowerCase()}
											onChange={(e) => setEditedProfile({...editedProfile, hoop_type: { ...editedProfile.hoop_type, value: e.target.value }})}
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										>
											{editedProfile.hoop_type.value && !["stat/metric", "question", "contrarian", "story/anecdote", "list/framework", "pain point", "bold claim", "the contradiction"].includes(editedProfile.hoop_type.value.toLowerCase()) && (
												<option value={editedProfile.hoop_type.value.toLowerCase()}>{editedProfile.hoop_type.value}</option>
											)}
											<option value="stat/metric">Stat / Metric</option>
											<option value="question">Question</option>
											<option value="contrarian">Contrarian Statement</option>
											<option value="the contradiction">The Contradiction</option>
											<option value="story/anecdote">Story / Anecdote</option>
											<option value="list/framework">List / Framework</option>
											<option value="pain point">Pain Point</option>
										</select>
									)}
								</div>
							</div>
							
							<div>
								<span className="text-[12px] font-bold text-slate-800 block mb-1">Reasoning:</span>
								<p 
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => isEditing && setEditedProfile({...editedProfile, hoop_type: {...editedProfile.hoop_type, reasoning: e.currentTarget.innerText}})}
									className={`text-[13.5px] text-slate-600 leading-relaxed outline-none transition-colors ${isEditing ? 'border-b border-dashed border-[#00bb7f] focus:bg-slate-50' : ''}`}
								>
									{isEditing ? editedProfile.hoop_type.reasoning : profile.hoop_type.reasoning}
								</p>
							</div>
						</div>

						{/* 4. Writing Style */}
						<div className="bg-white border border-slate-200 rounded-[16px] p-6 lg:p-7 shadow-sm hover:shadow-md hover:border-[#00bb7f]/20 transition-all flex flex-col justify-between overflow-hidden">
							<div>
								<div className="flex justify-between items-start mb-6">
									<div className="w-10 h-10 rounded-[10px] bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
										<Edit3 className="w-5 h-5" />
									</div>
									{renderConfidence(isEditing ? editedProfile.writing_type.confidence : profile.writing_type.confidence)}
								</div>

								<span className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-1 block">
									Writing Style
								</span>
								<div className="relative mb-5">
									<h3 className={`text-[20px] leading-tight font-extrabold text-[#0f172a] capitalize max-w-full ${isEditing ? 'flex items-center' : ''}`}>
										{isEditing ? (
											<span className="border-b border-dashed border-[#00bb7f] flex items-center gap-1 max-w-full">
												<span className="truncate block">{editedProfile.writing_type.value}</span>
												<ChevronDown className="w-3 h-3 text-[#00bb7f] flex-shrink-0" />
											</span>
										) : (
											<span>{profile.writing_type.value}</span>
										)}
									</h3>
									{isEditing && (
										<select
											value={editedProfile.writing_type.value?.toLowerCase()}
											onChange={(e) => setEditedProfile({...editedProfile, writing_type: { ...editedProfile.writing_type, value: e.target.value }})}
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										>
											{editedProfile.writing_type.value && !["listicle", "storytelling", "thought leadership", "case study", "educational narrative", "contrarian"].includes(editedProfile.writing_type.value.toLowerCase()) && (
												<option value={editedProfile.writing_type.value.toLowerCase()}>{editedProfile.writing_type.value}</option>
											)}
											<option value="listicle">Listicle</option>
											<option value="storytelling">Storytelling</option>
											<option value="educational narrative">Educational Narrative</option>
											<option value="thought leadership">Thought Leadership</option>
											<option value="case study">Case Study</option>
											<option value="contrarian">Contrarian</option>
										</select>
									)}
								</div>
							</div>
							
							<div>
								<span className="text-[12px] font-bold text-slate-800 block mb-1">Reasoning:</span>
								<p 
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => isEditing && setEditedProfile({...editedProfile, writing_type: {...editedProfile.writing_type, reasoning: e.currentTarget.innerText}})}
									className={`text-[13.5px] text-slate-600 leading-relaxed outline-none transition-colors ${isEditing ? 'border-b border-dashed border-[#00bb7f] focus:bg-slate-50' : ''}`}
								>
									{isEditing ? editedProfile.writing_type.reasoning : profile.writing_type.reasoning}
								</p>
							</div>
						</div>

						{/* 5. Paragraph Density */}
						<div className="bg-white border border-slate-200 rounded-[16px] p-6 lg:p-7 shadow-sm hover:shadow-md hover:border-[#00bb7f]/20 transition-all flex flex-col justify-between overflow-hidden">
							<div>
								<div className="flex justify-between items-start mb-6">
									<div className="w-10 h-10 rounded-[10px] bg-sky-50 flex items-center justify-center text-sky-500 flex-shrink-0">
										<ListTree className="w-5 h-5" />
									</div>
									{renderConfidence(isEditing ? editedProfile.paragraph_size.confidence : profile.paragraph_size.confidence)}
								</div>

								<span className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-1 block">
									Paragraph Density
								</span>
								<div className="relative mb-5">
									<h3 className={`text-[20px] leading-tight font-extrabold text-[#0f172a] capitalize max-w-full ${isEditing ? 'flex items-center' : ''}`}>
										{isEditing ? (
											<span className="border-b border-dashed border-[#00bb7f] flex items-center gap-1 max-w-full">
												<span className="truncate block">{editedProfile.paragraph_size.value}</span>
												<ChevronDown className="w-3 h-3 text-[#00bb7f] flex-shrink-0" />
											</span>
										) : (
											<span>{profile.paragraph_size.value}</span>
										)}
									</h3>
									{isEditing && (
										<select
											value={editedProfile.paragraph_size.value?.toLowerCase()}
											onChange={(e) => setEditedProfile({...editedProfile, paragraph_size: { ...editedProfile.paragraph_size, value: e.target.value }})}
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										>
											{editedProfile.paragraph_size.value && !["short & scannable", "short", "medium", "long", "variable"].includes(editedProfile.paragraph_size.value.toLowerCase()) && (
												<option value={editedProfile.paragraph_size.value.toLowerCase()}>{editedProfile.paragraph_size.value}</option>
											)}
											<option value="short & scannable">Short & Scannable</option>
											<option value="short">Short</option>
											<option value="medium">Medium</option>
											<option value="long">Long</option>
											<option value="variable">Variable</option>
										</select>
									)}
								</div>
							</div>
							
							<div>
								<span className="text-[12px] font-bold text-slate-800 block mb-1">Reasoning:</span>
								<p 
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => isEditing && setEditedProfile({...editedProfile, paragraph_size: {...editedProfile.paragraph_size, reasoning: e.currentTarget.innerText}})}
									className={`text-[13.5px] text-slate-600 leading-relaxed outline-none transition-colors ${isEditing ? 'border-b border-dashed border-[#00bb7f] focus:bg-slate-50' : ''}`}
								>
									{isEditing ? editedProfile.paragraph_size.reasoning : profile.paragraph_size.reasoning}
								</p>
							</div>
						</div>

						{/* 6. Visual Cues */}
						<div className="bg-white border border-slate-200 rounded-[16px] p-6 lg:p-7 shadow-sm hover:shadow-md hover:border-[#00bb7f]/20 transition-all flex flex-col justify-between overflow-hidden">
							<div>
								<div className="flex justify-between items-start mb-6">
									<div className="w-10 h-10 rounded-[10px] bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
										<Smile className="w-5 h-5" />
									</div>
									{renderConfidence(isEditing ? editedProfile.emoji_frequency.confidence : profile.emoji_frequency.confidence)}
								</div>

								<span className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-1 block">
									Visual Cues
								</span>
								<div className="relative mb-5">
									<h3 className={`text-[20px] leading-tight font-extrabold text-[#0f172a] capitalize max-w-full ${isEditing ? 'flex items-center' : ''}`}>
										{isEditing ? (
											<span className="border-b border-dashed border-[#00bb7f] flex items-center gap-1 max-w-full">
												<span className="truncate block">{editedProfile.emoji_frequency.value}</span>
												<ChevronDown className="w-3 h-3 text-[#00bb7f] flex-shrink-0" />
											</span>
										) : (
											<span>{profile.emoji_frequency.value}</span>
										)}
									</h3>
									{isEditing && (
										<select
											value={editedProfile.emoji_frequency.value?.toLowerCase()}
											onChange={(e) => setEditedProfile({...editedProfile, emoji_frequency: { ...editedProfile.emoji_frequency, value: e.target.value }})}
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										>
											{editedProfile.emoji_frequency.value && !["none", "low", "low (0.8 per 100w)", "medium", "high"].includes(editedProfile.emoji_frequency.value.toLowerCase()) && (
												<option value={editedProfile.emoji_frequency.value.toLowerCase()}>{editedProfile.emoji_frequency.value}</option>
											)}
											<option value="none">None</option>
											<option value="low">Low</option>
											<option value="low (0.8 per 100w)">Low (0.8 per 100w)</option>
											<option value="medium">Medium</option>
											<option value="high">High</option>
										</select>
									)}
								</div>
							</div>
							
							<div>
								<span className="text-[12px] font-bold text-slate-800 block mb-1">Reasoning:</span>
								<p 
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => isEditing && setEditedProfile({...editedProfile, emoji_frequency: {...editedProfile.emoji_frequency, reasoning: e.currentTarget.innerText}})}
									className={`text-[13.5px] text-slate-600 leading-relaxed outline-none transition-colors ${isEditing ? 'border-b border-dashed border-[#00bb7f] focus:bg-slate-50' : ''}`}
								>
									{isEditing ? editedProfile.emoji_frequency.reasoning : profile.emoji_frequency.reasoning}
								</p>
							</div>
						</div>
					</div>

					{/* 7. Topic Universe Wide Card */}
					<div className="bg-white border border-slate-200 rounded-[16px] p-6 lg:p-8 shadow-sm hover:shadow-md hover:border-[#00bb7f]/20 transition-all flex flex-col md:flex-row gap-8 relative overflow-hidden">
						
						{/* Absolute Positioned Confidence Score at extreme right */}
						<div className="absolute top-6 right-6 lg:top-8 lg:right-8 flex flex-col items-center">
							<span className="text-[9px] font-extrabold tracking-widest uppercase text-slate-400 mb-2">
								Confidence
							</span>
							<div className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#5B5BFF] text-[#5B5BFF] font-bold text-xs bg-[#5B5BFF]/5">
								{Math.round((isEditing ? editedProfile.topic.confidence : profile.topic.confidence) * 100)}%
							</div>
						</div>

						<div className="flex-1 pr-16 lg:pr-0">
							<div className="flex justify-between items-start mb-6">
								<div className="w-10 h-10 rounded-[10px] bg-slate-50 flex items-center justify-center text-slate-600">
									<Tag className="w-5 h-5 transform -rotate-90" />
								</div>
							</div>

							<span className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase mb-4 block">
								Topic Universe
							</span>
							
							<div className="flex flex-wrap gap-2.5">
								{(isEditing ? editedProfile.topic.value : profile.topic.value).map((topicItem, idx) => (
									<span
										key={idx}
										className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#5B5BFF]/10 text-[#5B5BFF] capitalize max-w-full flex items-center"
									>
										<span
											contentEditable={isEditing}
											suppressContentEditableWarning
											onBlur={(e) => {
												if (!isEditing) return;
												const newTopicValue = e.currentTarget.innerText.trim();
												const newTopics = [...editedProfile.topic.value];
												if (newTopicValue === '') {
													newTopics.splice(idx, 1);
												} else {
													newTopics[idx] = newTopicValue;
												}
												setEditedProfile({
													...editedProfile,
													topic: { ...editedProfile.topic, value: newTopics },
												});
											}}
											className={`focus:outline-none rounded px-1 -mx-1 truncate block max-w-full ${
												isEditing ? "border-b border-dashed border-[#5B5BFF] focus:bg-[#5B5BFF]/20 cursor-text" : ""
											}`}
										>
											{topicItem}
										</span>
									</span>
								))}
								{isEditing && (
									<span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 cursor-pointer">
										<span
											contentEditable
											suppressContentEditableWarning
											onBlur={(e) => {
												const val = e.currentTarget.innerText.trim();
												if (val !== '' && val !== '+ Add Topic') {
													setEditedProfile({
														...editedProfile,
														topic: {
															...editedProfile.topic,
															value: [...editedProfile.topic.value, val]
														}
													});
												}
												e.currentTarget.innerText = '+ Add Topic';
											}}
											onFocus={(e) => {
												if (e.currentTarget.innerText === '+ Add Topic') {
													e.currentTarget.innerText = '';
												}
											}}
											className="focus:outline-none"
										>
											+ Add Topic
										</span>
									</span>
								)}
							</div>
						</div>
						
						<div className="md:w-1/2 md:mt-16 pr-4 lg:pr-16">
							<span className="text-[12px] font-bold text-slate-800 block mb-1">Reasoning:</span>
							<p 
								contentEditable={isEditing}
								suppressContentEditableWarning
								onBlur={(e) => isEditing && setEditedProfile({...editedProfile, topic: {...editedProfile.topic, reasoning: e.currentTarget.innerText}})}
								className={`text-[13.5px] text-slate-600 leading-relaxed outline-none transition-colors ${isEditing ? 'border-b border-dashed border-[#00bb7f] focus:bg-slate-50' : ''}`}
							>
								{isEditing ? editedProfile.topic.reasoning : profile.topic.reasoning}
							</p>
						</div>
					</div>

					{/* Generate Content Ideas Button */}
					<div className="mt-12 flex justify-center pb-12">
						<button
							onClick={onProceedToTopics}
							className="inline-flex items-center justify-center py-4 px-10 rounded-xl bg-[#00bb7f] hover:bg-[#007956] text-white font-bold text-sm tracking-wide transition-all shadow-[0_8px_20px_rgba(0,187,127,0.3)] hover:shadow-[0_10px_25px_rgba(0,121,86,0.35)] cursor-pointer hover:-translate-y-0.5"
						>
							<Zap className="w-4 h-4 mr-2" />
							<span>Generate Content Ideas</span>
						</button>
					</div>
				</>
			)}
			</div>
		</div>
	);
}
