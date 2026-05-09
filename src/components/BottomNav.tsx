import { FaChartPie } from "react-icons/fa";
import { MdNotes, MdEdit } from "react-icons/md";

type View = "overview" | "transactions" | "plan";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: FaChartPie },
  { id: "transactions", label: "Transactions", Icon: MdNotes },
  { id: "plan", label: "Plan", Icon: MdEdit },
] as const;

interface Props {
  view: View;
  onNavigate: (view: View) => void;
}

export default function BottomNav({ view, onNavigate }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 bg-surface border-t border-border flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium ${view === id ? "text-primary" : "text-fg-muted"}`}
        >
          <Icon className="w-6 h-6" />
          {label}
        </button>
      ))}
    </nav>
  );
}
