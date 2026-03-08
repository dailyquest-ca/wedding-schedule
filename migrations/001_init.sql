CREATE TABLE IF NOT EXISTS event_signups (
  id            SERIAL PRIMARY KEY,
  event_id      TEXT NOT NULL,
  guest_id      TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, guest_id)
);

CREATE INDEX IF NOT EXISTS idx_signups_event ON event_signups(event_id);
