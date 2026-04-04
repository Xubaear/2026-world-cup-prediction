"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GROUPS } from "@/lib/groups";

export default function GroupsPage() {
  const router = useRouter();
  const [picks, setPicks] = useState(() =>
    Object.fromEntries(Object.keys(GROUPS).map((g) => [g, { first: "", second: "", third: "" }]))
  );

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }
    const saved = JSON.parse(localStorage.getItem("groupPicks") || "null");
    if (saved) setPicks(saved);
  }, [router]);

  const select = (group, rank, team) => {
    setPicks((prev) => {
      const g = { ...prev[group] };
      if (g.first === team && rank !== "first") g.first = "";
      if (g.second === team && rank !== "second") g.second = "";
      if (g.third === team && rank !== "third") g.third = "";
      g[rank] = g[rank] === team ? "" : team;
      return { ...prev, [group]: g };
    });
  };

  const isComplete = Object.values(picks).every(
    (g) => g.first && g.second && g.third && new Set([g.first, g.second, g.third]).size === 3
  );

  const handleNext = async () => {
    const id = localStorage.getItem("predId");
    const qualified24 = [
      ...Object.values(picks).map((g) => g.first),
      ...Object.values(picks).map((g) => g.second),
    ];
    const thirds = Object.entries(picks).map(([grp, g]) => ({ group: grp, team: g.third }));

    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupPredictions: picks, qualified24, thirds }),
    });

    localStorage.setItem("groupPicks", JSON.stringify(picks));
    localStorage.setItem("thirds", JSON.stringify(thirds));
    localStorage.setItem("qualified24", JSON.stringify(qualified24));
    router.push("/best-third");
  };

  const rankLabel = { first: "1st", second: "2nd", third: "3rd" };
  const rankColor = {
    first: "bg-green-500 text-white border-green-500",
    second: "bg-blue-500 text-white border-blue-500",
    third: "bg-yellow-400 text-gray-900 border-yellow-400",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="relative text-center mb-6">
        <button
          onClick={() => router.push("/")}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition text-sm"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Group Stage Predictions</h1>
        <p className="text-gray-400 text-sm mt-1">Pick 1st, 2nd, and 3rd for each group</p>
      </div>

      <div className="space-y-4">
        {Object.entries(GROUPS).map(([grp, teams]) => (
          <div key={grp} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-yellow-400 font-bold mb-3">Group {grp}</p>
            <div className="grid grid-cols-1 gap-2">
              {teams.map((team) => {
                const g = picks[grp];
                const activeRank = g.first === team ? "first" : g.second === team ? "second" : g.third === team ? "third" : null;
                return (
                  <div key={team} className="flex items-center gap-2">
                    <span className="w-28 text-sm text-gray-200 truncate">{team}</span>
                    {["first", "second", "third"].map((rank) => (
                      <button
                        key={rank}
                        onClick={() => select(grp, rank, team)}
                        disabled={picks[grp][rank] !== "" && picks[grp][rank] !== team}
                        className={`flex-1 text-xs py-1.5 rounded-lg border transition font-semibold ${
                          activeRank === rank
                            ? rankColor[rank]
                            : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 disabled:opacity-30"
                        }`}
                      >
                        {rankLabel[rank]}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-gray-500 flex gap-3">
              <span>🥇 {picks[grp].first || "—"}</span>
              <span>🥈 {picks[grp].second || "—"}</span>
              <span>🥉 {picks[grp].third || "—"}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 sticky bottom-4">
        <button
          disabled={!isComplete}
          onClick={handleNext}
          className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-40"
        >
          Next → Best 3rd Place
        </button>
        {!isComplete && (
          <p className="text-center text-gray-500 text-xs mt-2">Complete all groups to continue</p>
        )}
      </div>
    </main>
  );
}
