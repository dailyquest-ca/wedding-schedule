import { neon, NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const rawUrl = process.env.DATABASE_URL;
    if (!rawUrl) throw new Error("DATABASE_URL environment variable is not set");
    const url = rawUrl.replace(/\\n/g, "").trim();
    if (!url) throw new Error("DATABASE_URL is empty after trimming");
    _sql = neon(url);
  }
  return _sql;
}
