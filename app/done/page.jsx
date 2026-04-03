"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DonePage() {
  const [name, setName] = useState("");
  const [champion, setChampion] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("predName") || "");
    setChampion(localStorage.getItem("champion") || "");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="text-6xl">🎉</div>
        <h1 className="text-2xl font-bold text-white">Prediction Submitted!</h1>
        <p className="text-gray-400">
          Thanks <span className="text-yellow-400 font-semibold">{name}</span>! You picked{" "}
          <span className="text-yellow-400 font-semibold">{champion}</span> to win the World Cup.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition"
        >
          New Prediction
        </Link>
      </div>
    </main>
  );
}
