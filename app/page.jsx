"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!data.id) throw new Error("No ID returned");
      // clear all previous prediction data
      ["predId","predName","groupPicks","thirds","qualified24","bestThirds","qualified32",
       "r32Winners","r16Winners","qfWinners","sfWinners","champion"].forEach(k => localStorage.removeItem(k));
      localStorage.setItem("predId", data.id);
      localStorage.setItem("predName", name.trim());
      router.push("/groups");
    } catch (e) {
      console.error(e);
      alert("Error saving. Check MongoDB connection.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-3">⚽</div>
          <h1 className="text-3xl font-bold text-yellow-400">FIFA World Cup 2026</h1>
          <p className="text-gray-400 mt-2">Make your full tournament prediction!</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <label className="block text-sm text-gray-400">Your Name</label>
          <input
            autoFocus
            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white text-lg outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && handleNext()}
          />
          <button
            disabled={!name.trim() || loading}
            onClick={handleNext}
            className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-40"
          >
            {loading ? "Saving..." : "Start Prediction →"}
          </button>
        </div>

        {/* Admin button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-500 hover:text-gray-300 text-sm border border-gray-700 px-4 py-2 rounded-lg hover:border-gray-500 transition"
          >
            🔐 Admin Panel
          </button>
        </div>
      </div>
    </main>
  );
}
