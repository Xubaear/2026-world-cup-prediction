"use client";

export default function KnockoutRound({ title, subtitle, pairs, winners, onSelect, onNext, nextLabel, onBack }) {
  const isComplete = pairs.every((_, i) => winners[i]);

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="relative text-center mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition text-sm"
          >
            ← Back
          </button>
        )}
        <h1 className="text-2xl font-bold text-yellow-400">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>

      <div className="space-y-3">
        {pairs.map((pair, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-2">
            <div className="flex gap-2">
              {pair.map((team, j) => (
                <button
                  key={j}
                  onClick={() => onSelect(i, team)}
                  className={`flex-1 py-2.5 px-2 rounded-lg border text-sm font-semibold transition ${
                    winners[i] === team
                      ? "bg-yellow-400 text-gray-900 border-yellow-400"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-400"
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          disabled={!isComplete}
          onClick={onNext}
          className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition disabled:opacity-40"
        >
          {nextLabel || "Next →"}
        </button>
        {!isComplete && (
          <p className="text-center text-gray-500 text-xs mt-2">Select a winner for every match</p>
        )}
      </div>
    </main>
  );
}
