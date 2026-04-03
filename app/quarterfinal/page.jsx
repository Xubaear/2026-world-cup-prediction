"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QF_BRACKET } from "@/lib/groups";
import KnockoutRound from "@/app/components/KnockoutRound";

export default function QuarterfinalPage() {
  const router = useRouter();
  const [pairs, setPairs] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }
    const r16 = JSON.parse(localStorage.getItem("r16Winners") || "[]");
    const p = QF_BRACKET.map(([a, b]) => [r16[a], r16[b]]);
    setPairs(p);
    setWinners(new Array(p.length).fill(""));
  }, [router]);

  const onSelect = (i, team) => setWinners((prev) => { const w = [...prev]; w[i] = team; return w; });

  const handleNext = async () => {
    const id = localStorage.getItem("predId");
    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quarterFinal: winners }),
    });
    localStorage.setItem("qfWinners", JSON.stringify(winners));
    router.push("/semifinal");
  };

  if (!pairs.length) return null;
  return (
    <KnockoutRound
      title="Quarterfinal"
      pairs={pairs}
      winners={winners}
      onSelect={onSelect}
      onNext={handleNext}
      nextLabel="Next → Semifinal"
    />
  );
}
