"use client";

import { useState, useEffect } from "react";
import { GUESTS, getDisplayName } from "@/lib/guests";
import type { Locale } from "@/lib/wedding-content";
import styles from "./SignupModal.module.css";

interface RosterGuest {
  guestId: string;
  firstName: string;
  displayNameEn: string;
  displayNameJa: string;
}

interface SignupModalProps {
  eventId: string;
  eventLabel: string;
  locale: Locale;
  signedUpGuestIds: string[];
  onSignup: (guestId: string) => void;
  onRemove: (guestId: string) => void;
  onClose: () => void;
}

export default function SignupModal({
  eventId,
  eventLabel,
  locale,
  signedUpGuestIds,
  onSignup,
  onRemove,
  onClose,
}: SignupModalProps) {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [roster, setRoster] = useState<RosterGuest[]>([]);

  useEffect(() => {
    fetch(`/api/rosters?eventId=${encodeURIComponent(eventId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.guests) setRoster(data.guests);
      })
      .catch(() => {});
  }, [eventId]);

  const mergedRosterIds = new Set([
    ...roster.map((g) => g.guestId),
    ...signedUpGuestIds,
  ]);

  const displayRoster = Array.from(mergedRosterIds).map((id) => {
    const fromApi = roster.find((g) => g.guestId === id);
    if (fromApi) return fromApi;
    const guest = GUESTS.find((g) => g.id === id);
    return {
      guestId: id,
      firstName: guest?.firstName ?? id,
      displayNameEn: guest ? getDisplayName(guest, "en") : id,
      displayNameJa: guest ? getDisplayName(guest, "ja") : id,
    };
  });

  const filteredGuests = GUESTS.filter((g) =>
    g.firstName.toLowerCase().includes(search.toLowerCase())
  );

  const isSignedUp = (guestId: string) =>
    signedUpGuestIds.includes(guestId) || roster.some((g) => g.guestId === guestId);

  const handleToggle = async (guestId: string) => {
    setPending(guestId);
    if (signedUpGuestIds.includes(guestId)) {
      onRemove(guestId);
      setRoster((prev) => prev.filter((g) => g.guestId !== guestId));
    } else {
      onSignup(guestId);
      const guest = GUESTS.find((g) => g.id === guestId);
      if (guest) {
        setRoster((prev) => [
          ...prev,
          {
            guestId: guest.id,
            firstName: guest.firstName,
            displayNameEn: getDisplayName(guest, "en"),
            displayNameJa: getDisplayName(guest, "ja"),
          },
        ]);
      }
    }
    setPending(null);
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={eventLabel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {locale === "en" ? "Sign up for" : "参加登録"}
          </h3>
          <p className={styles.modalEvent}>{eventLabel}</p>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {displayRoster.length > 0 && (
          <div className={styles.rosterSection} aria-label="Who's going">
            <p className={styles.rosterHeading}>
              {locale === "en"
                ? `Going (${displayRoster.length})`
                : `参加者 (${displayRoster.length})`}
            </p>
            <div className={styles.rosterChips}>
              {displayRoster.map((g) => (
                <span key={g.guestId} className={styles.rosterChip}>
                  {locale === "ja" ? g.displayNameJa : g.displayNameEn}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.searchWrap}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={locale === "en" ? "Search name..." : "名前を検索..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <p className={styles.hint}>
          {locale === "en"
            ? "Tap your name to sign up or remove yourself"
            : "お名前をタップして参加・取消できます"}
        </p>

        <ul className={styles.guestList}>
          {filteredGuests.map((guest) => {
            const signed = isSignedUp(guest.id);
            const loading = pending === guest.id;
            return (
              <li key={guest.id} className={styles.guestItem}>
                <button
                  className={`${styles.guestBtn} ${signed ? styles.guestBtnActive : ""}`}
                  onClick={() => handleToggle(guest.id)}
                  disabled={loading}
                  aria-pressed={signed}
                >
                  <span className={styles.guestName}>{guest.firstName}</span>
                  <span className={styles.guestStatus}>
                    {signed
                      ? locale === "en" ? "✓ Going" : "✓ 参加"
                      : locale === "en" ? "Sign up" : "参加する"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
