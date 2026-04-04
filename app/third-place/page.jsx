"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import KnockoutRound from "@/app/components/KnockoutRound";

export default function ThirdPlacePage() {
  const router = useRouter();
  const [pairs, setPairs] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }
    const losers = JSON.parse(localStorage.getItem("sfLosers") || "[]");
    if (losers.length === 2) {
      setPairs([losers]);
      const saved = localStorage.getItem("thirdPlaceWinner");
      setWinners(saved ? [saved] : [""]);
    }
  }, [router]);

  const onSelect = (i, team) => setWinners([team]);

  const handleNext = async () => {
    const id = localStorage.getItem("predId");
    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thirdPlace: winners[0] }),
    });
    localStorage.setItem("thirdPlaceWinner", winners[0]);
    router.push("/final");
  };

  if (!pairs.length) return null;
  return (
    <KnockoutRound
      title="3rd Place Play-off"
      subtitle="Pick the 3rd place team"
      pairs={pairs}
      winners={winners}
      onSelect={onSelect}
      onNext={handleNext}
      nextLabel="Next → Final"
      onBack={() => router.push("/semifinal")}
    />
  );
}
