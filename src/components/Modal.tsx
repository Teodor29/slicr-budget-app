import type { ReactNode } from "react";

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, onClose, children }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-fg mb-5">{title}</h2>
        {children}
      </div>
    </div>
  );
}
