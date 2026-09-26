export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
      <p className="text-sm">Analizando el match con la oferta…</p>
    </div>
  );
}
