"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { problemsApi } from "@/lib/api-client";
import { handleApiError } from "@/lib/errors";
import type { Problem, Difficulty } from "@/types/api";

const topics = [
	{ label: "All Topics", icon: "🔍" },
	{ label: "Physics & Collision", icon: "💥" },
	{ label: "Vectors & Movement", icon: "🏹" },
	{ label: "Game Math", icon: "📐" },
	{ label: "Game Logic & State", icon: "🎲" },
];

const difficultyColor: Record<Difficulty, string> = {
	Easy: "#1ab274",
	"Med.": "#e9a01a",
	Hard: "#c84a4a",
};

const ProblemsPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTopic, setSelectedTopic] = useState("All Topics");
	const [problems, setProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		setError(null);

		problemsApi.getAll().then((response) => {
			if (!mounted) return;
			
			if (response.error) {
				setError(handleApiError(response.error));
			} else if (response.data) {
				setProblems(response.data.problems || []);
			}
			setLoading(false);
		});

		return () => {
			mounted = false;
		};
	}, []);

	const filteredProblems = useMemo(() => {
		const base = problems;
		if (!searchQuery.trim()) return base;
		return base.filter((p) => `${p.id}. ${p.title}`.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [problems, searchQuery]);

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header />

			<main className="flex-1">
				<div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-14 py-12">
					<h1 className="text-[28px] font-semibold text-[#1d1d1d] mb-9">Problems</h1>

					<div className="flex flex-wrap gap-3 mb-7">
						{topics.map(({ label, icon }) => {
							const active = selectedTopic === label;
							return (
								<button
									key={label}
									onClick={() => setSelectedTopic(label)}
									className={`flex items-center gap-2 px-5 py-3 rounded-full border text-[16px] transition-colors shadow-sm ${
										active
											? "bg-black text-white border-black"
											: "bg-[#efefef] text-[#4a4a4a] border-[#e0e0e0] hover:bg-[#e5e5e5]"
									}`}
								>
									<span className="text-[19px]" aria-hidden>
										{icon}
									</span>
									<span className="font-medium whitespace-nowrap">{label}</span>
								</button>
							);
						})}
					</div>

					<div className="flex items-center justify-between border-b border-[#e4e4e4] pb-4 mb-6 gap-4">
						<div className="flex items-center gap-3 w-full max-w-[520px]">
							<div className="relative flex-1">
								<input
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									type="text"
									placeholder="Search questions"
									className="w-full h-[44px] rounded-full bg-[#f5f5f5] border border-[#dedede] pl-12 pr-4 text-[15px] text-[#4a4a4a] focus:outline-none"
								/>
								<img
									src="/icons/search.png"
									alt="Search"
									className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] object-contain opacity-75"
								/>
							</div>
							<button className="w-10 h-10 rounded-full bg-[#efefef] border border-[#dedede] grid place-items-center text-[#6f6f6f]" aria-label="Sort">
								<span className="text-[18px] font-semibold">⇅</span>
							</button>
							<button className="w-10 h-10 rounded-full bg-[#efefef] border border-[#dedede] grid place-items-center text-[#6f6f6f]" aria-label="Filter">
								<span className="text-[18px]">⚙</span>
							</button>
						</div>

						<div className="flex items-center gap-2 text-[15px] text-[#3a3a3a] whitespace-nowrap">
							<span className="w-3 h-3 rounded-full bg-[#17b44a] inline-block" aria-hidden />
							<span className="font-medium">0/10 Solved</span>
							<span className="text-[#8a8a8a] text-[13px]">⇄</span>
						</div>
					</div>

					<div className="border border-[#e6e6e6] rounded-lg overflow-hidden shadow-sm min-h-[220px]">
						{loading && (
							<div className="px-7 py-6 text-[15px] text-[#555] bg-[#fafafa]">Loading problems...</div>
						)}
						{!loading && error && (
							<div className="px-7 py-6 text-[15px] text-[#c84a4a] bg-[#fff1f2]">
								Failed to load problems: {error}
							</div>
						)}
						{!loading && !error && filteredProblems.length === 0 && (
							<div className="px-7 py-6 text-[15px] text-[#555] bg-[#fafafa]">No problems found.</div>
						)}
						{!loading && !error && filteredProblems.map((p, idx) => (
							<Link
								key={p.id}
								href={`/problems/${p.id}`}
								className={`grid grid-cols-[1fr_auto_auto] items-center px-5 sm:px-7 py-[18px] text-[15px] ${
									idx % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
								} hover:bg-[#f1f1f1] transition-colors`}
							>
								<div className="flex items-center gap-3 text-[#222222]">
									<span className="font-semibold">{p.id}.</span>
									<span className="font-semibold">{p.title}</span>
								</div>

								{/* <div className="text-[#555555] text-[15px]">{p.successRate || '—'}</div> */}

								<div 
									className="text-right font-semibold" 
									style={{ color: difficultyColor[(p.difficulty as Difficulty) || 'Easy'] ?? '#555' } as React.CSSProperties}
								>
									{p.difficulty || 'Easy'}
								</div>
							</Link>
						))}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ProblemsPage;

