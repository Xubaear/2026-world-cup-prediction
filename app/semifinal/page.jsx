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
    setWinners(new Array(p.length).fill(""));
  }, [router]);

  const onSelect = (i, team) => setWinners((prev) => { const w = [...prev]; w[i] = team; return w; });

  const handleNext = async () => {
    const id = localStorage.getItem("predId");
    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ semiFinal: winners }),
    });
    localStorage.setItem("sfWinners", JSON.stringify(winners));
    router.push("/final");
  };

  if (!pairs.length) return null;
  return (
    <KnockoutRound
      title="Semifinal"
      pairs={pairs}
      winners={winners}
      onSelect={onSelect}
      onNext={handleNext}
      nextLabel="Next → Final"
    />
  );
}
