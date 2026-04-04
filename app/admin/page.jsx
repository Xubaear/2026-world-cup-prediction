"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuthed")) setAuthed(true);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/predictions")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) ? setPredictions(data) : [])
      .catch(() => {});
  }, [authed]);

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthed(true); sessionStorage.setItem("adminAuthed", "1"); setError(""); }
    else setError("Wrong password!");
  };

  if (checking) return null;

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={login} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm space-y-4">
          <div className="text-center">
            <Image src="/WC26_Logo.png" alt="WC Logo" width={60} height={60} className="mx-auto mb-2 object-contain" />
            <h1 className="text-2xl font-bold text-yellow-400">Admin Login</h1>
          </div>
          <input
            type="password" required autoFocus
            className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button className="w-full bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-300 transition">
            Login
          </button>
          <button type="button" onClick={() => window.history.back()} className="w-full text-gray-500 text-sm hover:text-gray-300">
            ← Back
          </button>
        </form>
      </main>
    );
  }

  // Stats
  const winnerCount = {};
  const runnerUpCount = {};
  const thirdCount = {};
  predictions.forEach((p) => {
    if (p.finalWinner) winnerCount[p.finalWinner] = (winnerCount[p.finalWinner] || 0) + 1;
    const sf = p.semiFinal || [];
    const ru = sf.find((t) => t !== p.finalWinner);
    if (ru) runnerUpCount[ru] = (runnerUpCount[ru] || 0) + 1;
    if (p.thirdPlace) thirdCount[p.thirdPlace] = (thirdCount[p.thirdPlace] || 0) + 1;
  });
  const topPick = Object.entries(winnerCount).sort((a, b) => b[1] - a[1])[0];
  const topRunnerUp = Object.entries(runnerUpCount).sort((a, b) => b[1] - a[1])[0];
  const topThird = Object.entries(thirdCount).sort((a, b) => b[1] - a[1])[0];

  const filtered = predictions.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.finalWinner?.toLowerCase().includes(search.toLowerCase())
  );

  const PAGE_SIZE = 7;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
          <Image src="/WC26_Logo.png" alt="WC Logo" width={32} height={32} className="object-contain" />
          Admin Dashboard
        </h1>
        <span className="text-gray-400 text-sm">{predictions.length} total predictions</span>
      </div>

      {topPick && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Most Predicted Champion</p>
            <p className="text-yellow-400 font-bold text-xl">{topPick[0]}</p>
            <p className="text-gray-500 text-xs">{topPick[1]} votes</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Most Predicted Runner-up</p>
            <p className="text-blue-400 font-bold text-xl">{topRunnerUp?.[0] || "—"}</p>
            <p className="text-gray-500 text-xs">{topRunnerUp?.[1] || 0} votes</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Most Predicted 3rd Place</p>
            <p className="text-orange-400 font-bold text-xl">{topThird?.[0] || "—"}</p>
            <p className="text-gray-500 text-xs">{topThird?.[1] || 0} votes</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Total Participants</p>
            <p className="text-white font-bold text-xl">{predictions.length}</p>
          </div>
        </div>
      )}

      <input
        className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
        placeholder="Search by name or champion..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      <div className="overflow-x-auto rounded-xl border border-gray-800 mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">🏆 Champion</th>
              <th className="px-4 py-3 text-left">🥈 Runner-up</th>
              <th className="px-4 py-3 text-left">🏅 3rd Place</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p, i) => {
              const semiFinal = p.semiFinal || [];
              const runnerUp = semiFinal.find((t) => t !== p.finalWinner) || "—";
              const thirdPlace = p.thirdPlace || "—";
              return (
                <tr key={p._id} className="border-t border-gray-800 hover:bg-gray-900 transition">
                  <td className="px-4 py-3 text-gray-500">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-white">{p.name}</td>
                  <td className="px-4 py-3">
                    {p.finalWinner ? <span className="text-yellow-400 font-semibold">{p.finalWinner}</span> : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {semiFinal.length === 2 ? <span className="text-blue-400">{runnerUp}</span> : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{thirdPlace}</td>
                  <td className="px-4 py-3">
                    {p.finalWinner
                      ? <span className="text-xs bg-green-700 text-green-200 px-2 py-0.5 rounded-full">Complete</span>
                      : <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">In Progress</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setExpanded(expanded === p._id ? null : p._id)} className="text-xs text-yellow-400 hover:underline">
                      {expanded === p._id ? "Hide ▲" : "View ▼"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-500 py-10">No predictions found.</p>}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-sm disabled:opacity-30 hover:bg-gray-700 transition">
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${n === page ? "bg-yellow-400 text-gray-900 font-bold" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
              {n}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-sm disabled:opacity-30 hover:bg-gray-700 transition">
            Next →
          </button>
        </div>
      )}

      {expanded && (() => {
        const p = predictions.find((x) => x._id === expanded);
        if (!p) return null;
        return (
          <div className="bg-gray-900 border border-yellow-400 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{p.name}&apos;s Full Prediction</h2>
              <button onClick={() => setExpanded(null)} className="text-gray-500 hover:text-white text-sm">✕ Close</button>
            </div>
            {p.groupPredictions && (
              <div>
                <p className="text-yellow-400 font-semibold mb-2 text-sm">Group Stage</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(p.groupPredictions).map(([grp, g]) => (
                    <div key={grp} className="bg-gray-800 rounded-lg px-3 py-2 text-xs">
                      <p className="text-yellow-400 font-bold mb-1">Group {grp}</p>
                      <p className="text-gray-300">🥇 {g.first}</p>
                      <p className="text-gray-300">🥈 {g.second}</p>
                      <p className="text-gray-400">🥉 {g.third}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {[
              { key: "roundOf32", label: "Round of 32" },
              { key: "roundOf16", label: "Round of 16" },
              { key: "quarterFinal", label: "Quarterfinal" },
              { key: "semiFinal", label: "Semifinal" },
            ].map(({ key, label }) =>
              p[key]?.length ? (
                <div key={key}>
                  <p className="text-yellow-400 font-semibold mb-2 text-sm">{label} Winners</p>
                  <div className="flex flex-wrap gap-2">
                    {p[key].map((t, idx) => (
                      <span key={idx} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-lg">{t}</span>
                    ))}
                  </div>
                </div>
              ) : null
            )}
            {p.finalWinner && (
              <div className="bg-yellow-400 text-gray-900 rounded-xl p-3 text-center font-bold">
                🏆 Champion: {p.finalWinner}
              </div>
            )}
          </div>
        );
      })()}
    </main>
  );
}
