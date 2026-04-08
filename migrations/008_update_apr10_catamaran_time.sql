-- Update catamaran time window to 11:00 AM - 7:00 PM ish.
UPDATE events
SET time_label = '11:00 AM–7:00 PM (ish)',
    updated_at = now()
WHERE id = 'apr10-catamaran';
