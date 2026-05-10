"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Clock, MapPin, Monitor } from "lucide-react";

interface Visitor {
  page: string;
  ip: string;
  fullIp: string;
  country: string;
  countryCode: string;
  city: string;
  time: string | null;
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Accueil",
  "/commander": "Commander",
  "/commander/merci": "Merci (confirmation)",
  "/cgv": "CGV",
  "/confidentialite": "Confidentialité",
  "/mentions-legales": "Mentions légales",
};

function flagEmoji(code: string): string {
  if (!code || code.length !== 2 || code === "??" || code === "LO") return "🖥️";
  try {
    return String.fromCodePoint(
      ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
    );
  } catch {
    return "🌍";
  }
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  return `${Math.floor(diff / 3600)}h`;
}

export default function LiveVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [showFullIp, setShowFullIp] = useState<Record<number, boolean>>({});

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/visitors");
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors ?? []);
      }
    } catch {}
    setLoading(false);
    setCountdown(30);
  }, []);

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 30000);
    return () => clearInterval(interval);
  }, [fetchVisitors]);

  // Countdown
  useEffect(() => {
    const tick = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(tick);
  }, [visitors]);

  return (
    <div className="admin-card admin-card--full live-card">
      <div className="live-header">
        <div className="live-title-row">
          <span className="live-pulse" />
          <h2 className="admin-card-title" style={{ margin: 0 }}>Visiteurs en direct</h2>
          {!loading && (
            <span className="live-badge">{visitors.length}</span>
          )}
        </div>
        <div className="live-controls">
          <span className="live-countdown">Actualisation dans {countdown}s</span>
          <button className="live-refresh-btn" onClick={fetchVisitors} title="Actualiser maintenant">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="admin-empty">Chargement...</p>
      ) : visitors.length === 0 ? (
        <p className="admin-empty">Aucune activité dans les 10 dernières minutes.</p>
      ) : (
        <div className="live-list">
          {visitors.map((v, i) => (
            <div key={i} className="live-row">
              <div className="live-flag" title={`${v.country}${v.city ? ` · ${v.city}` : ""}`}>
                {flagEmoji(v.countryCode)}
              </div>
              <div className="live-info">
                <span className="live-page">
                  <Monitor size={11} style={{ opacity: 0.5 }} />
                  {PAGE_LABELS[v.page] ?? v.page}
                </span>
                <span className="live-location">
                  <MapPin size={10} />
                  {[v.city, v.country].filter(Boolean).join(", ") || "Inconnu"}
                </span>
              </div>
              <div className="live-meta">
                <button
                  className="live-ip"
                  onClick={() => setShowFullIp((prev) => ({ ...prev, [i]: !prev[i] }))}
                  title="Cliquer pour afficher / masquer l'IP complète"
                >
                  {showFullIp[i] ? v.fullIp : v.ip}
                </button>
                {v.time && (
                  <span className="live-time">
                    <Clock size={10} />
                    {timeAgo(v.time)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
