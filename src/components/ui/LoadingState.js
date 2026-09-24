import Spinner from "./Spinner";

export default function LoadingState({ label = "Loading…" }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
      <Spinner className="h-8 w-8 text-indigo-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
