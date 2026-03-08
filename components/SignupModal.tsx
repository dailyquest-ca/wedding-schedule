"use client";

import { useState } from "react";
import { GUESTS } from "@/lib/guests";
import type { Locale } from "@/lib/wedding-content";
import styles from "./SignupModal.module.css";

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

  const filteredGuests = GUESTS.filter((g) =>
    g.firstName.toLowerCase().includes(search.toLowerCase())
  );

  const isSignedUp = (guestId: string) => signedUpGuestIds.includes(guestId);

  const handleToggle = async (guestId: string) => {
    setPending(guestId);
    if (isSignedUp(guestId)) {
      onRemove(guestId);
    } else {
      onSignup(guestId);
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
            ? "Please only select your own name"
            : "ご自身のお名前のみ選択してください"}
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
