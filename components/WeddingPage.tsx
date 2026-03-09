"use client";

import { useState, useEffect, useCallback } from "react";
import { getContent, type Locale, type SlotCategory, type TimeSlot } from "@/lib/wedding-content";
import { mergeSchedule, mergeNotes } from "@/lib/merge-content";
import type { EventWithCount, PublicContentResponse } from "@/lib/signup/types";
import SignupModal from "./SignupModal";
import styles from "./WeddingPage.module.css";

const CATEGORY_EMOJI: Record<SlotCategory, string> = {
  excursion: "🏝️",
  dinner: "🍽️",
  busy: "💍",
  wedding: "💒",
  free: "☀️",
  travel: "✈️",
};

export default function WeddingPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [signups, setSignups] = useState<Record<string, string[]>>({});
  const [modalEventId, setModalEventId] = useState<string | null>(null);
  const [dbContent, setDbContent] = useState<PublicContentResponse | null>(null);

  const baseContent = getContent(locale);

  const toggleLocale = () => setLocale((prev) => (prev === "en" ? "ja" : "en"));

  const fetchData = useCallback(async () => {
    try {
      const [evRes, contentRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/public/content"),
      ]);

      if (evRes.ok) {
        setEvents(await evRes.json());
      }
      if (contentRes.ok) {
        setDbContent(await contentRes.json());
      }
    } catch {
      /* network error — fallback to base content */
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const schedule = dbContent
    ? mergeSchedule(baseContent.schedule, dbContent.events, locale)
    : baseContent.schedule;

  const notes = dbContent
    ? mergeNotes(baseContent.notes, locale === "en" ? dbContent.notes.en : dbContent.notes.ja)
    : baseContent.notes;

  const getCount = (slotId?: string): number | undefined => {
    if (!slotId) return undefined;
    const ev = events.find((e) => e.eventId === slotId);
    return ev?.count;
  };

  const handleSignup = async (eventId: string, guestId: string) => {
    try {
      const res = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, guestId }),
      });
      if (res.ok) {
        setSignups((prev) => ({
          ...prev,
          [eventId]: [...(prev[eventId] ?? []), guestId],
        }));
        setEvents((prev) =>
          prev.map((e) =>
            e.eventId === eventId ? { ...e, count: e.count + 1 } : e
          )
        );
      }
    } catch { /* ignore */ }
  };

  const handleRemove = async (eventId: string, guestId: string) => {
    try {
      const res = await fetch("/api/signups", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, guestId }),
      });
      if (res.ok) {
        setSignups((prev) => ({
          ...prev,
          [eventId]: (prev[eventId] ?? []).filter((id) => id !== guestId),
        }));
        setEvents((prev) =>
          prev.map((e) =>
            e.eventId === eventId ? { ...e, count: Math.max(0, e.count - 1) } : e
          )
        );
      }
    } catch { /* ignore */ }
  };

  const modalSlot: TimeSlot | null = modalEventId
    ? schedule.flatMap((d) => d.slots).find((s) => s.id === modalEventId) ?? null
    : null;

  return (
    <div className={styles.page}>
      <a href="#main-content" className={styles.skipLink}>
        {locale === "en" ? "Skip to schedule" : "スケジュールへ"}
      </a>
      <header className={styles.header}>
        <img
          src="/header-bg.png"
          alt="Anna & Zak"
          className={styles.headerBg}
        />
        <div className={styles.headerOverlay} />
        <div className={styles.headerInner}>
          <button
            className={styles.langToggle}
            onClick={toggleLocale}
            aria-label={`Switch to ${baseContent.toggleLabel}`}
          >
            {baseContent.toggleLabel}
          </button>
          <h1 className={styles.title}>{baseContent.title}</h1>
          <p className={styles.subtitle}>{baseContent.subtitle}</p>
        </div>
        <nav
          className={styles.quickLinks}
          aria-label={locale === "en" ? "Quick links" : "リンク"}
        >
          <a
            href={baseContent.whatsapp.url}
            className={`${styles.quickLink} ${styles.quickLinkWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {baseContent.whatsapp.label}
          </a>
          <a
            href={baseContent.photos.url}
            className={`${styles.quickLink} ${styles.quickLinkPhotos}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="16" height="16">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
            {baseContent.photos.label}
          </a>
        </nav>
      </header>

      <main id="main-content" className={styles.main}>
        <section className={styles.schedule} aria-label="Weekly schedule">
          {schedule.map((day, i) => (
            <div key={i} className={styles.dayCard}>
              <h2 className={styles.dayHeading}>
                <span className={styles.dayLabel}>{day.dayLabel}</span>
                <span className={styles.dateLabel}>{day.dateLabel}</span>
              </h2>
              <ul className={styles.slotList}>
                {day.slots.map((slot, j) => {
                  const count = getCount(slot.id);
                  const isSignuppable = slot.signupEnabled && slot.id;
                  return (
                    <li
                      key={j}
                      className={`${styles.slot} ${styles[`slot_${slot.category}`]}`}
                    >
                      <span className={styles.slotEmoji} aria-hidden="true">
                        {CATEGORY_EMOJI[slot.category]}
                      </span>
                      <span className={styles.slotTime}>{slot.time}</span>
                      <span className={styles.slotContent}>
                        <span className={styles.slotLabelRow}>
                          <span className={styles.slotLabel}>{slot.label}</span>
                          {isSignuppable && count !== undefined && (
                            <span className={styles.countPill} aria-label={`${count} going`}>
                              {count} {locale === "en" ? "going" : "人参加"}
                            </span>
                          )}
                          {isSignuppable && (
                            <button
                              className={styles.signupBtn}
                              onClick={() => setModalEventId(slot.id!)}
                              aria-label={`${locale === "en" ? "Sign up for" : "参加登録："} ${slot.label}`}
                            >
                              {locale === "en" ? "Sign up" : "参加する"}
                            </button>
                          )}
                        </span>
                        {slot.description && (
                          <span className={styles.slotDesc}>{slot.description}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        <section className={styles.infoSection} aria-label="Notes and reminders">
          <h2 className={styles.sectionHeading}>
            {locale === "en" ? "Notes & Reminders" : "メモ＆リマインダー"}
          </h2>
          <ul className={styles.notesList}>
            {notes.map((note, i) => (
              <li key={i} className={styles.noteItem}>
                {note}
              </li>
            ))}
          </ul>
        </section>

      </main>

      <footer className={styles.footer}>
        <p className={styles.footerNote}>
          {locale === "en"
            ? "Made with love by A & Z"
            : "A & Z が愛を込めて作りました"}
        </p>
      </footer>

      {modalEventId && modalSlot && (
        <SignupModal
          eventId={modalEventId}
          eventLabel={modalSlot.label}
          locale={locale}
          signedUpGuestIds={signups[modalEventId] ?? []}
          onSignup={(guestId) => handleSignup(modalEventId, guestId)}
          onRemove={(guestId) => handleRemove(modalEventId, guestId)}
          onClose={() => setModalEventId(null)}
        />
      )}
    </div>
  );
}
