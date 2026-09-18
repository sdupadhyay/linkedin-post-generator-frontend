import { useState, useEffect } from "react";

import { Layers } from "lucide-react";

const LOGS = [
	"Establishing Core Thesis...",
	"Mapping Narrative Arc...",
	"Formulating Audience Takeaways...",
	"Injecting LSI Keywords...",
	"Finalizing Blueprint Architecture..."
];

export default function OutlineLoadingScreen() {
	const [progress, setProgress] = useState(0);
	const [logIndex, setLogIndex] = useState(0);
	
	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((p) => {
				if (p >= 100) return 0; // Infinite loop
				return p + 0.6; // Speed of animation loop
			});
		}, 50);

		const logInterval = setInterval(() => {
			setLogIndex((p) => {
				if (p >= LOGS.length - 1) return 0;
				return p + 1;
			});
		}, 2000); // Terminal updates every 2 seconds

		return () => {
			clearInterval(interval);
			clearInterval(logInterval);
		};
	}, []);

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
				@keyframes shimmer {
					100% { transform: translateX(100%); }
				}
			`}</style>
			
			{/* Animated Shifting Gradient Background */}
			<div className="absolute inset-0 bg-animated-gradient -z-20 pointer-events-none" />

			<div className="relative z-10 w-full max-w-[1000px] px-6 flex flex-col items-center animate-fade-in-up">
				<div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#00bb7f]/10 mb-6">
					<Layers className="w-8 h-8 text-[#00bb7f] animate-pulse" />
				</div>
				<h1 className="text-[34px] md:text-[42px] font-extrabold text-[#00bb7f] mb-3 tracking-tight text-center">
					Architecting Content Blueprint
				</h1>
				<p className="text-slate-500 font-medium mb-12 text-[15px] text-center max-w-lg">
					Synthesizing your writing DNA with the selected topic angle to build a high-conversion structural outline.
				</p>

				{/* The Document Skeleton */}
				<div className="w-full max-w-[460px] bg-white rounded-[24px] p-8 shadow-[0_20px_60px_rgba(0,187,127,0.06)] border border-[#00bb7f]/15 relative overflow-hidden mb-12">
					{/* Animated Scanning Laser */}
					<div 
						className="absolute left-0 right-0 h-[2px] bg-[#00bb7f] shadow-[0_0_15px_3px_rgba(0,187,127,0.4)] z-20" 
						style={{ top: `${progress}%` }} 
					/>

					{/* Header Skeleton */}
					<div className="w-3/4 h-8 rounded-lg bg-slate-100 mb-10 overflow-hidden relative">
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
						{progress > 5 && <div className="absolute inset-0 bg-[#00bb7f]/10 animate-fade-in" />}
					</div>

					{/* Thesis Block */}
					<div className={`space-y-4 mb-10 transition-all duration-700 ${progress > 15 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
						<div className="w-1/3 h-3 rounded-full bg-[#00bb7f]/20 mb-5" />
						<div className="w-full h-3 rounded-full bg-slate-100" />
						<div className="w-full h-3 rounded-full bg-slate-100" />
						<div className="w-5/6 h-3 rounded-full bg-slate-100" />
					</div>

					{/* Narrative Arc Block */}
					<div className={`space-y-4 mb-10 transition-all duration-700 ${progress > 45 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
						<div className="w-1/3 h-3 rounded-full bg-[#00bb7f]/20 mb-5" />
						<div className="w-full h-3 rounded-full bg-slate-100" />
						<div className="w-4/5 h-3 rounded-full bg-slate-100" />
						<div className="w-[90%] h-3 rounded-full bg-slate-100" />
					</div>

					{/* Takeaways & Keywords (Bottom Grid) */}
					<div className={`flex gap-4 transition-all duration-700 ${progress > 75 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
						<div className="flex-1 h-24 rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
							<div className="w-1/2 h-2 rounded-full bg-slate-200" />
							<div className="w-3/4 h-2 rounded-full bg-slate-200" />
							<div className="w-full h-2 rounded-full bg-slate-200" />
						</div>
						<div className="flex-1 h-24 rounded-xl bg-[#00bb7f]/5 border border-[#00bb7f]/10 p-4 space-y-3">
							<div className="w-1/2 h-2 rounded-full bg-[#00bb7f]/30" />
							<div className="w-3/4 h-2 rounded-full bg-[#00bb7f]/20" />
							<div className="w-[85%] h-2 rounded-full bg-[#00bb7f]/20" />
						</div>
					</div>
				</div>

				{/* Terminal Logs Box */}
				<div className="w-full max-w-[500px] bg-white/70 backdrop-blur-xl border border-white rounded-[16px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-left flex flex-col justify-end min-h-[120px] relative overflow-hidden">
					<div className="space-y-3 font-mono text-[12px] md:text-[13px] relative z-10 w-full h-[50px]">
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
								bottomPos = '2rem';
								opacityClass = 'opacity-40 text-slate-500';
								transformClass = '-translate-y-2';
							} else if (logIndex === 0 && i === LOGS.length - 1) {
								isVisible = true;
								bottomPos = '2rem';
								opacityClass = 'opacity-40 text-slate-500';
								transformClass = '-translate-y-2';
							}
							
							return (
								<div 
									key={i} 
									className={`flex items-start gap-3 transition-all duration-700 ease-out absolute left-6 ${opacityClass} ${transformClass}`}
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