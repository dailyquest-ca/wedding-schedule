-- Events table
CREATE TABLE IF NOT EXISTS events (
  id              TEXT PRIMARY KEY,
  day_date        DATE NOT NULL,
  time_label      TEXT NOT NULL,
  category        TEXT NOT NULL,
  signup_enabled  BOOLEAN NOT NULL DEFAULT false,
  active          BOOLEAN NOT NULL DEFAULT true,
  source          TEXT NOT NULL DEFAULT 'custom',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event i18n (labels + descriptions per locale)
CREATE TABLE IF NOT EXISTS event_i18n (
  event_id    TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  locale      TEXT NOT NULL CHECK (locale IN ('en','ja')),
  label       TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (event_id, locale)
);

-- Site notes (admin-editable)
CREATE TABLE IF NOT EXISTS site_notes (
  locale  TEXT NOT NULL CHECK (locale IN ('en','ja')),
  idx     INT NOT NULL,
  text    TEXT NOT NULL,
  PRIMARY KEY (locale, idx)
);

-- Seed the 8 existing signuppable events
INSERT INTO events (id, day_date, time_label, category, signup_enabled, source) VALUES
  ('apr6-dinner',       '2026-04-06', '7:00 PM',          'dinner',    true, 'base'),
  ('apr7-dinner',       '2026-04-07', '6:30 PM',          'dinner',    true, 'base'),
  ('apr8-chichen-itza', '2026-04-08', '6:00 AM – 6:00 PM','excursion', true, 'base'),
  ('apr8-dinner',       '2026-04-08', '8:00 PM',          'dinner',    true, 'base'),
  ('apr11-golf',        '2026-04-09', 'Morning',          'excursion', true, 'base'),
  ('apr11-coco-bongo',  '2026-04-11', 'Evening',          'excursion', true, 'base'),
  ('apr12-outing',      '2026-04-12', 'Daytime',          'excursion', true, 'base'),
  ('apr12-dinner',      '2026-04-12', 'Evening',          'dinner',    true, 'base')
ON CONFLICT (id) DO NOTHING;

-- Seed EN labels
INSERT INTO event_i18n (event_id, locale, label, description) VALUES
  ('apr6-dinner',       'en', 'Dinner (venue TBD)',                       'Group dinner — location to be confirmed.'),
  ('apr7-dinner',       'en', 'Welcome Dinner at Main Buffet',            'This might be moved or cancelled — we''ll confirm soon.'),
  ('apr8-chichen-itza', 'en', 'Chichen Itza, Cenote & Valladolid tour',  'All-day excursion to the ruins, cenote swim, and Valladolid.'),
  ('apr8-dinner',       'en', 'Late dinner (venue TBD)',                  'Dinner after the tour — location to be confirmed.'),
  ('apr11-golf',        'en', 'Scramble golf tournament',                 'All skill levels welcome.'),
  ('apr11-coco-bongo',  'en', 'Cancun & Coco Bongo',                     'Evening trip to Cancun for those still around.'),
  ('apr12-outing',      'en', 'Optional group outing',                   'Jet skis, boat rental, scuba diving, or adventure park — details in the group.'),
  ('apr12-dinner',      'en', 'Final dinner at La Rinascita',             'One last group dinner together.')
ON CONFLICT (event_id, locale) DO NOTHING;

-- Seed JA labels
INSERT INTO event_i18n (event_id, locale, label, description) VALUES
  ('apr6-dinner',       'ja', 'ディナー（会場未定）',                              'グループディナー — 場所は後日お知らせします。'),
  ('apr7-dinner',       'ja', 'ウェルカムディナー メインビュッフェ（仮）',          '変更または中止になる可能性があります。決まり次第お知らせします。'),
  ('apr8-chichen-itza', 'ja', 'チチェン・イッツァ、セノーテ＆バジャドリド ツアー',   '終日 — 遺跡、セノーテでの水泳、バジャドリド観光。'),
  ('apr8-dinner',       'ja', '遅めのディナー（会場未定）',                         'ツアー後のディナー — 場所は後日お知らせします。'),
  ('apr11-golf',        'ja', 'スクランブルゴルフトーナメント',                     'レベル問わず参加歓迎。'),
  ('apr11-coco-bongo',  'ja', 'カンクン＆Coco Bongo',                              'まだいるメンバーでカンクンへ。'),
  ('apr12-outing',      'ja', 'オプションのグループアクティビティ',                 'ジェットスキー、ボートレンタル、スキューバ、アドベンチャーパーク — グループでご確認ください。'),
  ('apr12-dinner',      'ja', 'La Rinascitaで最後のディナー',                        'みんなで最後のグループディナー。')
ON CONFLICT (event_id, locale) DO NOTHING;

-- Seed EN notes
INSERT INTO site_notes (locale, idx, text) VALUES
  ('en', 0, 'Wedding day: Thursday, April 9, 2026.'),
  ('en', 1, 'Arrival and departure times are approximate.'),
  ('en', 2, 'Dress code: semi-formal / smart casual.'),
  ('en', 3, 'Dietary needs? Let us know via WhatsApp.')
ON CONFLICT (locale, idx) DO NOTHING;

-- Seed JA notes
INSERT INTO site_notes (locale, idx, text) VALUES
  ('ja', 0, '結婚式は2026年4月9日（木）です。'),
  ('ja', 1, '到着・出発時刻は目安です。'),
  ('ja', 2, 'ドレスコード：セミフォーマル／スマートカジュアル。'),
  ('ja', 3, '食事の制限がある方はWhatsAppでお知らせください。')
ON CONFLICT (locale, idx) DO NOTHING;
