const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Something went wrong.");
  return payload;
};

export const api = {
  getStats: () => request("/api/dashboard/stats"),
  getEvents: (q = "") => request(`/api/events?q=${encodeURIComponent(q)}`),
  getEvent: (id) => request(`/api/events/${id}`),
  createEvent: (data) => request("/api/events", { method: "POST", body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: "DELETE" }),
  getAttendees: (q = "") => request(`/api/attendees?q=${encodeURIComponent(q)}`),
  registerAttendee: (data) => request("/api/attendees/register", { method: "POST", body: JSON.stringify(data) }),
  deleteAttendee: (id) => request(`/api/attendees/${id}`, { method: "DELETE" })
};
