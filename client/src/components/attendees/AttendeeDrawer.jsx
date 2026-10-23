import { useEffect, useState } from "react";
import { LoaderCircle, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AttendeeDrawer({ open, onOpenChange, events, selectedEventId, onRegister }) {
  const [form, setForm] = useState({ eventId: "", name: "", email: "", ticketType: "Student" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setForm({ eventId: selectedEventId ? String(selectedEventId) : (events[0] ? String(events[0].id) : ""), name: "", email: "", ticketType: "Student" });
  }, [open, selectedEventId, events]);

  const submit = async event => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onRegister({ ...form, eventId: Number(form.eventId) });
      onOpenChange(false);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] max-w-xl gap-0 overflow-y-auto p-0">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5 pr-14"><DialogHeader><DialogTitle className="flex items-center gap-2 font-[Manrope] text-xl"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-primary"><UserPlus className="h-4 w-4" /></span>Register attendee</DialogTitle><DialogDescription className="mt-2">Add a participant to an event and confirm their pass.</DialogDescription></DialogHeader></div>
        <form onSubmit={submit} className="space-y-5 p-6">
          {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="space-y-2"><Label className="text-xs font-semibold text-slate-700">Event</Label><Select value={form.eventId} onValueChange={value => setForm({ ...form, eventId: value })}><SelectTrigger className="h-11 rounded-lg bg-white"><SelectValue placeholder="Select event" /></SelectTrigger><SelectContent>{events.map(event => <SelectItem key={event.id} value={String(event.id)}>{event.name} · {event.seats_left} seats</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label htmlFor="attendee-name" className="text-xs font-semibold text-slate-700">Full name</Label><Input id="attendee-name" required minLength="2" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Full name" className="h-11 rounded-lg bg-white" /></div>
          <div className="space-y-2"><Label htmlFor="attendee-email" className="text-xs font-semibold text-slate-700">Email address</Label><Input id="attendee-email" required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="student@rbunagpur.in" className="h-11 rounded-lg bg-white" /></div>
          <div className="space-y-2"><Label className="text-xs font-semibold text-slate-700">Ticket type</Label><Select value={form.ticketType} onValueChange={value => setForm({ ...form, ticketType: value })}><SelectTrigger className="h-11 rounded-lg bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Student">Student</SelectItem><SelectItem value="General">General</SelectItem><SelectItem value="VIP">VIP</SelectItem></SelectContent></Select></div>
          <div className="flex gap-3 border-t border-slate-200 pt-5"><Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button><Button className="flex-1 indigo-glow" type="submit" disabled={submitting || !form.eventId}>{submitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}{submitting ? "Registering..." : "Complete registration"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
