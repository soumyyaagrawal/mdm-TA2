import { useEffect, useMemo, useState } from "react";
import { Armchair, CalendarDays, ChevronRight, CircleCheck, MapPin, Plus, Search, TrendingUp, UserPlus, Users } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { StatCard } from "@/components/StatCard";
import { EventCard } from "@/components/events/EventCard";
import { EventDrawer } from "@/components/events/EventDrawer";
import { AttendeeDrawer } from "@/components/attendees/AttendeeDrawer";
import { AttendeesTable } from "@/components/attendees/AttendeesTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Toast } from "@/components/Toast";

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [stats, setStats] = useState({ events: 0, attendees: 0, upcomingEvents: 0, availableSeats: 0 });
  const [search, setSearch] = useState("");
  const [eventOpen, setEventOpen] = useState(false);
  const [attendeeOpen, setAttendeeOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const notify = (title, message) => {
    setToast({ title, message });
    window.setTimeout(() => setToast(null), 3500);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const [nextStats, nextEvents, nextAttendees] = await Promise.all([api.getStats(), api.getEvents(), api.getAttendees()]);
      setStats(nextStats.data);
      setEvents(nextEvents.data);
      setAttendees(nextAttendees.data);
    } catch (error) {
      notify("Connection error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return events;
    return events.filter(event => [event.name, event.club, event.venue].some(value => value.toLowerCase().includes(query)));
  }, [events, search]);

  const filteredAttendees = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return attendees;
    return attendees.filter(attendee => [attendee.name, attendee.email, attendee.event_name, attendee.club].some(value => value.toLowerCase().includes(query)));
  }, [attendees, search]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter(event => new Date(`${event.date}T00:00:00`) >= today);
  }, [events]);

  const createEvent = async data => {
    const response = await api.createEvent(data);
    notify("Event created", response.message);
    await refresh();
  };

  const registerAttendee = async data => {
    const response = await api.registerAttendee(data);
    notify("Registration complete", response.message);
    await refresh();
  };

  const deleteEvent = async event => {
    if (!confirm(`Delete "${event.name}"? All attendee records for this event will also be deleted.`)) return;
    try {
      const response = await api.deleteEvent(event.id);
      notify("Event deleted", response.message);
      setSelectedEvent(null);
      await refresh();
    } catch (error) {
      notify("Could not delete event", error.message);
    }
  };

  const deleteAttendee = async attendee => {
    if (!confirm(`Delete registration for ${attendee.name}?`)) return;
    try {
      const response = await api.deleteAttendee(attendee.id);
      notify("Attendee removed", response.message);
      await refresh();
    } catch (error) {
      notify("Could not remove attendee", error.message);
    }
  };

  const viewEvent = async event => {
    try {
      const response = await api.getEvent(event.id);
      setSelectedEvent(response.data);
    } catch (error) {
      notify("Could not load event", error.message);
    }
  };

  const navigate = page => {
    setActive(page);
    setSearch("");
    setSelectedEvent(null);
  };

  const openRegistration = event => {
    setSelectedEventId(event?.id || null);
    setAttendeeOpen(true);
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
          <p className="mt-4 text-sm font-medium text-slate-500">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar active={active} onNavigate={navigate} />
      <div className="min-w-0 lg:pl-[248px]">
        <Header active={active} search={search} setSearch={setSearch} />
        <main className="mx-auto max-w-[1500px] px-4 pb-28 pt-7 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          {active === "dashboard" && (
            <div className="enter-page space-y-7">
              <section className="relative overflow-hidden rounded-xl bg-slate-950 px-5 py-7 text-white sm:px-8 sm:py-8">
                <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,.42),transparent_68%)]" />
                <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300"><CircleCheck className="h-4 w-4" /> Live campus workspace</p>
                    <h2 className="mt-3 max-w-xl font-[Manrope] text-3xl font-bold leading-tight sm:text-[38px]">Create moments students remember.</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Manage RBU events and registrations from one focused command centre.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => openRegistration()} className="rounded-lg bg-white/10 text-white hover:bg-white/20"><UserPlus className="mr-2 h-4 w-4" /> Register attendee</Button>
                    <Button onClick={() => setEventOpen(true)} className="rounded-lg indigo-glow"><Plus className="mr-2 h-4 w-4" /> Create event</Button>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total events" value={stats.events} helper="Across all RBU clubs" icon={CalendarDays} tone="indigo" />
                <StatCard label="Registrations" value={stats.attendees} helper="Confirmed attendees" icon={Users} tone="violet" />
                <StatCard label="Upcoming" value={stats.upcomingEvents} helper="Events still to come" icon={TrendingUp} tone="emerald" />
                <StatCard label="Open seats" value={stats.availableSeats} helper="Across published events" icon={Armchair} tone="amber" />
              </section>

              <section>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div><h2 className="font-[Manrope] text-xl font-bold text-slate-950">Upcoming events</h2><p className="mt-1 text-sm text-slate-500">The latest scheduled activity across campus.</p></div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("events")}>View all <ChevronRight className="ml-1 h-4 w-4" /></Button>
                </div>
                {upcomingEvents.length ? (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{upcomingEvents.slice(0, 3).map((event, index) => <EventCard key={event.id} event={event} index={index} onDelete={deleteEvent} onRegister={openRegistration} onView={viewEvent} />)}</div>
                ) : <EmptyState icon={CalendarDays} title="No upcoming events" description="Create a campus event to get the schedule started." action="Create event" onAction={() => setEventOpen(true)} />}
              </section>

              <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
                <Card className="surface-card">
                  <CardHeader className="pb-4"><CardTitle>Community pulse</CardTitle><CardDescription>Capacity and demand across upcoming events.</CardDescription></CardHeader>
                  <CardContent>
                    {upcomingEvents.length ? <div className="divide-y divide-slate-100">{upcomingEvents.slice(0, 5).map(event => {
                      const percent = event.capacity ? Math.min((event.attendee_count / event.capacity) * 100, 100) : 0;
                      return <div key={event.id} className="grid gap-3 py-4 first:pt-0 sm:grid-cols-[1fr_160px] sm:items-center"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{event.name}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="h-3 w-3" /> {event.venue}</p></div><div><div className="mb-1.5 flex justify-between text-[10px] font-medium text-slate-500"><span>{event.attendee_count} joined</span><span>{event.capacity} seats</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${percent}%` }} /></div></div></div>;
                    })}</div> : <p className="py-8 text-center text-sm text-slate-400">No event activity yet.</p>}
                  </CardContent>
                </Card>

                <Card className="surface-card">
                  <CardHeader className="pb-3"><CardTitle>Recent registrations</CardTitle><CardDescription>Latest attendees joining campus events.</CardDescription></CardHeader>
                  <CardContent>
                    {attendees.length ? <div className="divide-y divide-slate-100">{attendees.slice(0, 5).map(attendee => <div key={attendee.id} className="flex items-center gap-3 py-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-primary">{attendee.name.split(" ").map(word => word[0]).slice(0, 2).join("")}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{attendee.name}</p><p className="truncate text-xs text-slate-400">{attendee.event_name}</p></div><span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">{attendee.ticket_type}</span></div>)}</div> : <p className="py-8 text-center text-sm text-slate-400">No registrations yet.</p>}
                  </CardContent>
                </Card>
              </section>
            </div>
          )}

          {active === "events" && (
            <div className="enter-page">
              <PageHeading title="Events" description="Plan, publish and manage every campus activity." action="Create event" onAction={() => setEventOpen(true)} icon={Plus} />
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:max-w-md"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, club or venue" className="h-11 pl-10" /></div>
                <p className="text-xs font-medium text-slate-400">{filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}</p>
              </div>
              {filteredEvents.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredEvents.map((event, index) => <EventCard key={event.id} event={event} index={index} onDelete={deleteEvent} onRegister={openRegistration} onView={viewEvent} />)}</div> : <EmptyState icon={CalendarDays} title="No matching events" description="Try a different name, club or venue." />}

              {selectedEvent && <Card className="surface-card mt-6 overflow-hidden border-indigo-200"><div className="grid lg:grid-cols-[280px_1fr]"><div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-100">Event details</p><h3 className="mt-3 font-[Manrope] text-2xl font-bold">{selectedEvent.name}</h3><p className="mt-3 flex items-center gap-2 text-sm text-indigo-100"><CalendarDays className="h-4 w-4" /> {selectedEvent.date}</p><p className="mt-2 flex items-center gap-2 text-sm text-indigo-100"><MapPin className="h-4 w-4" /> {selectedEvent.venue}</p></div><CardContent className="p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">Attendee list</p><p className="mt-1 text-xs text-slate-400">{selectedEvent.attendees.length} registered of {selectedEvent.capacity} seats</p></div><Button size="sm" onClick={() => openRegistration(selectedEvent)}><Plus className="mr-2 h-4 w-4" /> Add attendee</Button></div>{selectedEvent.attendees.length ? <div className="mt-5 grid gap-2 sm:grid-cols-2">{selectedEvent.attendees.map(attendee => <div key={attendee.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-xs font-bold text-primary shadow-sm">{attendee.name[0]}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{attendee.name}</p><p className="truncate text-xs text-slate-400">{attendee.email}</p></div></div>)}</div> : <p className="mt-5 rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-400">No attendees registered yet.</p>}</CardContent></div></Card>}
            </div>
          )}

          {active === "attendees" && (
            <div className="enter-page">
              <PageHeading title="Registrations" description="Search and manage every attendee record." action="Register attendee" onAction={() => openRegistration()} icon={UserPlus} />
              <div className="relative mb-5 sm:hidden"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search registrations" className="h-11 pl-10" /></div>
              {filteredAttendees.length ? <Card className="surface-card overflow-hidden"><CardContent className="p-0"><AttendeesTable attendees={filteredAttendees} onDelete={deleteAttendee} /></CardContent></Card> : <EmptyState icon={Users} title="No registrations found" description="No attendee records match this search." />}
            </div>
          )}
        </main>
      </div>

      <MobileNav active={active} onNavigate={navigate} />
      <EventDrawer open={eventOpen} onOpenChange={setEventOpen} onCreate={createEvent} />
      <AttendeeDrawer open={attendeeOpen} onOpenChange={setAttendeeOpen} events={events} selectedEventId={selectedEventId} onRegister={registerAttendee} />
      <Toast toast={toast} />
    </div>
  );
}

function PageHeading({ title, description, action, onAction, icon: Icon }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="page-title">{title}</h2><p className="page-subtitle">{description}</p></div><Button onClick={onAction} className="rounded-lg indigo-glow"><Icon className="mr-2 h-4 w-4" /> {action}</Button></div>;
}

function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-primary"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-[Manrope] font-bold text-slate-900">{title}</h3><p className="mt-1 text-sm text-slate-400">{description}</p>{action && <Button variant="outline" className="mt-5" onClick={onAction}><Plus className="mr-2 h-4 w-4" /> {action}</Button>}</div>;
}
