import { useState } from "react";
import {
	Sparkles,
	Edit2,
	Check,
	X,
	Sliders,
	MessageSquare,
	Smile,
	FileSpreadsheet,
	LayoutList,
	RefreshCw,
	Cpu,
	Target,
} from "lucide-react";

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

	// Mapped UI properties
	personaName: string;
	personaDescription: string;
}

interface ProfileDashboardProps {
	profile: WritingProfile;
	onUpdateProfile: (updated: WritingProfile) => void;
	onReset: () => void;
	onProceedToTopics: () => void;
}

export default function ProfileDashboard({
	profile,
	onUpdateProfile,
	onReset,
	onProceedToTopics,
}: ProfileDashboardProps) {
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

	const renderConfidenceBadge = (score: number) => {
		const pct = Math.round(score * 100);
		let colorClass = "bg-emerald-50 border-emerald-100 text-emerald-700";
		if (score < 0.8 && score >= 0.6) {
			colorClass = "bg-amber-50 border-amber-100 text-amber-700";
		} else if (score < 0.6) {
			colorClass = "bg-rose-50 border-rose-100 text-rose-700";
		}

		return (
			<span
				className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}
			>
				<Cpu className="w-3 h-3 text-indigo-500" />
				<span>{pct}% AI Confidence</span>
			</span>
		);
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
					{/* <button
            onClick={onLogout}
            className="inline-flex items-center justify-center p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all text-xs cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log Out</span>
          </button> */}
				</div>
			</div>

			{/* Grid Layout */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				{/* Persona insight Card - Span 2 Columns */}
				<div className="glass-card rounded-2xl p-6 md:p-8 md:col-span-2 relative overflow-hidden flex flex-col justify-between">
					<div className="radial-glow -top-1/4 -right-1/4 w-72 h-72 opacity-50 pointer-events-none" />

					<div>
						<div className="flex flex-wrap items-center justify-between gap-2 mb-3">
							<div className="flex items-center gap-2">
								<Sparkles className="w-5 h-5 text-yellow-600 animate-pulse" />
								<span className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">
									AI Persona Classification
								</span>
							</div>
							{renderConfidenceBadge(isEditing ? editedProfile.writing_type.confidence : profile.writing_type.confidence)}
						</div>

						<h2 className="text-3xl font-black text-slate-800 tracking-tight mb-1">
							{isEditing ? editedProfile.personaName : profile.personaName}
						</h2>

						<div className="mb-3">
							<span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 uppercase tracking-wider">
								<Sparkles className="w-3 h-3 text-indigo-500" />
								<span>Paradigm: </span>
								<span
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => {
										if (!isEditing) return;
										const newType = e.currentTarget.innerText.trim();
										const toneVal = (editedProfile.tone.value || '').toLowerCase();
										let personaName = 'The Technical Storyteller';
										const wType = newType.toLowerCase();
										if (wType.includes('inform') || wType.includes('educat')) {
											personaName = 'The Authority Educator';
										} else if (toneVal.includes('bold') || toneVal.includes('assert')) {
											personaName = 'The Bold Thought Leader';
										} else if (toneVal.includes('convers') || toneVal.includes('friend')) {
											personaName = 'The Conversational Networker';
										}

										setEditedProfile({
											...editedProfile,
											writing_type: { ...editedProfile.writing_type, value: newType },
											personaName
										});
									}}
									className={`focus:outline-none rounded px-1 -mx-1 ${isEditing ? 'focus:bg-indigo-100/50 cursor-text hover:bg-indigo-100/30' : ''}`}
								>
									{isEditing ? editedProfile.writing_type.value : profile.writing_type.value}
								</span>
							</span>
						</div>

						<div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100/50 mt-1 transition-colors">
							<span className="block text-[9px] font-mono text-slate-400 uppercase mb-1">
								AI INSIGHT
							</span>
							<div
								contentEditable={isEditing}
								suppressContentEditableWarning
								onBlur={(e) => {
									if (!isEditing) return;
									setEditedProfile({
										...editedProfile,
										writing_type: {
											...editedProfile.writing_type,
											reasoning: e.currentTarget.innerText,
										},
									});
								}}
								className={`text-sm text-slate-600 leading-relaxed focus:outline-none rounded transition-colors ${
									isEditing
										? "focus:bg-slate-100/50 cursor-text hover:bg-slate-100/30 p-1 -m-1"
										: ""
								}`}
							>
								{isEditing ? editedProfile.writing_type.reasoning : profile.personaDescription}
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
						<span className="text-[10px] font-mono text-indigo-600 font-semibold uppercase tracking-wider">
							DNA Classification Active
						</span>
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
				<div className="glass-card rounded-2xl p-6 md:p-7 flex flex-col justify-between">
					<div>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
							<div className="flex items-center gap-2.5">
								<Sliders className="w-5 h-5 text-indigo-500" />
								<h3 className="text-base font-bold text-slate-800">
									Tone & Voice
								</h3>
							</div>
							{renderConfidenceBadge(isEditing ? editedProfile.tone.confidence : profile.tone.confidence)}
						</div>

						<div className="space-y-3">
							<div className="flex flex-wrap gap-1.5">
								<span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 capitalize">
									<span
										contentEditable={isEditing}
										suppressContentEditableWarning
										onBlur={(e) => {
											if (!isEditing) return;
											setEditedProfile({
												...editedProfile,
												tone: { ...editedProfile.tone, value: e.currentTarget.innerText.trim() },
											});
										}}
										className={`focus:outline-none rounded px-1 -mx-1 ${
											isEditing ? "focus:bg-indigo-100/50 cursor-text hover:bg-indigo-100/30" : ""
										}`}
									>
										{isEditing ? editedProfile.tone.value : profile.tone.value}
									</span>
								</span>
							</div>
							<div className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic mt-2 flex">
								<span className="select-none">"</span>
								<span
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => {
										if (!isEditing) return;
										setEditedProfile({
											...editedProfile,
											tone: {
												...editedProfile.tone,
												reasoning: e.currentTarget.innerText,
											},
										});
									}}
									className={`focus:outline-none rounded px-1 -mx-1 transition-colors w-full ${
										isEditing ? "focus:bg-slate-50/50 cursor-text hover:bg-slate-50/30" : ""
									}`}
								>
									{isEditing ? editedProfile.tone.reasoning : profile.tone.reasoning}
								</span>
								<span className="select-none">"</span>
							</div>
						</div>
					</div>
					<span className="text-[10px] font-mono text-slate-400 mt-5 border-t border-slate-50 pt-2.5 capitalize">
						Primary Tone: {isEditing ? editedProfile.tone.value : profile.tone.value}
					</span>
				</div>

				{/* 2. Hook Style card */}
				<div className="glass-card rounded-2xl p-6 md:p-7 flex flex-col justify-between">
					<div>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
							<div className="flex items-center gap-2.5">
								<MessageSquare className="w-5 h-5 text-purple-500" />
								<h3 className="text-base font-bold text-slate-800">
									Opening Hook Style
								</h3>
							</div>
							{renderConfidenceBadge(isEditing ? editedProfile.hoop_type.confidence : profile.hoop_type.confidence)}
						</div>

						<div className="space-y-3">
							<div className="flex flex-wrap gap-1.5">
								<span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 capitalize">
									<span
										contentEditable={isEditing}
										suppressContentEditableWarning
										onBlur={(e) => {
											if (!isEditing) return;
											setEditedProfile({
												...editedProfile,
												hoop_type: { ...editedProfile.hoop_type, value: e.currentTarget.innerText.trim() },
											});
										}}
										className={`focus:outline-none rounded px-1 -mx-1 ${
											isEditing ? "focus:bg-purple-100/50 cursor-text hover:bg-purple-100/30" : ""
										}`}
									>
										{isEditing ? editedProfile.hoop_type.value : profile.hoop_type.value}
									</span>
								</span>
							</div>
							<div className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic mt-2 flex">
								<span className="select-none">"</span>
								<span
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => {
										if (!isEditing) return;
										setEditedProfile({
											...editedProfile,
											hoop_type: {
												...editedProfile.hoop_type,
												reasoning: e.currentTarget.innerText,
											},
										});
									}}
									className={`focus:outline-none rounded px-1 -mx-1 transition-colors w-full ${
										isEditing ? "focus:bg-slate-50/50 cursor-text hover:bg-slate-50/30" : ""
									}`}
								>
									{isEditing ? editedProfile.hoop_type.reasoning : profile.hoop_type.reasoning}
								</span>
								<span className="select-none">"</span>
							</div>
						</div>
					</div>
					<span className="text-[10px] font-mono text-slate-400 mt-5 border-t border-slate-50 pt-2.5 capitalize">
						Hook Style: {isEditing ? editedProfile.hoop_type.value : profile.hoop_type.value}
					</span>
				</div>

				{/* 3. Core Niches & Topics */}
				<div className="glass-card rounded-2xl p-6 md:p-7 flex flex-col justify-between">
					<div>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
							<div className="flex items-center gap-2.5">
								<Target className="w-5 h-5 text-amber-500" />
								<h3 className="text-base font-bold text-slate-800">
									Core Niches & Topics
								</h3>
							</div>
							{renderConfidenceBadge(isEditing ? editedProfile.topic.confidence : profile.topic.confidence)}
						</div>

						<div className="space-y-3">
							<div className="flex flex-wrap gap-1.5">
								{(isEditing ? editedProfile.topic.value : profile.topic.value).map((topicItem, idx) => (
									<span
										key={idx}
										className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 capitalize"
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
											className={`focus:outline-none rounded px-1 -mx-1 ${
												isEditing ? "focus:bg-amber-100/50 cursor-text hover:bg-amber-100/30" : ""
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
							<div className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic mt-2 flex">
								<span className="select-none">"</span>
								<span
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => {
										if (!isEditing) return;
										setEditedProfile({
											...editedProfile,
											topic: {
												...editedProfile.topic,
												reasoning: e.currentTarget.innerText,
											},
										});
									}}
									className={`focus:outline-none rounded px-1 -mx-1 transition-colors w-full ${
										isEditing ? "focus:bg-slate-50/50 cursor-text hover:bg-slate-50/30" : ""
									}`}
								>
									{isEditing ? editedProfile.topic.reasoning : profile.topic.reasoning}
								</span>
								<span className="select-none">"</span>
							</div>
						</div>
					</div>
					<span className="text-[10px] font-mono text-slate-400 mt-5 border-t border-slate-50 pt-2.5 capitalize">
						Topics Detected: {isEditing ? editedProfile.topic.value.length : profile.topic.value.length}
					</span>
				</div>

				{/* 4. Average Word Count */}
				<div className="glass-card rounded-2xl p-6 md:p-7 flex flex-col justify-between">
					<div>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
							<div className="flex items-center gap-2.5">
								<FileSpreadsheet className="w-5 h-5 text-emerald-600" />
								<h3 className="text-base font-bold text-slate-800">
									Average Word Count
								</h3>
							</div>
							{renderConfidenceBadge(isEditing ? editedProfile.avg_words.confidence : profile.avg_words.confidence)}
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
								<span>Target Sizing</span>
								<span className="inline-flex items-center text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg font-mono">
									<span
										contentEditable={isEditing}
										suppressContentEditableWarning
										onBlur={(e) => {
											if (!isEditing) return;
											const val = parseInt(e.currentTarget.innerText) || 200;
											setEditedProfile({
												...editedProfile,
												avg_words: { ...editedProfile.avg_words, value: val }
											});
										}}
										className={`focus:outline-none rounded px-1 -mx-1 font-bold ${
											isEditing ? "focus:bg-emerald-100/50 cursor-text hover:bg-emerald-100/30" : ""
										}`}
									>
										{isEditing ? editedProfile.avg_words.value : profile.avg_words.value}
									</span>
									<span className="ml-1">words</span>
								</span>
							</div>
							<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-2">
								<div
									className="h-full bg-emerald-500 transition-all duration-300"
									style={{
										width: `${Math.min(((isEditing ? editedProfile.avg_words.value : profile.avg_words.value) / 400) * 100, 100)}%`,
									}}
								/>
							</div>
							<div className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic mt-2 flex">
								<span className="select-none">"</span>
								<span
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => {
										if (!isEditing) return;
										setEditedProfile({
											...editedProfile,
											avg_words: {
												...editedProfile.avg_words,
												reasoning: e.currentTarget.innerText,
											},
										});
									}}
									className={`focus:outline-none rounded px-1 -mx-1 transition-colors w-full ${
										isEditing ? "focus:bg-slate-50/50 cursor-text hover:bg-slate-50/30" : ""
									}`}
								>
									{isEditing ? editedProfile.avg_words.reasoning : profile.avg_words.reasoning}
								</span>
								<span className="select-none">"</span>
							</div>
						</div>
					</div>
					<span className="text-[10px] font-mono text-slate-400 mt-5 border-t border-slate-50 pt-2.5 capitalize">
						Word Count: {isEditing ? editedProfile.avg_words.value : profile.avg_words.value} words
					</span>
				</div>

				{/* 5. Emoji Frequency card */}
				<div className="glass-card rounded-2xl p-6 md:p-7 flex flex-col justify-between">
					<div>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
							<div className="flex items-center gap-2.5">
								<Smile className="w-5 h-5 text-purple-500" />
								<h3 className="text-base font-bold text-slate-800">
									Emoji Frequency
								</h3>
							</div>
							{renderConfidenceBadge(isEditing ? editedProfile.emoji_frequency.confidence : profile.emoji_frequency.confidence)}
						</div>

						<div className="space-y-3">
							<div className="flex flex-wrap gap-1.5">
								<span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 capitalize">
									{isEditing ? (
										<select
											value={editedProfile.emoji_frequency.value}
											onChange={(e) =>
												setEditedProfile({
													...editedProfile,
													emoji_frequency: {
														...editedProfile.emoji_frequency,
														value: e.target.value,
													},
												})
											}
											className="bg-transparent border-0 p-0 focus:ring-0 focus:outline-none text-xs font-bold text-indigo-700 capitalize cursor-pointer appearance-none outline-none"
										>
											<option value="high">High Frequency</option>
											<option value="moderate">Moderate Frequency</option>
											<option value="low">Low Frequency</option>
										</select>
									) : (
										<span>{profile.emoji_frequency.value} Frequency</span>
									)}
								</span>
							</div>
							<div className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic mt-2 flex">
								<span className="select-none">"</span>
								<span
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => {
										if (!isEditing) return;
										setEditedProfile({
											...editedProfile,
											emoji_frequency: {
												...editedProfile.emoji_frequency,
												reasoning: e.currentTarget.innerText,
											},
										});
									}}
									className={`focus:outline-none rounded px-1 -mx-1 transition-colors w-full ${
										isEditing ? "focus:bg-slate-50/50 cursor-text hover:bg-slate-50/30" : ""
									}`}
								>
									{isEditing ? editedProfile.emoji_frequency.reasoning : profile.emoji_frequency.reasoning}
								</span>
								<span className="select-none">"</span>
							</div>
						</div>
					</div>
					<span className="text-[10px] font-mono text-slate-400 mt-5 border-t border-slate-50 pt-2.5 capitalize">
						Emoji Level: {isEditing ? editedProfile.emoji_frequency.value : profile.emoji_frequency.value}
					</span>
				</div>

				{/* 6. Paragraph spacing card */}
				<div className="glass-card rounded-2xl p-6 md:p-7 flex flex-col justify-between">
					<div>
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
							<div className="flex items-center gap-2.5">
								<LayoutList className="w-5 h-5 text-cyan-600" />
								<h3 className="text-base font-bold text-slate-800">
									Paragraph Structure
								</h3>
							</div>
							{renderConfidenceBadge(isEditing ? editedProfile.paragraph_size.confidence : profile.paragraph_size.confidence)}
						</div>

						<div className="space-y-3">
							<div className="flex flex-wrap gap-1.5">
								<span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-700 capitalize">
									{isEditing ? (
										<select
											value={editedProfile.paragraph_size.value}
											onChange={(e) =>
												setEditedProfile({
													...editedProfile,
													paragraph_size: {
														...editedProfile.paragraph_size,
														value: e.target.value,
													},
												})
											}
											className="bg-transparent border-0 p-0 focus:ring-0 focus:outline-none text-xs font-bold text-cyan-700 capitalize cursor-pointer appearance-none outline-none"
										>
											<option value="short">Short paragraphs</option>
											<option value="medium">Medium paragraphs</option>
											<option value="long">Long paragraphs</option>
										</select>
									) : (
										<span>{profile.paragraph_size.value} paragraphs</span>
									)}
								</span>
							</div>
							<div className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic mt-2 flex">
								<span className="select-none">"</span>
								<span
									contentEditable={isEditing}
									suppressContentEditableWarning
									onBlur={(e) => {
										if (!isEditing) return;
										setEditedProfile({
											...editedProfile,
											paragraph_size: {
												...editedProfile.paragraph_size,
												reasoning: e.currentTarget.innerText,
											},
										});
									}}
									className={`focus:outline-none rounded px-1 -mx-1 transition-colors w-full ${
										isEditing ? "focus:bg-slate-50/50 cursor-text hover:bg-slate-50/30" : ""
									}`}
								>
									{isEditing ? editedProfile.paragraph_size.reasoning : profile.paragraph_size.reasoning}
								</span>
								<span className="select-none">"</span>
							</div>
						</div>
					</div>
					<span className="text-[10px] font-mono text-slate-400 mt-5 border-t border-slate-50 pt-2.5 capitalize">
						Paragraph Size: {isEditing ? editedProfile.paragraph_size.value : profile.paragraph_size.value}
					</span>
				</div>
			</div>

			{/* Trigger Button to Proceed to Topic Generator */}
			<div className="flex justify-center pt-2">
				<button
					onClick={onProceedToTopics}
					disabled={isEditing}
					className={`group inline-flex items-center justify-center py-4 px-10 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl border cursor-pointer ${
						isEditing
							? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none"
							: "bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-600 hover:to-purple-700 text-white shadow-purple-600/10 hover:shadow-purple-600/20 border-purple-500/20"
					}`}
				>
					<span>Unlock Content Ideas (Generate Topics)</span>
					<Sparkles className="w-5 h-5 ml-2 text-yellow-300 group-hover:animate-bounce" />
				</button>
			</div>
		</div>
	);
}
