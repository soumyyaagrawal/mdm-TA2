import { CalendarDays, MapPin, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const palettes = [
  "from-indigo-600 via-indigo-500 to-violet-500",
  "from-slate-800 via-slate-700 to-indigo-700",
  "from-violet-600 via-fuchsia-500 to-indigo-500",
  "from-cyan-700 via-sky-600 to-indigo-600"
];

export function EventCard({ event, index = 0, onDelete, onRegister, onView }) {
  const date = new Date(`${event.date}T00:00:00`);
  const capacity = Number(event.capacity) || 0;
  const attendees = Number(event.attendee_count) || 0;
  const percentage = capacity ? Math.min((attendees / capacity) * 100, 100) : 0;
  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <article className="surface-card group overflow-hidden">
      <button type="button" onClick={() => onView(event)} className={`relative flex h-32 w-full items-end overflow-hidden bg-gradient-to-br ${palettes[index % palettes.length]} p-5 text-left`} aria-label={`View ${event.name}`}>
        <div className="absolute -right-8 -top-14 h-32 w-32 rounded-full border border-white/15" />
        <div className="absolute right-7 top-7 h-16 w-16 rounded-full border border-white/10" />
        <span className="absolute left-5 top-5 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
          {event.club}
        </span>
        <div className="relative flex items-end gap-3 text-white">
          <span className="flex h-11 w-11 flex-col items-center justify-center rounded-lg bg-white text-slate-950 shadow-lg">
            <strong className="font-[Manrope] text-lg leading-none">{date.toLocaleDateString("en-IN", { day: "2-digit" })}</strong>
            <small className="mt-0.5 text-[8px] font-bold uppercase text-indigo-600">{date.toLocaleDateString("en-IN", { month: "short" })}</small>
          </span>
          <span className="pb-0.5 text-xs font-medium text-white/75">{date.toLocaleDateString("en-IN", { weekday: "long", year: "numeric" })}</span>
        </div>
      </button>

      <div className="p-5">
        <button type="button" onClick={() => onView(event)} className="block w-full text-left">
          <h3 className="line-clamp-1 font-[Manrope] text-lg font-bold text-slate-950 transition-colors group-hover:text-primary">{event.name}</h3>
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {event.venue}</p>
        </button>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-500"><Users className="h-3.5 w-3.5" /> {attendees} registered</span>
            <span className="font-semibold text-slate-700">{capacity ? `${capacity - attendees} left` : "Full"}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <Button size="sm" className="flex-1 rounded-lg" onClick={() => onRegister(event)} disabled={isPast || capacity - attendees <= 0}>
            {isPast ? "Event ended" : capacity - attendees <= 0 ? "Event full" : "Register"}
          </Button>
          <Button size="icon" variant="ghost" aria-label={`Delete ${event.name}`} className="h-9 w-9 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(event)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
