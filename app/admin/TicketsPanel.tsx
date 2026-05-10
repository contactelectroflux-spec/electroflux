"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, TicketCheck } from "lucide-react";

interface Ticket {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch { return iso; }
}

export default function TicketsPanel({ tickets }: { tickets: Ticket[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (tickets.length === 0) {
    return (
      <div className="admin-card admin-card--full">
        <h2 className="admin-card-title">Tickets support (0)</h2>
        <p className="admin-empty">Aucun ticket reçu pour l&apos;instant.</p>
      </div>
    );
  }

  return (
    <div className="admin-card admin-card--full">
      <div className="admin-card-header">
        <h2 className="admin-card-title">
          <TicketCheck size={18} style={{ display: "inline", marginRight: 8, color: "var(--electric)" }} />
          Tickets support ({tickets.length})
        </h2>
      </div>
      <div className="admin-ticket-list">
        {tickets.map((t) => (
          <div key={t.id} className={`admin-ticket-item${open === t.id ? " admin-ticket-item--open" : ""}`}>
            <button
              className="admin-ticket-header"
              onClick={() => setOpen(open === t.id ? null : t.id)}
            >
              <div className="admin-ticket-meta">
                <span className="admin-ticket-subject">{t.subject}</span>
                <span className="admin-ticket-from">{t.name} — {t.email}</span>
              </div>
              <div className="admin-ticket-right">
                <span className="admin-ticket-date">{formatDate(t.createdAt)}</span>
                {open === t.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>
            {open === t.id && (
              <div className="admin-ticket-body">
                <p className="admin-ticket-message">{t.message}</p>
                <a
                  href={`mailto:${t.email}?subject=Re: ${encodeURIComponent(t.subject)}`}
                  className="order-action-btn order-action-btn--mail"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", marginTop: 12 }}
                >
                  <Mail size={14} />
                  Répondre par email
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
