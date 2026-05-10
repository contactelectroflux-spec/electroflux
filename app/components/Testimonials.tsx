"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Camille D.",
    location: "Paris, Île-de-France",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Image ultra nette, activation en quelques minutes. J'utilise Electro Flux sur ma Smart TV et mon téléphone sans le moindre bug. Service vraiment au top.",
    rating: 5
  },
  {
    name: "Lucas M.",
    location: "Lyon, Auvergne-Rhône-Alpes",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "J'avais testé d'autres services IPTV avant, mais rien de comparable. La qualité 4K est impressionnante et le support répond très rapidement.",
    rating: 5
  },
  {
    name: "Nadia F.",
    location: "Toulouse, Occitanie",
    photo: "https://randomuser.me/api/portraits/women/52.jpg",
    text: "Les chaînes du monde entier, tout y est. Je regarde des programmes arabes, français et anglais sans coupure. Vraiment impeccable pour toute la famille.",
    rating: 5
  },
  {
    name: "Thomas B.",
    location: "Bordeaux, Nouvelle-Aquitaine",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    text: "Le rapport qualité-prix est imbattable. 12 mois d'accès fluide sans coupure. Le support m'a même aidé à configurer ma box en 10 minutes.",
    rating: 5
  },
  {
    name: "Inès K.",
    location: "Lille, Hauts-de-France",
    photo: "https://randomuser.me/api/portraits/women/27.jpg",
    text: "Très satisfaite de mon abonnement Signature. Tout est fluide, même en 4K. Je ne reviendrai pas en arrière.",
    rating: 5
  },
  {
    name: "Mehdi R.",
    location: "Nice, Côte d'Azur",
    photo: "https://randomuser.me/api/portraits/men/58.jpg",
    text: "Abonnement actif depuis 8 mois, aucun souci technique. Le catalogue VOD est immense et la qualité de streaming sur mon Firestick est parfaite.",
    rating: 5
  }
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const pairs = Math.ceil(total / 2);

  const prev = () => setIndex((i) => (i - 2 + total) % total);
  const next = () => setIndex((i) => (i + 2) % total);

  const visible = [
    testimonials[index % total],
    testimonials[(index + 1) % total]
  ];

  const currentPair = Math.floor(index / 2) + 1;

  return (
    <div className="testimonials-inner">
      {/* Left column */}
      <div className="testimonials-copy">
        <span className="section-kicker">Avis clients</span>
        <h2>Ce que nos clients en France disent de nous.</h2>
        <p>Des abonnés satisfaits à Paris, Lyon, Marseille et partout en France partagent leur expérience réelle.</p>
        <div className="testimonials-nav">
          <button onClick={prev} aria-label="Précédent" className="t-nav-btn">
            <ArrowLeft size={20} />
          </button>
          <button onClick={next} aria-label="Suivant" className="t-nav-btn">
            <ArrowRight size={20} />
          </button>
          <span className="t-counter">
            {String(currentPair).padStart(2, "0")} / {String(pairs).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Right column: 2 cards */}
      <div className="testimonials-cards">
        {visible.map((t, i) => (
          <article key={`${t.name}-${index}-${i}`} className="t-card">
            <div className="t-card-header">
              <img
                src={t.photo}
                alt={t.name}
                className="t-avatar"
                width={42}
                height={42}
              />
              <div className="t-meta">
                <strong>{t.name}</strong>
                  <span>{t.location}</span>
                </div>
                <div className="t-stars">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="t-text">{t.text}</p>
            </article>
          ))}
        </div>
      </div>
  );
}
