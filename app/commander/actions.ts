"use server";

import { adminDb } from "../../lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

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
    createdAt: FieldValue.serverTimestamp(),
  });
}
