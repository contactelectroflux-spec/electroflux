"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "./actions";
import { Check, X, RotateCcw, MessageCircle, Mail } from "lucide-react";

type Status = "pending" | "paid" | "cancelled";

interface Props {
  orderId: string;
  status: Status;
  nom?: string;
  whatsapp?: string;
  email?: string;
  forfait?: string;
  prix?: string;
}

const PAYPAL_EMAIL = "szemzami@outlook.fr";

function buildWhatsAppMessage(nom: string, forfait: string, prix: string) {
  return encodeURIComponent(
    `Bonjour ${nom} 🌟\n\nNous tenons tout d'abord à vous remercier sincèrement pour votre confiance et pour avoir choisi *atlasibo* — c'est un honneur de vous compter parmi nos clients.\n\nVotre commande du forfait *${forfait}* à *${prix}* a bien été enregistrée et est en cours de traitement.\n\nPour finaliser votre abonnement, nous vous invitons à effectuer le règlement via *PayPal* à l'adresse suivante :\n\n📧 *${PAYPAL_EMAIL}*\n\n⚠️ *Étape importante :* lors de votre paiement, veuillez sélectionner l'option *"Envoyer de l'argent à un proche"*.\n\nDès réception de votre paiement, nous vous enverrons votre abonnement *immédiatement*.\n\nNous restons disponibles à tout moment pour répondre à vos questions.\n\nMerci encore pour votre confiance, et bienvenue dans la famille atlasibo ! 🚀✨`
  );
}

function buildEmailBody(nom: string, forfait: string, prix: string) {
  return encodeURIComponent(
    `Bonjour ${nom},\n\nNous vous remercions chaleureusement pour votre commande et pour la confiance que vous accordez à atlasibo.\n\nVotre commande du forfait ${forfait} à ${prix} a bien été enregistrée. Afin de procéder à l'activation de votre abonnement dans les meilleurs délais, nous vous invitons à effectuer le règlement via PayPal à l'adresse suivante :\n\n${PAYPAL_EMAIL}\n\nIMPORTANT : lors du paiement, veuillez sélectionner l'option "Envoyer de l'argent à un proche".\n\nDès réception de votre paiement, nous vous transmettrons votre abonnement immédiatement.\n\nNous demeurons à votre entière disposition pour toute question ou assistance complémentaire.\n\nEn vous remerciant encore de votre confiance, nous vous souhaitons une excellente expérience avec atlasibo.\n\nCordialement,\n\nL'équipe atlasibo\n━━━━━━━━━━━━━━━━━━━━\nSupport disponible 24h/24 – 7j/7`
  );
}

export default function OrderActions({ orderId, status, nom = "", whatsapp = "", email = "", forfait = "", prix = "" }: Props) {
  const [current, setCurrent] = useState<Status>(status);
  const [isPending, startTransition] = useTransition();

  function update(next: Status) {
    if (next === current) return;
    startTransition(async () => {
      await updateOrderStatusAction(orderId, next);
      setCurrent(next);
    });
  }

  const waNumber = whatsapp.replace(/\D/g, "");
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${buildWhatsAppMessage(nom, forfait, prix)}`
    : null;

  const mailLink = email
    ? `mailto:${email}?subject=${encodeURIComponent(`Votre commande atlasibo – ${forfait}`)}&body=${buildEmailBody(nom, forfait, prix)}`
    : null;

  return (
    <div className="order-actions">
      <span className={`order-status-badge order-status-badge--${current}`}>
        {current === "paid" ? "Payé" : current === "cancelled" ? "Annulé" : "En attente"}
      </span>

      {/* Contact buttons */}
      <div className="order-action-btns">
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="order-action-btn order-action-btn--wa"
            title="Contacter sur WhatsApp avec lien PayPal"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        )}
        {mailLink && (
          <a
            href={mailLink}
            className="order-action-btn order-action-btn--mail"
            title="Envoyer un email avec lien PayPal"
          >
            <Mail size={14} />
            Email
          </a>
        )}
      </div>

      {/* Status buttons */}
      <div className="order-action-btns">
        {current !== "paid" && (
          <button
            className="order-action-btn order-action-btn--paid"
            onClick={() => update("paid")}
            disabled={isPending}
            title="Marquer comme payé"
          >
            <Check size={14} />
            Payé
          </button>
        )}
        {current !== "cancelled" && (
          <button
            className="order-action-btn order-action-btn--cancel"
            onClick={() => update("cancelled")}
            disabled={isPending}
            title="Annuler la commande"
          >
            <X size={14} />
            Annuler
          </button>
        )}
        {current !== "pending" && (
          <button
            className="order-action-btn order-action-btn--reset"
            onClick={() => update("pending")}
            disabled={isPending}
            title="Remettre en attente"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
