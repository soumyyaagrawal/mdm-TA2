import { Bell, Search, ChevronDown, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header({ search, setSearch, active }) {
  const title = active === "dashboard" ? "Overview" : active === "events" ? "Events" : "Registrations";
  const searchLabel = active === "events" ? "events" : "registrations";

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white lg:hidden"><GraduationCap className="h-4 w-4" /></div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">RBU Campus</p>
        <h1 className="truncate font-[Manrope] text-base font-bold text-slate-950">{title}</h1>
      </div>
      {active !== "dashboard" && (
        <div className="relative hidden w-full max-w-[320px] sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${searchLabel}...`} className="h-10 rounded-lg border-slate-200 bg-slate-50 pl-10 shadow-none" />
        </div>
      )}
      <button type="button" aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:text-primary">
        <Bell className="h-4 w-4" /><span className="absolute right-[9px] top-[9px] h-1.5 w-1.5 rounded-full bg-violet-500 ring-2 ring-white" />
      </button>
      <button type="button" className="hidden items-center gap-2 rounded-lg p-1 pr-2 transition hover:bg-slate-50 md:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-primary">RBU</span>
        <div className="text-left"><p className="text-xs font-semibold text-slate-800">RBU Admin</p><p className="text-[10px] text-slate-400">Operations</p></div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>
    </header>
  );
}
