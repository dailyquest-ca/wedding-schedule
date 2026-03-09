import { getDb } from "@/lib/db";
import type { DbEventFull, PublicContentResponse } from "./types";

export async function getDbEvents(): Promise<DbEventFull[]> {
  const sql = getDb();
  try {
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

    // #region agent log
    const _p = {sessionId:'e76c53',runId:'pre-fix',hypothesisId:'H1',location:'lib/signup/content-queries.ts:~24',message:'getDbEvents rows fetched',data:{rowsLen:rows.length,sampleDayDateType:typeof (rows[0] as any)?.day_date,sampleDayDateCtor:((rows[0] as any)?.day_date && (rows[0] as any).day_date.constructor)?(rows[0] as any).day_date.constructor.name:null},timestamp:Date.now()};
    fetch('http://127.0.0.1:7896/ingest/f9e706b0-cbe6-49af-9ca1-ef5c28b90de6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e76c53'},body:JSON.stringify(_p)}).catch(()=>{});
    import('fs/promises').then((fs)=>fs.appendFile('debug-e76c53.log', JSON.stringify(_p)+'\n')).catch(()=>{});
    // #endregion

    try {
      return rows.map((r) => ({
        id: r.id as string,
        dayDate:
          r.day_date instanceof Date
            ? r.day_date.toISOString().slice(0, 10)
            : String(r.day_date).slice(0, 10),
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
    } catch (error) {
      // #region agent log
      const _p = {sessionId:'e76c53',runId:'pre-fix',hypothesisId:'H1',location:'lib/signup/content-queries.ts:~40',message:'getDbEvents mapping error',data:{errorName:(error as any)?.name ?? null,errorMessage:(error as any)?.message ?? null},timestamp:Date.now()};
      fetch('http://127.0.0.1:7896/ingest/f9e706b0-cbe6-49af-9ca1-ef5c28b90de6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e76c53'},body:JSON.stringify(_p)}).catch(()=>{});
      import('fs/promises').then((fs)=>fs.appendFile('debug-e76c53.log', JSON.stringify(_p)+'\n')).catch(()=>{});
      // #endregion
      throw error;
    }
  } catch (error) {
    // #region agent log
    const _p = {sessionId:'e76c53',runId:'pre-fix',hypothesisId:'H1',location:'lib/signup/content-queries.ts:~50',message:'getDbEvents query error',data:{errorName:(error as any)?.name ?? null,errorMessage:(error as any)?.message ?? null},timestamp:Date.now()};
    fetch('http://127.0.0.1:7896/ingest/f9e706b0-cbe6-49af-9ca1-ef5c28b90de6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e76c53'},body:JSON.stringify(_p)}).catch(()=>{});
    import('fs/promises').then((fs)=>fs.appendFile('debug-e76c53.log', JSON.stringify(_p)+'\n')).catch(()=>{});
    // #endregion
    throw error;
  }
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
