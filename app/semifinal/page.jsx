"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import KnockoutRound from "@/app/components/KnockoutRound";

export default function SemifinalPage() {
  const router = useRouter();
  const [pairs, setPairs] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }
    const teams = JSON.parse(localStorage.getItem("semiFinalTeams") || "[]");
    const p = [];
    for (let i = 0; i < teams.length; i += 2) p.push([teams[i], teams[i + 1]]);
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
    localStorage.setItem("finalTeams", JSON.stringify(winners));
    router.push("/final");
  };

  if (!pairs.length) return null;
  return <KnockoutRound title="Semifinal" pairs={pairs} winners={winners} onSelect={onSelect} onNext={handleNext} nextLabel="Next → Final" />;
}
