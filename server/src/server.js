import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import eventsRouter from "./routes/events.js";
import attendeesRouter from "./routes/attendees.js";
import dashboardRouter from "./routes/dashboard.js";
import { initializeDatabase } from "./db/database.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");

dotenv.config({ path: path.resolve(projectRoot, "server", ".env") });
initializeDatabase();

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, app: "RBU Event Manager", status: "healthy" });
});

app.use("/api/events", eventsRouter);
app.use("/api/attendees", attendeesRouter);
app.use("/api/dashboard", dashboardRouter);

const clientDist = path.resolve(projectRoot, "client", "dist");

app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => err && next(err));
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`RBU Event Manager API running on http://localhost:${PORT}`);
});
