import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Télécharger Atlas Pro IBO — APK & Downloader",
  description:
    "Téléchargez l'application Atlas Pro IBO en APK direct ou via Downloader (code 9380782). Compatible Android, Smart TV, Fire TV Stick, Fire TV Cube et boîtiers Amazon.",
  alternates: { canonical: "https://atlasibo.com/telechargement" }
};
import { ArrowLeft, Download, Smartphone, MonitorSmartphone, Zap, Tv, Tablet, Monitor } from "lucide-react";

const APK_URL = "https://atlas-ontv.com/wp-content/uploads/2025/11/ATLAS-PRO-IBO-1.apk";

export default function TelechargementPage() {
  return (
    <main>
      <SiteHeader />

      <div className="dl-page">
        <div className="dl-container">

          {/* Back link */}
          <Link href="/" className="order-back">
            <ArrowLeft size={15} />
            Retour à l'accueil
          </Link>

          {/* Header */}
          <div className="dl-header">
            <span className="order-kicker">
              <Download size={11} />
              Téléchargement
            </span>
            <h1>Installer <span>Atlas IBO</span><br />sur votre appareil</h1>
            <p>Deux méthodes simples pour accéder à l'application, selon votre appareil.</p>
            <div className="dl-platforms">
              <span className="dl-platform-tag"><Smartphone size={12} /> Android</span>
              <span className="dl-platform-tag"><Tv size={12} /> Smart TV</span>
              <span className="dl-platform-tag"><Tablet size={12} /> Tablette</span>
              <span className="dl-platform-tag"><Monitor size={12} /> Fire TV</span>
            </div>
          </div>

          {/* Cards grid */}
          <div className="dl-grid">

            {/* Card 1 — Direct APK */}
            <div className="dl-card">
              <div className="dl-card-header">
                <span className="dl-card-icon"><Smartphone size={20} /></span>
                <div>
                  <p className="dl-card-label">Méthode 1</p>
                  <h2>Fichier APK direct</h2>
                </div>
              </div>

              <p className="dl-card-desc">
                Pour Android, Smart TV Android et boîtiers Android. Téléchargez le fichier APK et installez-le directement.
              </p>

              {/* APK clickable image */}
              <a
                href={APK_URL}
                className="dl-apk-wrapper"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Télécharger l'APK Atlas IBO"
              >
                <div className="dl-apk-image">
                  <Image
                    src="/images/apk file.webp"
                    alt="Atlas IBO APK direct download"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 800px"
                    quality={100}
                  />
                  <span className="dl-apk-4k">4K</span>
                  <div className="dl-apk-overlay">
                    <span className="dl-apk-badge">
                      <Download size={18} />
                      Télécharger l'APK
                    </span>
                  </div>
                </div>
                <div className="dl-apk-bar">
                  <Download size={15} />
                  Télécharger l'APK — Atlas IBO
                </div>
              </a>

              <p className="dl-note">
                ⚠️ Activez <strong>« Sources inconnues »</strong> dans les paramètres de votre appareil avant d'installer.
              </p>
            </div>

            {/* Card 2 — Downloader */}
            <div className="dl-card">
              <div className="dl-card-header">
                <span className="dl-card-icon"><MonitorSmartphone size={20} /></span>
                <div>
                  <p className="dl-card-label">Méthode 2</p>
                  <h2>Via Downloader</h2>
                </div>
              </div>

              <p className="dl-card-desc">
                Recommandé pour Fire TV Stick, Fire TV Cube et boîtiers Amazon.
              </p>

              {/* Code highlight */}
              <div className="dl-code-block">
                <p className="dl-code-label">Code à entrer dans Downloader</p>
                <div className="dl-code">
                  <Zap size={20} />
                  9380782
                </div>
              </div>

              <div className="dl-steps">
                <div className="dl-step">
                  <span className="dl-step-num">1</span>
                  <div className="dl-step-body">
                    <h3>Installer Downloader</h3>
                    <p>Recherchez <strong>«&nbsp;Downloader by AFTNews&nbsp;»</strong> sur le Play Store ou l'Amazon App Store.</p>
                  </div>
                </div>

                <div className="dl-step">
                  <span className="dl-step-num">2</span>
                  <div className="dl-step-body">
                    <h3>Ouvrir l'application</h3>
                    <p>Lancez Downloader et autorisez les permissions demandées.</p>
                  </div>
                </div>

                <div className="dl-step">
                  <span className="dl-step-num">3</span>
                  <div className="dl-step-body">
                    <h3>Entrer le code</h3>
                    <p>Tapez <strong>9380782</strong> dans la barre de recherche et appuyez sur OK.</p>
                  </div>
                </div>

                <div className="dl-step">
                  <span className="dl-step-num">4</span>
                  <div className="dl-step-body">
                    <h3>Installer &amp; lancer</h3>
                    <p>Confirmez le téléchargement, installez l'application et profitez.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
