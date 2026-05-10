"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ArrowLeft, TicketCheck, SendHorizontal, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue.");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue.");
    }
  }

  return (
    <main>
      <SiteHeader />

      <div className="dl-page">
        <div className="dl-container" style={{ maxWidth: 640 }}>

          <Link href="/" className="order-back">
            <ArrowLeft size={15} />
            Retour à l'accueil
          </Link>

          <div className="dl-header">
            <span className="order-kicker">
              <TicketCheck size={11} />
              Support
            </span>
            <h1>Ouvrir un <span>ticket</span></h1>
            <p>Décrivez votre problème et nous vous répondrons dans les plus brefs délais.</p>
          </div>

          {status === "success" ? (
            <div className="ticket-success">
              <TicketCheck size={40} />
              <h2>Ticket envoyé !</h2>
              <p>Nous avons bien reçu votre message et vous répondrons sous 24 h.</p>
              <button className="primary-button" onClick={() => setStatus("idle")}>
                Nouveau ticket
              </button>
            </div>
          ) : (
            <form className="ticket-form" onSubmit={handleSubmit} noValidate>

              <div className="ticket-row">
                <div className="ticket-field">
                  <label htmlFor="name">Nom complet</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <div className="ticket-field">
                  <label htmlFor="email">Adresse email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div className="ticket-field">
                <label htmlFor="subject">Sujet</label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  disabled={status === "loading"}
                >
                  <option value="">— Choisir un sujet —</option>
                  <option value="Problème de connexion">Problème de connexion</option>
                  <option value="Chaînes manquantes">Chaînes manquantes</option>
                  <option value="Image / qualité vidéo">Image / qualité vidéo</option>
                  <option value="Installation de l'application">Installation de l'application</option>
                  <option value="Paiement / abonnement">Paiement / abonnement</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="ticket-field">
                <label htmlFor="message">Description du problème</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Décrivez votre problème en détail..."
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  required
                  disabled={status === "loading"}
                />
              </div>

              {status === "error" && (
                <p className="ticket-error">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="primary-button"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <><Loader2 size={16} className="spin" /> Envoi en cours…</>
                ) : (
                  <><SendHorizontal size={16} /> Envoyer le ticket</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
