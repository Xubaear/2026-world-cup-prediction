"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { R32_BRACKET } from "@/lib/groups";
import KnockoutRound from "@/app/components/KnockoutRound";

export default function RoundOf32Page() {
  const router = useRouter();
  const [pairs, setPairs] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("predId")) { router.push("/"); return; }

    const groupPicks = JSON.parse(localStorage.getItem("groupPicks") || "{}");
    const bestThirds = JSON.parse(localStorage.getItem("bestThirds") || "[]");
    // bestThirds = [{ group, team }, ...] — 8 selected third place teams

    // Build lookup: "A1" -> team name, "A2" -> team name
    const lookup = {};
    Object.entries(groupPicks).forEach(([grp, g]) => {
      lookup[`${grp}1`] = g.first;
      lookup[`${grp}2`] = g.second;
    });

    // For each 3rd slot, find the matching team from bestThirds
    // whose group is in thirdFrom list
    const usedThirds = new Set();

    const p = R32_BRACKET.map((match) => {
      const teamA = lookup[match.a] || match.a;
      let teamB;

      if (match.b === "3rd") {
        // Find first unused best-third team whose group is in thirdFrom
        const found = bestThirds.find(
          (t) => !usedThirds.has(t.team) && match.thirdFrom.includes(t.group)
        );
        if (found) {
          usedThirds.add(found.team);
          teamB = found.team;
        } else {
          // fallback: first unused
          const fallback = bestThirds.find((t) => !usedThirds.has(t.team));
          if (fallback) { usedThirds.add(fallback.team); teamB = fallback.team; }
          else teamB = "TBD";
        }
      } else {
        teamB = lookup[match.b] || match.b;
      }

      return [teamA, teamB];
    });

    setPairs(p);
    const saved = JSON.parse(localStorage.getItem("r32Winners") || "[]");
    setWinners(saved.length === p.length ? saved : new Array(p.length).fill(""));
  }, [router]);

  const onSelect = (i, team) =>
    setWinners((prev) => { const w = [...prev]; w[i] = team; return w; });

  const handleNext = async () => {
    const id = localStorage.getItem("predId");
    await fetch(`/api/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roundOf32: winners }),
    });
    localStorage.setItem("r32Winners", JSON.stringify(winners));
    router.push("/round-of-16");
  };

  if (!pairs.length) return null;
  return (
    <KnockoutRound
      title="Round of 32"
      subtitle="Select the winner of each match"
      pairs={pairs}
      winners={winners}
      onSelect={onSelect}
      onNext={handleNext}
      nextLabel="Next → Round of 16"
      onBack={() => router.push("/best-third")}
    />
  );
}
