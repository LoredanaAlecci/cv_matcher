function ScoreCircle({ score }) {
  const color =
    score >= 75 ? "text-emerald-500" : score >= 45 ? "text-amber-500" : "text-rose-500";
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className={`absolute text-2xl font-bold ${color}`}>{score}%</span>
    </div>
  );
}

function List({ title, items, color }) {
  return (
    <div>
      <h3 className={`mb-2 text-sm font-semibold ${color}`}>{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-700">
            <span className="text-slate-400">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MatchResult({ result }) {
  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <ScoreCircle score={result.matchScore} />
        <p className="text-sm text-slate-500">Compatibilidad con la oferta</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <List title="Puntos fuertes" items={result.strengths} color="text-emerald-600" />
        <List title="Carencias" items={result.gaps} color="text-rose-600" />
        <List title="Sugerencias" items={result.suggestions} color="text-indigo-600" />
      </div>
    </div>
  );
}
