import { CalendarDays, Users, LayoutDashboard, GraduationCap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ active, onNavigate }) {
  const items = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "attendees", label: "Registrations", icon: Users }
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col bg-slate-950 px-3 py-4 lg:flex">
      <div className="flex h-14 items-center gap-3 px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-white indigo-glow">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-[Manrope] text-[15px] font-bold text-white">RBU Events</p>
          <p className="truncate text-[11px] text-slate-400">Campus operations</p>
        </div>
      </div>
      <div className="mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</div>
      <nav className="mt-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={cn("group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all", selected ? "bg-white text-slate-950 shadow-lg shadow-black/20" : "text-slate-400 hover:bg-white/5 hover:text-white")}>
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", selected ? "bg-indigo-50 text-primary" : "text-slate-500 group-hover:text-indigo-300")}><Icon className="h-4 w-4" /></span>
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto overflow-hidden rounded-xl border border-white/10 bg-white/[0.055] p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-white"><Sparkles className="h-4 w-4 text-indigo-300" /> RBU workspace</div>
        <p className="mt-2 text-xs leading-5 text-slate-400">One place for campus clubs, events and attendees.</p>
      </div>
    </aside>
  );
}
