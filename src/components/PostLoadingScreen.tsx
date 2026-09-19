import { useState, useEffect } from "react";
import { Sparkles, PenTool, FileText } from "lucide-react";

const LOGS = [
	"Initializing Ghostwriter model...",
	"Adopting brand voice and tone...",
	"Structuring hooks and engagement points...",
	"Weaving narrative arc...",
	"Optimizing for LinkedIn algorithm...",
	"Polishing final draft..."
];

export default function PostLoadingScreen() {
	const [logIndex, setLogIndex] = useState(0);

	useEffect(() => {
		const logInterval = setInterval(() => {
			setLogIndex((p) => {
				if (p >= LOGS.length - 1) return p;
				return p + 1;
			});
		}, 1800);
		return () => clearInterval(logInterval);
	}, []);

	return (
		<div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-sans bg-white">
			<div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf6] via-[#e0f2fe] to-[#f5f3ff] opacity-40 -z-20 pointer-events-none" />

			<div className="relative z-10 w-full max-w-[800px] px-6 flex flex-col items-center animate-fade-in-up">
				<div className="relative w-24 h-24 mb-8">
					<div className="absolute inset-0 bg-[#00bb7f]/10 rounded-full animate-ping" />
					<div className="relative w-full h-full bg-white rounded-full shadow-[0_0_40px_rgba(0,187,127,0.2)] flex items-center justify-center border-2 border-[#00bb7f]/20">
						<PenTool className="w-10 h-10 text-[#00bb7f] animate-bounce" />
					</div>
				</div>

				<h1 className="text-[32px] md:text-[40px] font-extrabold text-slate-900 mb-4 tracking-tight text-center">
					Ghostwriting Your Post
				</h1>
				<p className="text-slate-500 font-medium mb-12 text-[16px] text-center max-w-xl">
					Translating the structured outline into a highly engaging, professional LinkedIn narrative.
				</p>

				<div className="w-full max-w-[450px] bg-white rounded-[20px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 min-h-[220px] relative flex flex-col justify-center">
					<div className="space-y-4">
						{LOGS.map((log, i) => {
							const isPast = i < logIndex;
							const isCurrent = i === logIndex;
							if (!isPast && !isCurrent) return null;

							return (
								<div key={i} className={`flex items-center gap-3 transition-all duration-500 ${isCurrent ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-2'}`}>
									{isCurrent ? (
										<Sparkles className="w-4 h-4 text-[#00bb7f] animate-spin" />
									) : (
										<FileText className="w-4 h-4 text-slate-400" />
									)}
									<span className={`text-[14px] font-medium ${isCurrent ? 'text-slate-800' : 'text-slate-500'}`}>
										{log}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
