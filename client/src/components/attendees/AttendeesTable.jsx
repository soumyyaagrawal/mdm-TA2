import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AttendeesTable({ attendees, onDelete }) {
  return (
    <Table>
      <TableHeader><TableRow className="border-slate-100 hover:bg-transparent"><TableHead className="h-12 px-5 text-[10px] font-bold uppercase tracking-[0.12em]">Attendee</TableHead><TableHead className="text-[10px] font-bold uppercase tracking-[0.12em]">Event</TableHead><TableHead className="text-[10px] font-bold uppercase tracking-[0.12em]">Club</TableHead><TableHead className="text-[10px] font-bold uppercase tracking-[0.12em]">Pass</TableHead><TableHead className="text-[10px] font-bold uppercase tracking-[0.12em]">Registered</TableHead><TableHead className="pr-5 text-right"><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
      <TableBody>
        {attendees.map(attendee => (
          <TableRow key={attendee.id} className="border-slate-100 hover:bg-slate-50/70">
            <TableCell className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-primary">{attendee.name.split(" ").map(word => word[0]).slice(0, 2).join("")}</span><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-900">{attendee.name}</div><div className="truncate text-xs text-slate-400">{attendee.email}</div></div></div></TableCell>
            <TableCell className="max-w-[220px]"><span className="block truncate text-sm text-slate-700">{attendee.event_name}</span></TableCell>
            <TableCell><Badge variant="secondary" className="max-w-[150px] truncate rounded-md bg-slate-100 font-medium text-slate-600">{attendee.club}</Badge></TableCell>
            <TableCell><Badge variant={attendee.ticket_type === "VIP" ? "warning" : "outline"} className="rounded-md">{attendee.ticket_type}</Badge></TableCell>
            <TableCell className="whitespace-nowrap text-xs text-slate-500">{new Date(attendee.created_at + "Z").toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</TableCell>
            <TableCell className="pr-5 text-right"><Button size="icon" variant="ghost" aria-label={`Delete registration for ${attendee.name}`} className="h-9 w-9 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(attendee)}><Trash2 className="h-4 w-4" /></Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
