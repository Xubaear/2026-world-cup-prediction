"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { R16_BRACKET } from "@/lib/groups";
import KnockoutRound from "@/app/components/KnockoutRound";

export default function RoundOf16Page() {
  const router = useRouter();
  const [pairs, setPairs] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }
    const r32 = JSON.parse(localStorage.getItem("r32Winners") || "[]");
    const p = R16_BRACKET.map(([a, b]) => [r32[a], r32[b]]);
    setPairs(p);
    const saved = JSON.parse(localStorage.getItem("r16Winners") || "[]");
    setWinners(saved.length === p.length ? saved : new Array(p.length).fill(""));
  }, [router]);

  const onSelect = (i, team) => setWinners((prev) => { const w = [...prev]; w[i] = team; return w; });

  const handleNext = async () => {
    const id = localStorage.getItem("predId");
    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roundOf16: winners }),
    });
    localStorage.setItem("r16Winners", JSON.stringify(winners));
    router.push("/quarterfinal");
  };

  if (!pairs.length) return null;
  return (
    <KnockoutRound
      title="Round of 16"
      pairs={pairs}
      winners={winners}
      onSelect={onSelect}
      onNext={handleNext}
      nextLabel="Next → Quarterfinal"
      onBack={() => router.push("/round-of-32")}
    />
  );
}
