"use client";

import { useState } from "react";
import type { EventRoster, DbEventFull } from "@/lib/signup/types";
import { SCHEDULE_DATES } from "@/lib/schedule-dates";
import styles from "./admin.module.css";

interface AdminData {
  rosters: EventRoster[];
  events: DbEventFull[];
  notes: { en: string[]; ja: string[] };
}

const CATEGORIES = ["excursion", "dinner", "busy", "wedding", "free", "travel"];

const EMPTY_EVENT: Omit<DbEventFull, "id"> = {
  dayDate: SCHEDULE_DATES[0],
  timeLabel: "",
  category: "dinner",
  signupEnabled: true,
  active: true,
  source: "custom",
  labelEn: "",
  descriptionEn: null,
  labelJa: "",
  descriptionJa: null,
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"rosters" | "events" | "notes">("rosters");
  const [editingEvent, setEditingEvent] = useState<DbEventFull | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const headers = { "x-admin-password": password, "Content-Type": "application/json" };

  const fetchData = async () => {
    const res = await fetch("/api/admin/events", { headers: { "x-admin-password": password } });
    if (!res.ok) return null;
    return (await res.json()) as AdminData;
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await fetchData();
      if (!result) {
        setError("Incorrect password or failed to load");
        setLoading(false);
        return;
      }
      setData(result);
      setAuthenticated(true);
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleSaveEvent = async (ev: DbEventFull) => {
    setSaving(true);
    try {
      const method = isCreating ? "POST" : "PUT";
      const res = await fetch("/api/admin/events", {
        method,
        headers,
        body: JSON.stringify(ev),
      });
      if (res.ok) {
        const refreshed = await fetchData();
        if (refreshed) setData(refreshed);
        setEditingEvent(null);
        setIsCreating(false);
      } else {
        const err = await res.json();
        alert(err.error || "Save failed");
      }
    } catch {
      alert("Network error");
    }
    setSaving(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event and all its signups?")) return;
    setSaving(true);
    try {
      await fetch("/api/admin/events", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ id }),
      });
      const refreshed = await fetchData();
      if (refreshed) setData(refreshed);
    } catch {
      alert("Network error");
    }
    setSaving(false);
  };

  const handleSaveNotes = async (notes: { en: string[]; ja: string[] }) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "PUT",
        headers,
        body: JSON.stringify({ type: "notes", ...notes }),
      });
      if (res.ok) {
        const refreshed = await fetchData();
        if (refreshed) setData(refreshed);
      }
    } catch {
      alert("Network error");
    }
    setSaving(false);
  };

  const handleExportCsv = () => {
    if (!data) return;
    const lines = ["Event,Guest"];
    data.rosters.forEach((r) => {
      r.guests.forEach((g) => {
        lines.push(`"${r.titleEn}","${g.firstName}"`);
      });
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-signups.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated || !data) {
    return (
      <div className={styles.page}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Admin</h1>
          <label className={styles.label} htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.loginBtn} onClick={handleLogin} disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </div>
    );
  }

  const totalSignups = data.rosters.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <span className={styles.totalBadge}>{totalSignups} total signups</span>
        </header>

        <nav className={styles.tabs}>
          {(["rosters", "events", "notes"] as const).map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ""}`}
              onClick={() => { setTab(t); setEditingEvent(null); setIsCreating(false); }}
            >
              {t === "rosters" ? "Signups" : t === "events" ? "Events" : "Notes"}
            </button>
          ))}
        </nav>

        {tab === "rosters" && (
          <RostersTab rosters={data.rosters} onExport={handleExportCsv} />
        )}

        {tab === "events" && (
          <EventsTab
            events={data.events}
            editingEvent={editingEvent}
            isCreating={isCreating}
            saving={saving}
            onEdit={(ev) => { setEditingEvent(ev); setIsCreating(false); }}
            onCreate={() => {
              setEditingEvent({ id: "", ...EMPTY_EVENT } as unknown as DbEventFull);
              setIsCreating(true);
            }}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onCancel={() => { setEditingEvent(null); setIsCreating(false); }}
          />
        )}

        {tab === "notes" && (
          <NotesTab notes={data.notes} saving={saving} onSave={handleSaveNotes} />
        )}
      </div>
    </div>
  );
}

function RostersTab({ rosters, onExport }: { rosters: EventRoster[]; onExport: () => void }) {
  return (
    <>
      <div className={styles.headerActions}>
        <button className={styles.exportBtn} onClick={onExport}>Export CSV</button>
      </div>
      <div className={styles.rosterGrid}>
        {rosters.map((roster) => (
          <div key={roster.eventId} className={styles.rosterCard}>
            <div className={styles.rosterHeader}>
              <h2 className={styles.rosterTitle}>{roster.titleEn}</h2>
              <span className={styles.rosterCount}>{roster.count}</span>
            </div>
            {roster.guests.length === 0 ? (
              <p className={styles.emptyMsg}>No signups yet</p>
            ) : (
              <ul className={styles.guestList}>
                {roster.guests.map((g) => (
                  <li key={g.guestId} className={styles.guestItem}>{g.firstName}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function EventsTab({
  events, editingEvent, isCreating, saving,
  onEdit, onCreate, onSave, onDelete, onCancel,
}: {
  events: DbEventFull[];
  editingEvent: DbEventFull | null;
  isCreating: boolean;
  saving: boolean;
  onEdit: (ev: DbEventFull) => void;
  onCreate: () => void;
  onSave: (ev: DbEventFull) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}) {
  if (editingEvent) {
    return (
      <EventForm
        event={editingEvent}
        isNew={isCreating}
        saving={saving}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <>
      <div className={styles.headerActions}>
        <button className={styles.addBtn} onClick={onCreate}>+ Add Event</button>
      </div>
      <div className={styles.eventList}>
        {events.map((ev) => (
          <div key={ev.id} className={`${styles.eventRow} ${!ev.active ? styles.eventInactive : ""}`}>
            <div className={styles.eventInfo}>
              <strong>{ev.labelEn}</strong>
              <span className={styles.eventMeta}>
                {ev.dayDate} · {ev.timeLabel} · {ev.category}
                {ev.signupEnabled && " · signups on"}
                {!ev.active && " · inactive"}
                {ev.source === "custom" && " · custom"}
              </span>
            </div>
            <div className={styles.eventActions}>
              <button className={styles.editBtn} onClick={() => onEdit(ev)}>Edit</button>
              {ev.source === "custom" && (
                <button className={styles.deleteBtn} onClick={() => onDelete(ev.id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EventForm({
  event, isNew, saving, onSave, onCancel,
}: {
  event: DbEventFull;
  isNew: boolean;
  saving: boolean;
  onSave: (ev: DbEventFull) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<DbEventFull>({ ...event });
  const set = (field: string, value: string | boolean | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>{isNew ? "New Event" : "Edit Event"}</h3>

      {isNew && (
        <div className={styles.formRow}>
          <label className={styles.label}>ID (slug)</label>
          <input className={styles.input} value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="e.g. apr10-snorkel" />
        </div>
      )}

      <div className={styles.formRow}>
        <label className={styles.label}>Day</label>
        <select className={styles.input} value={form.dayDate} onChange={(e) => set("dayDate", e.target.value)}>
          {SCHEDULE_DATES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>Time</label>
        <input className={styles.input} value={form.timeLabel} onChange={(e) => set("timeLabel", e.target.value)} placeholder="e.g. 3:00 PM" />
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>Category</label>
        <select className={styles.input} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className={styles.formRow}>
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={form.signupEnabled} onChange={(e) => set("signupEnabled", e.target.checked)} />
          Signups enabled
        </label>
        <label className={styles.checkLabel}>
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
          Active (visible to guests)
        </label>
      </div>

      <fieldset className={styles.fieldset}>
        <legend>English</legend>
        <div className={styles.formRow}>
          <label className={styles.label}>Label</label>
          <input className={styles.input} value={form.labelEn} onChange={(e) => set("labelEn", e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} value={form.descriptionEn ?? ""} onChange={(e) => set("descriptionEn", e.target.value || null)} />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>日本語</legend>
        <div className={styles.formRow}>
          <label className={styles.label}>ラベル</label>
          <input className={styles.input} value={form.labelJa} onChange={(e) => set("labelJa", e.target.value)} />
        </div>
        <div className={styles.formRow}>
          <label className={styles.label}>説明</label>
          <textarea className={styles.textarea} value={form.descriptionJa ?? ""} onChange={(e) => set("descriptionJa", e.target.value || null)} />
        </div>
      </fieldset>

      <div className={styles.formActions}>
        <button className={styles.loginBtn} onClick={() => onSave(form)} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button className={styles.exportBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function NotesTab({
  notes, saving, onSave,
}: {
  notes: { en: string[]; ja: string[] };
  saving: boolean;
  onSave: (notes: { en: string[]; ja: string[] }) => void;
}) {
  const [enNotes, setEnNotes] = useState(notes.en);
  const [jaNotes, setJaNotes] = useState(notes.ja);

  const updateNote = (locale: "en" | "ja", idx: number, value: string) => {
    if (locale === "en") {
      const copy = [...enNotes];
      copy[idx] = value;
      setEnNotes(copy);
    } else {
      const copy = [...jaNotes];
      copy[idx] = value;
      setJaNotes(copy);
    }
  };

  const addNote = (locale: "en" | "ja") => {
    if (locale === "en") setEnNotes([...enNotes, ""]);
    else setJaNotes([...jaNotes, ""]);
  };

  const removeNote = (locale: "en" | "ja", idx: number) => {
    if (locale === "en") setEnNotes(enNotes.filter((_, i) => i !== idx));
    else setJaNotes(jaNotes.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.formCard}>
      <fieldset className={styles.fieldset}>
        <legend>English Notes</legend>
        {enNotes.map((note, i) => (
          <div key={i} className={styles.noteRow}>
            <input className={styles.input} value={note} onChange={(e) => updateNote("en", i, e.target.value)} />
            <button className={styles.deleteBtn} onClick={() => removeNote("en", i)}>✕</button>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => addNote("en")}>+ Add note</button>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>日本語ノート</legend>
        {jaNotes.map((note, i) => (
          <div key={i} className={styles.noteRow}>
            <input className={styles.input} value={note} onChange={(e) => updateNote("ja", i, e.target.value)} />
            <button className={styles.deleteBtn} onClick={() => removeNote("ja", i)}>✕</button>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => addNote("ja")}>+ Add note</button>
      </fieldset>

      <div className={styles.formActions}>
        <button className={styles.loginBtn} onClick={() => onSave({ en: enNotes, ja: jaNotes })} disabled={saving}>
          {saving ? "Saving..." : "Save Notes"}
        </button>
      </div>
    </div>
  );
}
