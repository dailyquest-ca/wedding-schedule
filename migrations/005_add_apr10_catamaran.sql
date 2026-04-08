-- Add Friday catamaran excursion as a signuppable event.
-- This is additive and does not modify existing signup rows.

INSERT INTO events (id, day_date, time_label, category, signup_enabled, active, source)
VALUES ('apr10-catamaran', '2026-04-10', 'Daytime', 'excursion', true, true, 'base')
ON CONFLICT (id) DO UPDATE SET
  day_date = EXCLUDED.day_date,
  time_label = EXCLUDED.time_label,
  category = EXCLUDED.category,
  signup_enabled = EXCLUDED.signup_enabled,
  active = EXCLUDED.active,
  source = EXCLUDED.source,
  updated_at = now();

INSERT INTO event_i18n (event_id, locale, label, description)
VALUES (
  'apr10-catamaran',
  'en',
  'Catamaran to Isla Mujeres (snorkeling + island explore)',
  'Boat excursion (up to 30 people): catamaran, snorkeling, and time on Isla Mujeres. RSVP ASAP by around 4:00 PM. Cost: $145 USD per person.'
)
ON CONFLICT (event_id, locale) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description;

INSERT INTO event_i18n (event_id, locale, label, description)
VALUES (
  'apr10-catamaran',
  'ja',
  'カタマランでイスラ・ムヘーレスへ（シュノーケリング＆島散策）',
  '最大30名のボートツアー。カタマラン、シュノーケリング、イスラ・ムヘーレス散策。参加可否はなるべく早く、目安16:00までにお知らせください。料金：1名あたり145米ドル。'
)
ON CONFLICT (event_id, locale) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description;
