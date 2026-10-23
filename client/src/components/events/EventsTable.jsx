import { Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function EventsTable({ events, onDelete, onRegister, onView }) {
  return (
    <Table>
      <TableHeader><TableRow>
        <TableHead>Event</TableHead><TableHead>Date</TableHead><TableHead>Club</TableHead>
        <TableHead>Venue</TableHead><TableHead>Capacity</TableHead><TableHead className="text-right">Actions</TableHead>
      </TableRow></TableHeader>
      <TableBody>
        {events.length === 0 ? <TableRow><TableCell colSpan={6} className="py-12 text-center text-muted-foreground">No events found.</TableCell></TableRow> : events.map((event) => (
          <TableRow key={event.id}>
            <TableCell><button onClick={() => onView(event)} className="text-left font-semibold hover:text-primary">{event.name}</button><div className="text-xs text-muted-foreground">#{String(event.id).padStart(4,"0")}</div></TableCell>
            <TableCell>{new Date(event.date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</TableCell>
            <TableCell><Badge variant="secondary">{event.club}</Badge></TableCell>
            <TableCell>{event.venue}</TableCell>
            <TableCell><div className="min-w-28"><div className="flex justify-between text-xs"><span>{event.attendee_count} registered</span><span>{event.capacity}</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-900" style={{width: `${Math.min((event.attendee_count/event.capacity)*100,100)}%`}} /></div></div></TableCell>
            <TableCell className="text-right"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => onRegister(event)}><Users className="mr-1 h-3.5 w-3.5" /> Register</Button><Button size="icon" variant="ghost" onClick={() => onDelete(event)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
