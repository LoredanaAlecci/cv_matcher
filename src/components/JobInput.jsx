export default function JobInput({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Oferta de empleo
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pega aquí la descripción de la oferta de empleo..."
        rows={10}
        className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}
