"use client";

import { useState, useMemo } from "react";
import { Search, Download, StickyNote, Check, X } from "lucide-react";
import OrderActions from "./OrderActions";
import { saveOrderNoteAction } from "./actions";

interface Submission {
  id: string;
  createdAt: string;
  status: "pending" | "paid" | "cancelled";
  forfait?: string;
  prix?: string;
  nom?: string;
  whatsapp?: string;
  email?: string;
  appareil?: string;
  remarque?: string;
  note?: string;
}

function getPlanKey(forfait?: string): string {
  if (!forfait) return "Inconnu";
  if (forfait.includes("12")) return "12 Mois";
  if (forfait.includes("6")) return "6 Mois";
  if (forfait.includes("3")) return "3 Mois";
  if (forfait.includes("1")) return "1 Mois";
  return forfait;
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch { return iso; }
}

function exportCSV(orders: Submission[]) {
  const header = ["Date", "Nom", "WhatsApp", "Email", "Forfait", "Prix", "Appareil", "Remarque", "Note", "Statut"];
  const rows = orders.map((o) => [
    formatDate(o.createdAt),
    o.nom ?? "",
    o.whatsapp ?? "",
    o.email ?? "",
    getPlanKey(o.forfait),
    o.prix ?? "",
    o.appareil ?? "",
    o.remarque ?? "",
    o.note ?? "",
    o.status,
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `commandes-atlasibo-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function NoteCell({ orderId, initialNote }: { orderId: string; initialNote?: string }) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(initialNote ?? "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await saveOrderNoteAction(orderId, note);
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  }

  if (editing) {
    return (
      <div className="admin-note-edit">
        <textarea
          className="admin-note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Note interne…"
          autoFocus
        />
        <div className="admin-note-btns">
          <button className="admin-note-save" onClick={handleSave} disabled={saving}>
            <Check size={12} /> {saving ? "…" : "OK"}
          </button>
          <button className="admin-note-cancel" onClick={() => { setNote(initialNote ?? ""); setEditing(false); }}>
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button className="admin-note-btn" onClick={() => setEditing(true)} title="Ajouter/modifier une note">
      <StickyNote size={13} />
      {saved ? <span style={{ color: "var(--electric)" }}>✓</span> : note ? <span className="admin-note-text">{note}</span> : <span className="admin-note-empty">+</span>}
    </button>
  );
}

export default function OrdersTable({ orders }: { orders: Submission[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "cancelled">("all");
  const [planFilter, setPlanFilter] = useState("all");

  const plans = useMemo(() => {
    const set = new Set(orders.map((o) => getPlanKey(o.forfait)));
    return Array.from(set).sort();
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (planFilter !== "all" && getPlanKey(o.forfait) !== planFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          o.nom?.toLowerCase().includes(q) ||
          o.whatsapp?.includes(q) ||
          o.email?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, search, statusFilter, planFilter]);

  return (
    <div className="admin-card admin-card--full">
      <div className="admin-card-header">
        <h2 className="admin-card-title">Commandes ({filtered.length})</h2>
        <div className="admin-orders-toolbar">
          {/* Search */}
          <div className="admin-search-wrap">
            <Search size={14} className="admin-search-icon" />
            <input
              className="admin-search-input"
              type="text"
              placeholder="Rechercher nom, WhatsApp, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Status filter */}
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="paid">Payé</option>
            <option value="cancelled">Annulé</option>
          </select>
          {/* Plan filter */}
          <select
            className="admin-filter-select"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">Tous les forfaits</option>
            {plans.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {/* Export */}
          <button
            className="admin-export-btn"
            onClick={() => exportCSV(filtered)}
            title="Exporter en CSV"
          >
            <Download size={14} />
            CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="admin-empty">Aucune commande correspondante.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Nom</th>
                <th>WhatsApp</th>
                <th>Email</th>
                <th>Forfait</th>
                <th>Appareil</th>
                <th>Remarque</th>
                <th>Note interne</th>
                <th>Statut / Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className={`order-row--${o.status}`}>
                  <td className="admin-td-date">{formatDate(o.createdAt)}</td>
                  <td>{o.nom ?? "—"}</td>
                  <td>
                    {o.whatsapp ? (
                      <a
                        href={`https://wa.me/${o.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-wa-link"
                      >
                        {o.whatsapp}
                      </a>
                    ) : "—"}
                  </td>
                  <td>{o.email ?? "—"}</td>
                  <td><span className="admin-badge">{getPlanKey(o.forfait)}</span></td>
                  <td>{o.appareil?.split("(")[0]?.trim() ?? "—"}</td>
                  <td className="admin-td-note">{o.remarque && o.remarque !== "—" ? o.remarque : "—"}</td>
                  <td>
                    <NoteCell orderId={o.id} initialNote={o.note} />
                  </td>
                  <td>
                    <OrderActions
                      orderId={o.id}
                      status={o.status}
                      nom={o.nom}
                      whatsapp={o.whatsapp}
                      email={o.email}
                      forfait={getPlanKey(o.forfait)}
                      prix={o.prix}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
