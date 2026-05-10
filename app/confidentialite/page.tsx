import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — atlasibo",
};

export default function Confidentialite() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
      <div className="legal-inner">
        <h1>Politique de Confidentialité</h1>
        <p className="legal-date">Dernière mise à jour : mai 2026</p>

        <h2>1. Données collectées</h2>
        <p>Lors d'une commande, nous collectons votre nom, numéro WhatsApp et, si fourni, votre adresse e-mail. Ces données sont utilisées exclusivement pour traiter votre commande et vous contacter.</p>

        <h2>2. Utilisation des données</h2>
        <p>Vos données ne sont pas vendues, louées ni partagées avec des tiers à des fins commerciales. Elles sont utilisées uniquement pour la gestion des abonnements et le support client.</p>

        <h2>3. Conservation</h2>
        <p>Les données sont conservées le temps nécessaire à l'exécution du contrat, puis archivées conformément aux obligations légales.</p>

        <h2>4. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous via WhatsApp au +33 7 89 82 23 42.</p>

        <h2>5. Cookies</h2>
        <p>Ce site n'utilise pas de cookies de traçage ou publicitaires. Seuls des cookies techniques essentiels au fonctionnement du site peuvent être utilisés.</p>
      </div>
    </main>
      <SiteFooter />
    </>
  );
}
