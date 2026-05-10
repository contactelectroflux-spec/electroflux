import Link from "next/link";

export default function MerciPage() {
  return (
    <main className="order-page">
      <div className="order-container">
        <div className="merci-card">
          {/* Animated checkmark */}
          <div className="merci-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <div className="merci-text">
            <span className="order-kicker">Commande envoyée</span>
            <h1>Merci pour votre commande&nbsp;!</h1>
            <p>
              Votre message a été envoyé sur WhatsApp. Notre équipe va vous contacter
              très rapidement pour confirmer votre abonnement et procéder à l&apos;activation.
            </p>
          </div>

          <div className="merci-steps">
            <div className="merci-step">
              <span className="merci-step-num">01</span>
              <div>
                <strong>Message reçu</strong>
                <p>Votre commande est en cours de traitement.</p>
              </div>
            </div>
            <div className="merci-step">
              <span className="merci-step-num">02</span>
              <div>
                <strong>Confirmation WhatsApp</strong>
                <p>Notre équipe vous répond sous peu.</p>
              </div>
            </div>
            <div className="merci-step">
              <span className="merci-step-num">03</span>
              <div>
                <strong>Activation</strong>
                <p>Votre abonnement est activé rapidement.</p>
              </div>
            </div>
          </div>

          <Link href="/" className="merci-home-btn">
            Retour à l&apos;accueil
          </Link>

          <p className="order-note">
            Activation rapide · Paiement sécurisé · Support 24/7
          </p>
        </div>
      </div>
    </main>
  );
}
