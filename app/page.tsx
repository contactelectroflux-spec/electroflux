import Image from "next/image";
import DemoVideo from "./components/DemoVideo";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CirclePlay,
  Globe2,
  Headphones,
  MonitorSmartphone,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Tv,
  Wifi,
  Zap
} from "lucide-react";
import Testimonials from "./components/Testimonials";
import ProofSlider from "./components/ProofSlider";

const stats = [
  { value: "4K", label: "Qualité UHD" },
  { value: "24/7", label: "Support rapide" },
  { value: "5 min", label: "Installation" },
  { value: "99.9%", label: "Disponibilité" }
];

const features = [
  {
    icon: MonitorSmartphone,
    title: "Tous vos écrans",
    text: "Smart TV, Android, iOS, tablette, ordinateur et boîtier TV."
  },
  {
    icon: Zap,
    title: "Activation express",
    text: "Votre accès est préparé rapidement avec un guide clair."
  },
  {
    icon: ShieldCheck,
    title: "Paiement protégé",
    text: "Une commande simple, sécurisée et sans étape compliquée."
  },
  {
    icon: Headphones,
    title: "Assistance dédiée",
    text: "Un accompagnement humain pour installer et profiter du service."
  }
];

const plans = [
  {
    name: "Atlas Premium",
    price: "50€",
    period: "12 mois",
    description: "L'expérience complète atlasibo pour toute l'année.",
    items: ["Full HD / 4K", "+13 000 chaînes", "+22 000 films", "+5 000 séries", "1 appareil", "Activation prioritaire", "Support 24/7"],
    highlighted: true
  },
  {
    name: "Atlas Famille",
    price: "80€",
    period: "12 mois",
    description: "Pensé pour toute la famille avec plusieurs accès simultanés.",
    items: ["Full HD / 4K", "+13 000 chaînes", "+22 000 films", "+5 000 séries", "2 connexions simultanées", "Activation prioritaire", "Support 24/7"]
  }
];

const faq = [
  {
    q: "Sur quels appareils atlasibo fonctionne ?",
    a: "Le service est compatible avec Smart TV, Android TV, box, mobile, tablette et ordinateur selon l'application choisie."
  },
  {
    q: "Combien de temps prend l'activation ?",
    a: "Après la commande, vous recevez les informations de configuration et le guide d'installation le plus adapté à votre appareil."
  },
  {
    q: "La qualité 4K est-elle disponible ?",
    a: "Oui, lorsque votre appareil, votre connexion et le contenu choisi le permettent."
  }
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section id="accueil" className="hero">
        <div className="hero-visual" aria-label="Aperçu Electro Flux">
          <Image
            src="/images/hero section.webp"
            alt="Interface atlasibo IPTV premium"
            fill
            priority
            quality={100}
            sizes="(max-width: 640px) 1080px, (max-width: 1200px) 1200px, 1920px"
          />
          <div className="hero-actions">
            <a className="primary-button" href="#offre">
              Activer mon abonnement
              <ArrowRight size={20} />
            </a>
            <a className="play-link" href="#demo">
              <span>
                <CirclePlay size={24} />
              </span>
              Voir la démo
            </a>
          </div>
        </div>
      </section>


      <section id="offre" className="section section-light">
        <div className="section-heading reveal">
          <span>Offres</span>
          <h2>Choisissez une formule nette, rapide et premium.</h2>
        </div>
        <div className="pricing-grid reveal-stagger">
          {plans.map((plan) => (
            <article
              className={`price-card ${plan.highlighted ? "featured" : ""}`}
              key={plan.name}
            >
              {plan.highlighted && <div className="badge">Meilleur choix</div>}
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="price">
                <strong>{plan.price}</strong>
                <span>{plan.period}</span>
              </div>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={`/commander?plan=${encodeURIComponent(plan.name)}`}
                className="card-button"
              >
                Commander
                <ArrowRight size={18} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="telechargement" className="section split">
        <div className="image-panel reveal-left">
          <Image
            src="/images/IMAGES IPTV SMARTERS PRO.jpg"
            alt="Interface IPTV Smarters Pro sur téléviseur et tablette"
            fill
            sizes="(max-width: 900px) 100vw, 48vw"
          />
        </div>
        <div className="split-copy reveal-right">
          <span className="section-kicker">Téléchargement</span>
          <h2>Une configuration guidée, sans jargon inutile.</h2>
          <p>
            atlasibo est pensé pour être lancé rapidement. Vous choisissez
            votre appareil, vous recevez vos accès, puis vous suivez un guide
            clair jusqu'au premier lancement.
          </p>
          <div className="feature-list">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="feature-item">
                  <Icon size={24} />
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="demo" className="section demo-section">
        <div className="section-heading centered reveal">
          <span>Démo</span>
          <h2>Un aperçu animé, comme une mini bande-annonce du service.</h2>
        </div>
        <DemoVideo />
      </section>

      <section id="faq" className="section faq-section">
        <div className="faq-inner">
          <div className="section-heading reveal">
            <span>FAQ</span>
            <h2>Les réponses avant de commander.</h2>
          </div>
          <div className="faq-grid reveal-stagger">
            {faq.map((item) => (
              <article key={item.q}>
                <div className="faq-body">
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <Testimonials />
        <div className="proof-divider">
          <span className="section-kicker">Preuves réelles</span>
          <p className="proof-subtitle">Screenshots de conversations WhatsApp avec de vrais abonnés.</p>
        </div>
        <ProofSlider />
      </section>

      <section id="contact" className="contact-band reveal-scale">
        <div>
          <span className="section-kicker">Contact</span>
          <h2>Prêt à lancer atlasibo ?</h2>
          <p>
            Envoyez votre appareil préféré et la formule souhaitée. Nous vous
            accompagnons jusqu'à l'activation.
          </p>
        </div>
        <a
          className="primary-button invert"
          href="https://wa.me/33789822342"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nous écrire sur WhatsApp
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </section>

      <SiteFooter />
    </main>
  );
}
