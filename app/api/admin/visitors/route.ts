import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb } from "../../../../lib/firebase-admin";

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const since = new Date(Date.now() - 10 * 60 * 1000); // last 10 min
    const snap = await adminDb
      .collection("pageViews")
      .where("timestamp", ">=", since)
      .orderBy("timestamp", "desc")
      .limit(60)
      .get();

    const visitors = snap.docs.map((doc) => {
      const d = doc.data();
      const rawIp: string = d.ip ?? "";
      // Mask last octet for IPv4, last group for IPv6
      const maskedIp = rawIp.includes(".")
        ? rawIp.replace(/\.\d+$/, ".***")
        : rawIp.length > 8
        ? rawIp.slice(0, -4) + "****"
        : rawIp;
      return {
        page: d.page ?? "/",
        ip: maskedIp || "—",
        fullIp: rawIp || "—",
        country: d.country ?? "Inconnu",
        countryCode: d.countryCode ?? "??",
        city: d.city ?? "",
        time: d.timestamp?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ visitors });
  } catch {
    return NextResponse.json({ visitors: [] });
  }
}
