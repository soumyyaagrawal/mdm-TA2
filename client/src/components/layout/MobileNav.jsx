import { CalendarDays, Users, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav({ active, onNavigate }) {
  const items = [
    ["dashboard", "Overview", LayoutDashboard],
    ["events", "Events", CalendarDays],
    ["attendees", "Registrations", Users]
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 grid grid-cols-3 rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-[0_18px_45px_-15px_rgba(15,23,42,.35)] backdrop-blur-xl lg:hidden">
      {items.map(([id, label, Icon]) => {
        const selected = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className={cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition", selected ? "bg-indigo-50 text-primary" : "text-slate-400")}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
