import { useState } from "react";
import { extractPdfText } from "../lib/extractPdfText";

export default function CVUpload({ value, onChange }) {
  const [extracting, setExtracting] = useState(false);
  const [fileName, setFileName] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setExtracting(true);
    try {
      const text = await extractPdfText(file);
      onChange(text);
    } catch (err) {
      console.error(err);
      alert("No se pudo leer el PDF. Prueba a pegar el texto directamente.");
    } finally {
      setExtracting(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Tu CV
      </label>

      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-300 transition">
          Subir PDF
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFile}
          />
        </label>
        {fileName && (
          <span className="text-sm text-slate-500 truncate">{fileName}</span>
        )}
        {extracting && (
          <span className="text-sm text-indigo-600">Leyendo PDF…</span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="O pega aquí el texto de tu CV..."
        rows={10}
        className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}
