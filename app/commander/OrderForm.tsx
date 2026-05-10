"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronDown, User, Phone, Mail, Lock, Shield, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SiteFooter from "../components/SiteFooter";
import { saveOrderAction } from "./actions";

const WHATSAPP_NUMBER = "33789822342";

const devices = [
  "Smart TV (Samsung / LG / Sony…)",
  "Android TV / Box Android",
  "iPhone / iPad",
  "Android (téléphone / tablette)",
  "PC / Mac",
  "Autre"
];

interface Plan {
  name: string;
  price: string;
  period: string;
  items: string[];
}

export default function OrderForm({ plan }: { plan: Plan | null }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [device, setDevice] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const isValid = name.trim() && whatsapp.trim() && device;

  function buildMessage() {
    const lines = [
      `Bonjour, je souhaite commander le forfait ${plan?.name ?? "atlasibo"} à ${plan?.price ?? ""} / ${plan?.period ?? ""}.`,
      ``,
      `📋 Mes informations :`,
      `• Nom : ${name.trim()}`,
      `• WhatsApp : ${whatsapp.trim()}`,
      `• Appareil à activer : ${device}`,
    ];
    if (email.trim()) lines.push(`• Email : ${email.trim()}`);
    if (note.trim()) lines.push(`• Note : ${note.trim()}`);
    return lines.join("\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || sending) return;
    setSending(true);

    // Save order via server action (Admin SDK — bypasses Firestore rules)
    try {
      await saveOrderAction({
        forfait: plan?.name ?? "Non spécifié",
        prix: plan ? `${plan.price} / ${plan.period}` : "",
        nom: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || "",
        appareil: device,
        remarque: note.trim() || "",
      });
    } catch {
      // Non-blocking — proceed even if save fails
    }

    setSending(false);
    router.push("/commander/merci");
  }

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand" aria-label="atlasibo accueil">
          <Image
            src="/images/Atlasibo logo.png"
            alt="atlasibo"
            width={180}
            height={52}
            className="brand-logo"
            priority
          />
        </Link>
        <nav aria-label="Navigation principale">
          <Link href="/">Accueil</Link>
          <Link href="/#offre">Offre</Link>
          <Link href="/#installation">Installation</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
      </header>
      <main className="order-page">
      <div className="order-container">
        <Link href="/#offre" className="order-back">
          <ArrowLeft size={18} />
          Retour aux offres
        </Link>

        <div className="order-card">
          {/* Header */}
          <div className="order-header">
            <span className="order-kicker"><Zap size={11} />Confirmation de commande</span>
            <h1>
              {plan ? (
                <>Votre forfait <span>{plan.name}</span></>
              ) : (
                "Choisissez votre forfait"
              )}
            </h1>
          </div>

          {plan ? (
            <>
              {/* Plan summary */}
              <div className="order-summary">
                <div className="order-price-row">
                  <strong className="order-price">{plan.price}</strong>
                  <span className="order-period">/ {plan.period}</span>
                </div>
                <ul className="order-features">
                  {plan.items.map((item) => (
                    <li key={item}>
                      <Check size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-divider" />

              {/* Form */}
              <form className="order-form" onSubmit={handleSubmit} noValidate>
                <p className="order-form-intro">
                  Renseignez vos informations pour que notre équipe puisse activer votre abonnement rapidement.
                </p>

                <div className="order-field">
                  <label htmlFor="order-name">Nom complet *</label>
                  <div className="order-field-inner">
                    <User size={15} className="order-field-icon" aria-hidden="true" />
                    <input
                      id="order-name"
                      type="text"
                      placeholder="ex. Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="order-field">
                  <label htmlFor="order-whatsapp">Votre numéro WhatsApp *</label>
                  <div className="order-field-inner">
                    <Phone size={15} className="order-field-icon" aria-hidden="true" />
                    <input
                      id="order-whatsapp"
                      type="tel"
                      placeholder="ex. +33 7 89 82 23 42"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="order-field">
                  <label htmlFor="order-email">Adresse e-mail <span className="order-optional">(optionnel)</span></label>
                  <div className="order-field-inner">
                    <Mail size={15} className="order-field-icon" aria-hidden="true" />
                    <input
                      id="order-email"
                      type="email"
                      placeholder="ex. jean@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="order-field">
                  <label htmlFor="order-device">Appareil à activer *</label>
                  <div className="order-select-wrap">
                    <select
                      id="order-device"
                      value={device}
                      onChange={(e) => setDevice(e.target.value)}
                      required
                    >
                      <option value="">Choisissez votre appareil</option>
                      {devices.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="order-select-icon" />
                  </div>
                </div>

                <div className="order-field">
                  <label htmlFor="order-note">Remarque (optionnel)</label>
                  <textarea
                    id="order-note"
                    placeholder="ex. J'ai deux TV Samsung, je veux activer la principale."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="order-actions">
                  {/* Primary: confirm order → thank you page */}
                  <button
                    type="submit"
                    className={`order-confirm-btn${(!isValid || sending) ? " order-btn-disabled" : ""}`}
                    disabled={!isValid || sending}
                  >
                    {sending ? "Envoi en cours…" : "Confirmer ma commande"}
                  </button>

                  {/* Secondary: open WhatsApp */}
                  <a
                    href={isValid ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`order-whatsapp-btn order-whatsapp-secondary${!isValid ? " order-btn-disabled" : ""}`}
                    onClick={(e) => { if (!isValid) e.preventDefault(); }}
                    aria-disabled={!isValid}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Envoyer sur WhatsApp
                  </a>

                  {/* Trust badges */}
                  <div className="order-trust">
                    <span className="order-trust-item"><Lock size={11} /> Paiement sécurisé</span>
                    <span className="order-trust-item"><Zap size={11} /> Activation rapide</span>
                    <span className="order-trust-item"><Shield size={11} /> Support 24/7</span>
                  </div>
                </div>

                {!isValid && (
                  <p className="order-hint">* Veuillez remplir tous les champs obligatoires.</p>
                )}
              </form>

              <p className="order-note">
                Activation rapide · Paiement sécurisé · Support 24/7
              </p>
            </>
          ) : (
            <div className="order-no-plan">
              <p>Aucun forfait sélectionné. Veuillez choisir une offre.</p>
              <Link href="/#offre" className="primary-button">
                Voir les offres
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
