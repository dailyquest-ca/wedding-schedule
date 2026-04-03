-- Ensure deduplicated signup rows and enforce uniqueness for conflict-safe writes.

-- Remove duplicates, keeping the earliest row per (event_id, guest_id).
DELETE FROM event_signups a
USING event_signups b
WHERE a.id > b.id
  AND a.event_id = b.event_id
  AND a.guest_id = b.guest_id;

-- Recreate/ensure unique index for (event_id, guest_id).
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_signups_event_guest_unique
  ON event_signups(event_id, guest_id);
