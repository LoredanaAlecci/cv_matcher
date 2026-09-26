import { useState } from "react";
import CVUpload from "./components/CVUpload";
import JobInput from "./components/JobInput";
import LoadingState from "./components/LoadingState";
import MatchResult from "./components/MatchResult";

export default function App() {
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const canAnalyze = cvText.trim().length > 20 && jobText.trim().length > 20 && !loading;

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Algo salió mal analizando el match");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">CV Matcher</h1>
        <p className="mt-1 text-sm text-slate-500">
          Compara tu CV con una oferta de empleo y descubre qué te falta.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <CVUpload value={cvText} onChange={setCvText} />
        <JobInput value={jobText} onChange={setJobText} />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Analizar match
        </button>
      </div>

      <div className="mt-8">
        {loading && <LoadingState />}

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {result && !loading && <MatchResult result={result} />}

        {!result && !loading && !error && (
          <p className="text-center text-sm text-slate-400">
            Pega tu CV y una oferta de empleo para empezar.
          </p>
        )}
      </div>
    </div>
  );
}
