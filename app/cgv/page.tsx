import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — atlasibo",
};

export default function CGV() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
      <div className="legal-inner">
        <h1>Conditions Générales de Vente</h1>
        <p className="legal-date">Dernière mise à jour : mai 2026</p>

        <h2>1. Objet</h2>
        <p>Les présentes conditions régissent la vente des abonnements IPTV proposés par atlasibo. En passant commande, vous acceptez ces conditions sans réserve.</p>

        <h2>2. Produits et services</h2>
        <p>atlasibo propose des abonnements IPTV permettant l'accès à des chaînes et contenus vidéo en streaming. L'accès est fourni après confirmation de paiement, généralement sous 24 heures.</p>

        <h2>3. Prix</h2>
        <p>Les prix sont indiqués en euros (€), toutes taxes comprises. atlasibo se réserve le droit de modifier ses tarifs à tout moment, sans que ces modifications affectent les commandes déjà confirmées.</p>

        <h2>4. Paiement</h2>
        <p>Le paiement s'effectue via les moyens acceptés au moment de la commande. La transaction est sécurisée. Aucune donnée bancaire n'est conservée par atlasibo.</p>

        <h2>5. Droit de rétractation</h2>
        <p>Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours pour vous rétracter, à condition que le service n'ait pas encore été activé. Une fois l'accès fourni, le service est réputé consommé.</p>

        <h2>6. Responsabilité</h2>
        <p>atlasibo s'engage à fournir le service avec diligence. En cas d'interruption technique, une extension de la période d'abonnement pourra être accordée. atlasibo ne saurait être tenu responsable d'une mauvaise connexion internet de l'utilisateur.</p>

        <h2>7. Contact</h2>
        <p>Pour toute question, contactez-nous via WhatsApp au +33 7 89 82 23 42.</p>
      </div>
    </main>
      <SiteFooter />
    </>
  );
}
