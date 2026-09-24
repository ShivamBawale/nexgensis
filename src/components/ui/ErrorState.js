import { buttonStyles } from "./buttonStyles";

export default function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center"
    >
      <p className="text-base font-semibold text-red-800">Something went wrong</p>
      <p className="max-w-md text-sm text-red-700">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={buttonStyles("secondary", "mt-3")}>
          Retry
        </button>
      )}
    </div>
  );
}
