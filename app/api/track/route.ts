import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

async function getGeo(ip: string): Promise<{ country: string; countryCode: string; city: string }> {
  const fallback = { country: "Inconnu", countryCode: "??", city: "" };
  if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { country: "Local", countryCode: "LOCAL", city: "Localhost" };
  }
  try {
    const res = await Promise.race([
      fetch(`https://ipwho.is/${ip}`),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
    if (!res) return fallback;
    const data = await (res as Response).json();
    if (data.success) {
      return { country: data.country ?? "Inconnu", countryCode: data.country_code ?? "??", city: data.city ?? "" };
    }
  } catch {}
  return fallback;
}

export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json();
    if (typeof page !== "string" || !page.startsWith("/")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : (request.headers.get("x-real-ip") ?? "unknown");

    const today = new Date().toISOString().split("T")[0];
    const geo = await getGeo(ip);

    await adminDb.collection("pageViews").add({
      page,
      date: today,
      timestamp: FieldValue.serverTimestamp(),
      ip,
      country: geo.country,
      countryCode: geo.countryCode,
      city: geo.city,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
