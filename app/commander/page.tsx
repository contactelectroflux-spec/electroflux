import OrderForm from "./OrderForm";

const plans: Record<
  string,
  { name: string; price: string; period: string; items: string[] }
> = {
  "Atlas Premium": {
    name: "Atlas Premium",
    price: "50€",
    period: "12 mois",
    items: ["+13 000 chaînes", "+22 000 films", "+5 000 séries", "Full HD / 4K", "1 appareil", "Activation prioritaire", "Support 24/7"]
  },
  "Atlas Famille": {
    name: "Atlas Famille",
    price: "80€",
    period: "12 mois",
    items: ["+13 000 chaînes", "+22 000 films", "+5 000 séries", "Full HD / 4K", "2 connexions simultanées", "Activation prioritaire", "Support 24/7"]
  }
};

export default async function CommanderPage({
  searchParams
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planKey } = await searchParams;
  const plan = planKey ? (plans[planKey] ?? null) : null;

  return <OrderForm plan={plan} />;
}
