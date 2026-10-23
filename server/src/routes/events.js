import { Router } from "express";
import { z } from "zod";
import db from "../db/database.js";

const router = Router();

const eventSchema = z.object({
  name: z.string().trim().min(2, "Event name is required."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD."),
  venue: z.string().trim().min(2, "Venue is required."),
  club: z.string().trim().min(2, "Club is required."),
  capacity: z.coerce.number().int().min(1).max(100000)
});

router.get("/", (req, res) => {
  const q = String(req.query.q || "").trim();
  const rows = db.prepare(`
    SELECT
      e.*,
      COUNT(a.id) AS attendee_count,
      MAX(e.capacity - COUNT(a.id), 0) AS seats_left
    FROM events e
    LEFT JOIN attendees a ON a.event_id = e.id
    WHERE e.name LIKE @search
       OR e.club LIKE @search
       OR e.venue LIKE @search
    GROUP BY e.id
    ORDER BY e.date ASC, e.id DESC
  `).all({ search: `%${q}%` });

  res.json({ success: true, data: rows });
});

router.get("/:id", (req, res) => {
  const event = db.prepare(`
    SELECT e.*, COUNT(a.id) AS attendee_count,
           MAX(e.capacity - COUNT(a.id), 0) AS seats_left
    FROM events e
    LEFT JOIN attendees a ON a.event_id = e.id
    WHERE e.id = ?
    GROUP BY e.id
  `).get(req.params.id);

  if (!event) return res.status(404).json({ success: false, message: "Event not found." });

  const attendees = db.prepare(`
    SELECT id, event_id, name, email, ticket_type, created_at
    FROM attendees WHERE event_id = ? ORDER BY created_at DESC
  `).all(req.params.id);

  res.json({ success: true, data: { ...event, attendees } });
});

router.post("/", (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  const { name, date, venue, club, capacity } = parsed.data;
  const result = db.prepare(`
    INSERT INTO events (name, date, venue, club, capacity)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, date, venue, club, capacity);

  const event = db.prepare("SELECT * FROM events WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: event, message: "Event created successfully." });
});

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
  if (!result.changes) return res.status(404).json({ success: false, message: "Event not found." });
  res.json({ success: true, message: "Event and its attendee records were deleted." });
});

export default router;
