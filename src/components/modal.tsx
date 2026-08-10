"use client";

import { X } from "lucide-react";

export function Modal({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X className="size-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}
