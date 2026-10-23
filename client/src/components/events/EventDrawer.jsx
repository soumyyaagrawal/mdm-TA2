import { useState } from "react";
import { CalendarPlus, LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial = { name: "", date: "", venue: "", club: "", capacity: 100 };

export function EventDrawer({ open, onOpenChange, onCreate }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onCreate({ ...form, capacity: Number(form.capacity) });
      setForm(initial);
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
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5 pr-14">
          <DialogHeader><DialogTitle className="flex items-center gap-2 font-[Manrope] text-xl"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-primary"><CalendarPlus className="h-4 w-4" /></span>Create event</DialogTitle><DialogDescription className="mt-2">Publish a new activity for an RBU club or community.</DialogDescription></DialogHeader>
        </div>
        <form onSubmit={submit} className="space-y-5 p-6">
          {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {[
            ["name", "Event name", "e.g. RBU Tech Fest"],
            ["date", "Date", ""],
            ["venue", "Venue", "e.g. RBU Main Auditorium"],
            ["club", "Club / community", "e.g. CodeBreakers Club"]
          ].map(([key, label, placeholder]) => (
            <div key={key} className="space-y-2"><Label htmlFor={key} className="text-xs font-semibold text-slate-700">{label}</Label><Input id={key} required minLength={key === "name" || key === "venue" || key === "club" ? 2 : undefined} type={key === "date" ? "date" : "text"} placeholder={placeholder} value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} className="h-11 rounded-lg bg-white" /></div>
          ))}
          <div className="space-y-2"><Label htmlFor="capacity" className="text-xs font-semibold text-slate-700">Maximum capacity</Label><Input id="capacity" required type="number" min="1" max="100000" value={form.capacity} onChange={event => setForm({ ...form, capacity: event.target.value })} className="h-11 rounded-lg bg-white" /><p className="text-[11px] text-slate-400">Attendees will not be able to register after this limit is reached.</p></div>
          <div className="flex gap-3 border-t border-slate-200 pt-5"><Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button><Button className="flex-1 indigo-glow" type="submit" disabled={submitting}>{submitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}{submitting ? "Creating..." : "Create event"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
