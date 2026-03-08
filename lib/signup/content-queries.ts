import { getDb } from "@/lib/db";
import type { DbEventFull, PublicContentResponse } from "./types";

export async function getDbEvents(): Promise<DbEventFull[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT
      e.id,
      e.day_date,
      e.time_label,
      e.category,
      e.signup_enabled,
      e.active,
      e.source,
      en.label   AS label_en,
      en.description AS description_en,
      ja.label   AS label_ja,
      ja.description AS description_ja
    FROM events e
    LEFT JOIN event_i18n en ON en.event_id = e.id AND en.locale = 'en'
    LEFT JOIN event_i18n ja ON ja.event_id = e.id AND ja.locale = 'ja'
    ORDER BY e.day_date, e.time_label
  `;

  return rows.map((r) => ({
    id: r.id as string,
    dayDate: (r.day_date as string).slice(0, 10),
    timeLabel: r.time_label as string,
    category: r.category as string,
    signupEnabled: r.signup_enabled as boolean,
    active: r.active as boolean,
    source: r.source as "base" | "custom",
    labelEn: (r.label_en as string) ?? "",
    descriptionEn: (r.description_en as string) ?? null,
    labelJa: (r.label_ja as string) ?? "",
    descriptionJa: (r.description_ja as string) ?? null,
  }));
}

export async function getDbNotes(): Promise<{ en: string[]; ja: string[] }> {
  const sql = getDb();
  const rows = await sql`
    SELECT locale, idx, text
    FROM site_notes
    ORDER BY locale, idx
  `;

  const en: string[] = [];
  const ja: string[] = [];
  for (const r of rows) {
    if (r.locale === "en") en.push(r.text as string);
    else if (r.locale === "ja") ja.push(r.text as string);
  }
  return { en, ja };
}

export async function getPublicContent(): Promise<PublicContentResponse> {
  const [events, notes] = await Promise.all([getDbEvents(), getDbNotes()]);
  return { events, notes };
}

export async function upsertEvent(
  id: string,
  dayDate: string,
  timeLabel: string,
  category: string,
  signupEnabled: boolean,
  active: boolean,
  source: "base" | "custom",
  labelEn: string,
  descriptionEn: string | null,
  labelJa: string,
  descriptionJa: string | null
): Promise<void> {
  const sql = getDb();

  await sql`
    INSERT INTO events (id, day_date, time_label, category, signup_enabled, active, source, updated_at)
    VALUES (${id}, ${dayDate}, ${timeLabel}, ${category}, ${signupEnabled}, ${active}, ${source}, now())
    ON CONFLICT (id) DO UPDATE SET
      day_date = EXCLUDED.day_date,
      time_label = EXCLUDED.time_label,
      category = EXCLUDED.category,
      signup_enabled = EXCLUDED.signup_enabled,
      active = EXCLUDED.active,
      updated_at = now()
  `;

  await sql`
    INSERT INTO event_i18n (event_id, locale, label, description)
    VALUES (${id}, 'en', ${labelEn}, ${descriptionEn})
    ON CONFLICT (event_id, locale) DO UPDATE SET
      label = EXCLUDED.label,
      description = EXCLUDED.description
  `;

  await sql`
    INSERT INTO event_i18n (event_id, locale, label, description)
    VALUES (${id}, 'ja', ${labelJa}, ${descriptionJa})
    ON CONFLICT (event_id, locale) DO UPDATE SET
      label = EXCLUDED.label,
      description = EXCLUDED.description
  `;
}

export async function deleteEvent(id: string): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM events WHERE id = ${id}`;
}

export async function replaceNotes(en: string[], ja: string[]): Promise<void> {
  const sql = getDb();

  await sql`DELETE FROM site_notes WHERE locale = 'en'`;
  for (let i = 0; i < en.length; i++) {
    await sql`INSERT INTO site_notes (locale, idx, text) VALUES ('en', ${i}, ${en[i]})`;
  }

  await sql`DELETE FROM site_notes WHERE locale = 'ja'`;
  for (let i = 0; i < ja.length; i++) {
    await sql`INSERT INTO site_notes (locale, idx, text) VALUES ('ja', ${i}, ${ja[i]})`;
  }
}

export async function isSignupEnabledEvent(eventId: string): Promise<boolean> {
  const sql = getDb();
  const rows = await sql`
    SELECT 1 FROM events
    WHERE id = ${eventId} AND signup_enabled = true AND active = true
    LIMIT 1
  `;
  return rows.length > 0;
}
