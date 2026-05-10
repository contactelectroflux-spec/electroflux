import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales — atlasibo",
};

export default function MentionsLegales() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page">
      <div className="legal-inner">
        <h1>Mentions Légales</h1>
        <p className="legal-date">Dernière mise à jour : mai 2026</p>

        <h2>Éditeur du site</h2>
        <p>Le site atlasibo.com est édité par la société atlasibo.</p>
        <p>Contact : <a href="https://wa.me/33789822342" target="_blank" rel="noopener noreferrer">+33 7 89 82 23 42</a></p>

        <h2>Hébergement</h2>
        <p>Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 700, San Francisco, CA 94104, USA.</p>

        <h2>Propriété intellectuelle</h2>
        <p>L'ensemble des contenus présents sur ce site (textes, images, logos, vidéos) sont la propriété exclusive d'atlasibo ou de leurs auteurs respectifs. Toute reproduction est interdite sans autorisation préalable.</p>

        <h2>Responsabilité</h2>
        <p>atlasibo s'efforce d'assurer l'exactitude des informations diffusées sur ce site mais ne peut garantir leur exhaustivité. L'utilisation du site se fait sous la responsabilité de l'utilisateur.</p>
      </div>
    </main>
      <SiteFooter />
    </>
  );
}
