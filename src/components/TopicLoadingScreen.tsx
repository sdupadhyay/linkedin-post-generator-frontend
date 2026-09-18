import { useState, useEffect } from "react";

import { Cpu, Target, Sparkles } from "lucide-react";

const LOGS = [
	"Initializing multi-agent collaboration environment...",
	"Agent Alpha: Analyzing writing DNA matrix...",
	"Agent Beta: Filtering for high-engagement keywords...",
	"Agent Beta: Cross-referencing global tech news...",
	"Agent Gamma: Mapping syntactic structures...",
	"Agent Gamma: Generating personalized topic nodes...",
	"Finalizing topic universe..."
];

const AgentCard = ({ icon, name, task, barProgress }: any) => {
	const isActive = barProgress > 0;
	return (
		<div className={`w-full md:w-[260px] h-[200px] bg-white rounded-2xl p-7 flex flex-col items-center justify-between transition-all duration-700 ${isActive ? 'shadow-[0_10px_40px_rgba(0,187,127,0.12)] border border-[#00bb7f]/20 scale-105' : 'shadow-sm border border-slate-100 opacity-60 scale-100'}`}>
			<div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-[#00bb7f]/10 text-[#00bb7f]' : 'bg-slate-50 text-slate-400'}`}>
				{icon}
			</div>
			<div className="text-center w-full mt-4">
				<span className={`text-[9px] font-black tracking-widest uppercase mb-2 block transition-colors ${isActive ? 'text-[#00bb7f]' : 'text-slate-400'}`}>{name}</span>
				<p className={`text-[15px] font-bold leading-snug transition-colors ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{task}</p>
			</div>
			<div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-6">
				<div className="h-full bg-[#00bb7f] transition-all duration-100 ease-linear" style={{ width: `${barProgress}%` }} />
			</div>
		</div>
	);
};

export default function TopicLoadingScreen() {
	const [progress, setProgress] = useState(0);
	const [logIndex, setLogIndex] = useState(0);
	
	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((p) => {
				if (p >= 100) {
					return 0; // Infinite loop
				}
				return p + 0.6; // Slightly slower for a smoother loop
			});
		}, 50);

		const logInterval = setInterval(() => {
			setLogIndex((p) => {
				if (p >= LOGS.length - 1) {
					return 0; // Infinite loop
				}
				return p + 1;
			});
		}, 1400);

		return () => {
			clearInterval(interval);
			clearInterval(logInterval);
		};
	}, [LOGS.length]);

	const p1 = Math.min(Math.max((progress / 33) * 100, 0), 100);
	const p2 = Math.min(Math.max(((progress - 33) / 33) * 100, 0), 100);
	const p3 = Math.min(Math.max(((progress - 66) / 34) * 100, 0), 100);

	return (
		<div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-sans">
			<style>{`
				@keyframes gradientMove {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				.bg-animated-gradient {
					background: linear-gradient(-45deg, #f0fdf6, #e0f2fe, #f5f3ff, #f0fdf6);
					background-size: 400% 400%;
					animation: gradientMove 10s ease infinite;
				}
			`}</style>
			
			{/* Animated Shifting Gradient Background */}
			<div className="absolute inset-0 bg-animated-gradient -z-20 pointer-events-none" />

			<div className="relative z-10 w-full max-w-[1200px] px-6 flex flex-col items-center animate-fade-in-up">
				<h1 className="text-[38px] md:text-[46px] font-extrabold text-[#00bb7f] mb-3 tracking-tight text-center">
					Collaborating with Intelligence
				</h1>
				<p className="text-slate-500 font-medium mb-12 text-[16px] text-center max-w-xl">
					{logIndex < 2 ? "Contextualizing industry trends and your brand DNA..." : 
					 logIndex < 4 ? "Querying neural networks for novel intersection points..." : 
					 "Engineering high-engagement content architectures..."}
				</p>

				{/* Agent Cards Grid */}
				<div className="flex flex-col md:flex-row gap-6 mb-16 relative">
					{/* Connection Lines (Desktop only) */}
					<div className="hidden md:block absolute top-[100px] left-[200px] right-[200px] h-0.5 bg-slate-100 -z-10">
						<div className="h-full bg-[#00bb7f]/20 animate-[pulse_2s_ease-in-out_infinite]" />
					</div>

					<AgentCard 
						icon={<Cpu className="w-5 h-5" />}
						name="Agent Alpha"
						task="Analyzing DNA Profile"
						barProgress={p1}
					/>
					<AgentCard 
						icon={<Target className="w-5 h-5" />}
						name="Agent Beta"
						task="Trend Mapping"
						barProgress={p2}
					/>
					<AgentCard 
						icon={<Sparkles className="w-5 h-5" />}
						name="Agent Gamma"
						task="Topic Synthesis"
						barProgress={p3}
					/>
				</div>

				{/* Terminal Logs Box */}
				<div className="w-full max-w-[600px] bg-white/70 backdrop-blur-xl border border-white rounded-[20px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-left flex flex-col justify-end min-h-[140px] relative overflow-hidden">
					<div className="space-y-4 font-mono text-[13px] md:text-[14px] relative z-10 w-full h-[60px]">
						{LOGS.map((log, i) => {
							let isVisible = false;
							let bottomPos = '0rem';
							let opacityClass = 'opacity-0';
							let transformClass = 'translate-y-4';
							
							if (i === logIndex) {
								isVisible = true;
								bottomPos = '0rem';
								opacityClass = 'opacity-100 text-slate-800 font-semibold';
								transformClass = 'translate-y-0';
							} else if (i === logIndex - 1) {
								isVisible = true;
								bottomPos = '2.5rem';
								opacityClass = 'opacity-40 text-slate-500';
								transformClass = '-translate-y-2';
							} else if (logIndex === 0 && i === LOGS.length - 1) {
								isVisible = true;
								bottomPos = '2.5rem';
								opacityClass = 'opacity-40 text-slate-500';
								transformClass = '-translate-y-2';
							}
							
							return (
								<div 
									key={i} 
									className={`flex items-start gap-3 transition-all duration-700 ease-out absolute left-8 ${opacityClass} ${transformClass}`}
									style={{ 
										bottom: bottomPos,
										visibility: isVisible ? 'visible' : 'hidden',
										pointerEvents: 'none'
									}}
								>
									<span className="text-[#00bb7f] font-bold mt-0.5">&gt;</span>
									<span>{log}</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}