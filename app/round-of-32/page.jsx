"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import KnockoutRound from "@/app/components/KnockoutRound";

export default function RoundOf32Page() {
  const router = useRouter();
  const [pairs, setPairs] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }
    const q32 = JSON.parse(localStorage.getItem("qualified32") || "[]");
    const p = [];
    for (let i = 0; i < q32.length; i += 2) p.push([q32[i], q32[i + 1]]);
    setPairs(p);
    setWinners(new Array(p.length).fill(""));
  }, [router]);

  const onSelect = (i, team) => setWinners((prev) => { const w = [...prev]; w[i] = team; return w; });

  const handleNext = async () => {
    const id = localStorage.getItem("predId");
    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roundOf32: winners }),
    });
    localStorage.setItem("roundOf16Teams", JSON.stringify(winners));
    router.push("/round-of-16");
  };

  if (!pairs.length) return null;
  return <KnockoutRound title="Round of 32" pairs={pairs} winners={winners} onSelect={onSelect} onNext={handleNext} nextLabel="Next → Round of 16" />;
}
