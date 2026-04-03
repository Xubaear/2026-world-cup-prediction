"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FinalPage() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [champion, setChampion] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }
    setTeams(JSON.parse(localStorage.getItem("sfWinners") || "[]"));
  }, [router]);

  const handleSubmit = async () => {
    if (!champion) return;
    setSaving(true);
    const id = localStorage.getItem("predId");
    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finalWinner: champion, completedAt: new Date() }),
    });
    localStorage.setItem("champion", champion);
    router.push("/done");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold text-yellow-400">The Final</h1>
          <p className="text-gray-400 text-sm mt-1">Who wins the World Cup?</p>
        </div>
        <div className="flex gap-3">
          {teams.map((team) => (
            <button
              key={team}
              onClick={() => setChampion(team)}
              className={`flex-1 py-4 rounded-xl border text-base font-bold transition ${
                champion === team
                  ? "bg-yellow-400 text-gray-900 border-yellow-400"
                  : "bg-gray-900 text-gray-300 border-gray-700 hover:border-yellow-400"
              }`}
            >
              {champion === team ? "🏆 " : ""}{team}
            </button>
          ))}
        </div>
        <button
          disabled={!champion || saving}
          onClick={handleSubmit}
          className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-40"
        >
          {saving ? "Saving..." : "Submit Prediction 🎉"}
        </button>
      </div>
    </main>
  );
}
