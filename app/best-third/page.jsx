"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BestThirdPage() {
  const router = useRouter();
  const [thirds, setThirds] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }
    setThirds(JSON.parse(localStorage.getItem("thirds") || "[]"));
  }, [router]);

  const toggle = (team) => {
    setSelected((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : prev.length < 8 ? [...prev, team] : prev
    );
  };

  const handleNext = async () => {
    const id = localStorage.getItem("predId");
    const qualified24 = JSON.parse(localStorage.getItem("qualified24") || "[]");
    const qualified32 = [...qualified24, ...selected];

    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bestThirds: selected, qualified32 }),
    });

    // Store group picks and best thirds for bracket building
    localStorage.setItem("bestThirds", JSON.stringify(selected));
    localStorage.setItem("qualified32", JSON.stringify(qualified32));
    router.push("/round-of-32");
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">Best 3rd Place Teams</h1>
        <p className="text-gray-400 text-sm mt-1">Select 8 teams to advance ({selected.length}/8)</p>
      </div>

      <div className="space-y-2">
        {thirds.map(({ group, team }) => (
          <button
            key={group}
            onClick={() => toggle(team)}
            disabled={!selected.includes(team) && selected.length >= 8}
            className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border transition ${
              selected.includes(team)
                ? "bg-green-600 border-green-500 text-white font-semibold"
                : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500 disabled:opacity-30"
            }`}
          >
            <span>{team}</span>
            <span className="text-xs text-gray-400">Group {group}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <button
          disabled={selected.length !== 8}
          onClick={handleNext}
          className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-40"
        >
          Next → Round of 32
        </button>
        {selected.length !== 8 && (
          <p className="text-center text-gray-500 text-xs mt-2">Select exactly 8 teams</p>
        )}
      </div>
    </main>
  );
}
