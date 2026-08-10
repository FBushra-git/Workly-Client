import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="state-panel" role="status">
      <LoaderCircle className="size-6 animate-spin text-[var(--brand)]" />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="state-panel">
      <Inbox className="size-7 text-[var(--muted)]" />
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="error-message" role="alert">
      <AlertCircle className="size-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
