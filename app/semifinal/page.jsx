"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SF_BRACKET } from "@/lib/groups";
import KnockoutRound from "@/app/components/KnockoutRound";

export default function SemifinalPage() {
  const router = useRouter();
  const [pairs, setPairs] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }
    const qf = JSON.parse(localStorage.getItem("qfWinners") || "[]");
    const p = SF_BRACKET.map(([a, b]) => [qf[a], qf[b]]);
    setPairs(p);
    const saved = JSON.parse(localStorage.getItem("sfWinners") || "[]");
    setWinners(saved.length === p.length ? saved : new Array(p.length).fill(""));
  }, [router]);

  const onSelect = (i, team) => setWinners((prev) => { const w = [...prev]; w[i] = team; return w; });

  const handleNext = async () => {
    const id = localStorage.getItem("predId");
    // save losers for 3rd place match
    const losers = pairs.map((pair, i) => pair.find((t) => t !== winners[i]));
    localStorage.setItem("sfLosers", JSON.stringify(losers));
    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ semiFinal: winners }),
    });
    localStorage.setItem("sfWinners", JSON.stringify(winners));
    router.push("/third-place");
  };

  if (!pairs.length) return null;
  return (
    <KnockoutRound
      title="Semifinal"
      pairs={pairs}
      winners={winners}
      onSelect={onSelect}
      onNext={handleNext}
      nextLabel="Next → 3rd Place"
      onBack={() => router.push("/quarterfinal")}
    />
  );
}
