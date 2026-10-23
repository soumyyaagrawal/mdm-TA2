import { Router } from "express";
import { z } from "zod";
import db from "../db/database.js";

const router = Router();

const attendeeSchema = z.object({
  eventId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2, "Attendee name is required."),
  email: z.string().trim().email("Please enter a valid email address."),
  ticketType: z.enum(["Student", "General", "VIP"]).default("General")
});

router.get("/", (req, res) => {
  const q = String(req.query.q || "").trim();
  const rows = db.prepare(`
    SELECT a.id, a.event_id, a.name, a.email, a.ticket_type, a.created_at,
           e.name AS event_name, e.club
    FROM attendees a
    JOIN events e ON e.id = a.event_id
    WHERE a.name LIKE @search
       OR a.email LIKE @search
       OR e.name LIKE @search
       OR e.club LIKE @search
    ORDER BY a.created_at DESC
  `).all({ search: `%${q}%` });

  res.json({ success: true, data: rows });
});

router.get("/search", (req, res) => {
  const q = String(req.query.q || "").trim();
  const rows = db.prepare(`
    SELECT a.id, a.event_id, a.name, a.email, a.ticket_type, a.created_at,
           e.name AS event_name, e.club
    FROM attendees a
    JOIN events e ON e.id = a.event_id
    WHERE a.name LIKE @search
       OR a.email LIKE @search
       OR e.name LIKE @search
    ORDER BY a.name ASC
  `).all({ search: `%${q}%` });

  res.json({ success: true, data: rows });
});

router.post("/register", (req, res) => {
  const parsed = attendeeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  const { eventId, name, email, ticketType } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const event = db.prepare("SELECT * FROM events WHERE id = ?").get(eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "Cannot register: event does not exist." });
  }

  const count = db.prepare("SELECT COUNT(*) AS count FROM attendees WHERE event_id = ?").get(eventId).count;
  if (count >= event.capacity) {
    return res.status(409).json({ success: false, message: "Registration failed: this event is full." });
  }

  const duplicate = db.prepare(`
    SELECT id FROM attendees WHERE event_id = ? AND lower(email) = lower(?)
  `).get(eventId, normalizedEmail);

  if (duplicate) {
    return res.status(409).json({ success: false, message: "This attendee is already registered for this event." });
  }

  try {
    const result = db.prepare(`
      INSERT INTO attendees (event_id, name, email, ticket_type)
      VALUES (?, ?, ?, ?)
    `).run(eventId, name, normalizedEmail, ticketType);

    const attendee = db.prepare(`
      SELECT a.*, e.name AS event_name, e.club
      FROM attendees a JOIN events e ON e.id = a.event_id
      WHERE a.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ success: true, data: attendee, message: "Attendee registered successfully." });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ success: false, message: "Duplicate attendee registration." });
    }
    throw error;
  }
});

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM attendees WHERE id = ?").run(req.params.id);
  if (!result.changes) return res.status(404).json({ success: false, message: "Attendee not found." });
  res.json({ success: true, message: "Attendee deleted successfully." });
});

export default router;
