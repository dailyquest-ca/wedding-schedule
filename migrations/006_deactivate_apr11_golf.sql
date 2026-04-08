-- Remove golf signup option from active schedule without touching existing signup rows.
UPDATE events
SET active = false,
    signup_enabled = false,
    updated_at = now()
WHERE id = 'apr11-golf';
