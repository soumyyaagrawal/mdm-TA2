import { Router } from "express";
import db from "../db/database.js";

const router = Router();

router.get("/stats", (req, res) => {
  const events = db.prepare("SELECT COUNT(*) AS count FROM events").get().count;
  const attendees = db.prepare("SELECT COUNT(*) AS count FROM attendees").get().count;
  const upcoming = db.prepare("SELECT COUNT(*) AS count FROM events WHERE date >= date('now')").get().count;
  const capacity = db.prepare("SELECT COALESCE(SUM(capacity), 0) AS total FROM events").get().total;

  res.json({
    success: true,
    data: {
      events,
      attendees,
      upcomingEvents: upcoming,
      availableSeats: Math.max(Number(capacity) - Number(attendees), 0)
    }
  });
});

export default router;
