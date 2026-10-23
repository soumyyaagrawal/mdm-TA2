# RBU Event Manager — Objective Verification

## Objective 1 — Frontend
- [x] Event name
- [x] Date
- [x] Venue
- [x] Club / community
- [x] Capacity
- [x] Attendee name
- [x] Email
- [x] Ticket type
- [x] Event listing
- [x] Attendee listing
- [x] Dynamic form submission and validation feedback in the UI

## Objective 2 — REST API
- [x] Add event
- [x] List events
- [x] View event by id
- [x] List attendees
- [x] Search attendees
- [x] Register attendee
- [x] Delete attendee
- [x] Delete event
- [x] Dashboard statistics
- [x] Health endpoint
- [x] Correct JSON responses and HTTP status handling

## Objective 3 — Database
- [x] SQLite
- [x] Events table
- [x] Attendees table
- [x] One-to-many relationship
- [x] Foreign key relationship on attendees.event_id
- [x] ON DELETE CASCADE behavior
- [x] PRAGMA foreign_keys = ON
- [x] Existing seeded database preserved

## Objective 4 — Frontend/Backend Integration
- [x] Fetch API
- [x] JSON exchange
- [x] GET requests
- [x] POST requests
- [x] DELETE requests
- [x] Dynamic rendering without reload
- [x] No manual refresh required after CRUD actions
- [x] Vite proxy forwarding to Express backend

## Objective 5 — Validation
- [x] Required fields
- [x] Email validation
- [x] Duplicate registration prevention
- [x] Database uniqueness constraint for (event_id, email)
- [x] Non-existent event handling
- [x] Full event handling
- [x] Validation messages surfaced to user and API clients

## Objective 6 — Dynamic UI
- [x] Event rendering
- [x] Attendee rendering
- [x] Search by attendee name, attendee email, event name, club
- [x] Dynamic updates after create/register/delete/search
- [x] Professional shadcn-style interface maintained

## Objective 7 — Functional Testing
- [x] Valid registration
- [x] Duplicate registration rejected with 409
- [x] Full event rejected with 409
- [x] Non-existent event rejected with 404
- [x] Invalid email rejected with 400
- [x] Missing required fields rejected
- [x] Delete attendee works
- [x] Delete event works
- [x] Related attendee records are removed when an event is deleted
- [x] Create event adds event immediately to system view

## Objective 8 — Full Stack
- [x] Node.js
- [x] Express.js
- [x] Middleware
- [x] Routing
- [x] SQLite
- [x] REST API
- [x] Frontend integration
- [x] Backend and frontend run together in development
