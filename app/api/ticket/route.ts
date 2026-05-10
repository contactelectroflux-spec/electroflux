import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "contact.electroflux@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Support atlasibo <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Ticket] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#030303;border-bottom:2px solid #d9ff66;padding-bottom:8px">
            Nouveau ticket — atlasibo
          </h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#555;width:120px"><strong>Nom</strong></td><td style="padding:8px 0">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#555"><strong>Email</strong></td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#555"><strong>Sujet</strong></td><td style="padding:8px 0">${subject}</td></tr>
          </table>
          <div style="background:#f4f4f0;border-radius:8px;padding:16px;margin-top:16px">
            <strong style="color:#555">Message :</strong>
            <p style="margin:8px 0 0;white-space:pre-wrap">${message}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Échec de l'envoi." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Ticket route error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
