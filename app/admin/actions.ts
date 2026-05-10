"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminDb } from "../../lib/firebase-admin";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_SESSION_TOKEN) {
    throw new Error("Unauthorized");
  }
}

export async function updateOrderStatusAction(orderId: string, status: "paid" | "cancelled" | "pending") {
  await requireAdmin();
  await adminDb.collection("orders").doc(orderId).update({ status });
  revalidatePath("/admin");
}

export async function saveOrderNoteAction(orderId: string, note: string) {
  await requireAdmin();
  await adminDb.collection("orders").doc(orderId).update({ note });
}

export async function loginAction(prevState: { error: string } | null, formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!adminPassword || !sessionToken) {
    return { error: "Configuration admin manquante." };
  }

  if (password !== adminPassword) {
    return { error: "Mot de passe incorrect." };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/admin/login");
}
