"use server";

import { adminDb } from "../../lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "contact.electroflux@gmail.com";

interface OrderData {
  forfait: string;
  prix: string;
  nom: string;
  whatsapp: string;
  email: string;
  appareil: string;
  remarque: string;
}

export async function saveOrderAction(data: OrderData) {
  await adminDb.collection("orders").add({
    ...data,
    status: "pending",
    createdAt: FieldValue.serverTimestamp(),
  });

  // Email notification to admin — non-blocking
  resend.emails.send({
    from: "atlasibo Commandes <onboarding@resend.dev>",
    to: ADMIN_EMAIL,
    subject: `🛒 Nouvelle commande — ${data.forfait} (${data.nom})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#030303;border-bottom:2px solid #d9ff66;padding-bottom:8px">
          🛒 Nouvelle commande — atlasibo
        </h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#555;width:140px"><strong>Nom</strong></td><td style="padding:8px 0">${data.nom}</td></tr>
          <tr><td style="padding:8px 0;color:#555"><strong>WhatsApp</strong></td><td style="padding:8px 0">${data.whatsapp}</td></tr>
          ${data.email ? `<tr><td style="padding:8px 0;color:#555"><strong>Email</strong></td><td style="padding:8px 0">${data.email}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#555"><strong>Forfait</strong></td><td style="padding:8px 0">${data.forfait}</td></tr>
          <tr><td style="padding:8px 0;color:#555"><strong>Prix</strong></td><td style="padding:8px 0">${data.prix}</td></tr>
          <tr><td style="padding:8px 0;color:#555"><strong>Appareil</strong></td><td style="padding:8px 0">${data.appareil}</td></tr>
          ${data.remarque ? `<tr><td style="padding:8px 0;color:#555"><strong>Remarque</strong></td><td style="padding:8px 0">${data.remarque}</td></tr>` : ""}
        </table>
        <a href="https://atlasibo.com/admin" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#d9ff66;color:#030303;font-weight:700;border-radius:8px;text-decoration:none">
          Voir dans l'admin →
        </a>
      </div>
    `,
  }).catch(() => {}); // non-blocking
}

