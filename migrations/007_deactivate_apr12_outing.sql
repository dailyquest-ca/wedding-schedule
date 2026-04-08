-- Remove optional group outing from active schedule without deleting any historical signup rows.
UPDATE events
SET active = false,
    signup_enabled = false,
    updated_at = now()
WHERE id = 'apr12-outing';
