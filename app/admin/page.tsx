"use client";

import { useState } from "react";
import type { EventRoster } from "@/lib/signup/types";
import styles from "./admin.module.css";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [rosters, setRosters] = useState<EventRoster[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events", {
        headers: { "x-admin-password": password },
      });
      if (res.status === 401) {
        setError("Incorrect password");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Failed to load data");
        setLoading(false);
        return;
      }
      const data: EventRoster[] = await res.json();
      setRosters(data);
      setAuthenticated(true);
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleExportCsv = () => {
    const lines = ["Event,Guest"];
    rosters.forEach((r) => {
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

  if (!authenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Admin</h1>
          <label className={styles.label} htmlFor="admin-password">
            Password
          </label>
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
            {loading ? "Loading..." : "View Rosters"}
          </button>
        </div>
      </div>
    );
  }

  const totalSignups = rosters.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Event Signups</h1>
          <div className={styles.headerActions}>
            <span className={styles.totalBadge}>{totalSignups} total signups</span>
            <button className={styles.exportBtn} onClick={handleExportCsv}>
              Export CSV
            </button>
          </div>
        </header>

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
                    <li key={g.guestId} className={styles.guestItem}>
                      {g.firstName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
