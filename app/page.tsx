import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import {
  MapPin,
  MessageCircle,
  Phone,
  ArrowUpRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <CategorySection />

        <section id="hakkimizda" className="about">
          <div className="about-container">
            <div className="about-top">
              <div className="about-heading">
                <span className="about-eyebrow">01 · HİKAYEMİZ</span>

                <h2>
                  GARAJ&apos;DAN
                  <br />
                  VİTRİNE.
                </h2>
              </div>

              <div className="about-top-info">
                <span>ERZURUM</span>
                <strong>2017</strong>
              </div>
            </div>

            <div className="about-layout">
              <div className="about-image-wrap">
                <Image
                  src="/images/about.webp"
                  alt="Garaj Jeans erkek giyim mağazası"
                  fill
                  className="about-image"
                  sizes="(max-width: 900px) 100vw, 55vw"
                />

                <div className="about-image-shade" />

                <div className="about-image-brand">
                  <span>GARAJ</span>
                  <strong>JEANS</strong>
                  <small>ERKEK GİYİM · EST. 2017</small>
                </div>
              </div>

              <div className="about-story">
                <div className="story-title">
                  <span>✦</span>
                  <p>HİKAYEMİZ</p>
                </div>

                <h3>
                  Erzurum&apos;da
                  <br />
                  başlayan bir
                  <br />
                  stil hikayesi.
                </h3>

                <p className="about-lead">
                  Garaj Jeans, 2017 yılında Erzurum&apos;da Kılıç ailesi
                  tarafından kuruldu. Adını ilk atölyesinden alan markamız,
                  kısa sürede Erzurum&apos;un sevilen erkek giyim
                  mağazalarından biri haline geldi.
                </p>

                <div className="about-divider" />

                <div className="story-text">
                  <p>
                    Kaliteli kumaşları özgün tasarımlarla buluşturuyor,
                    şehir ruhunu yansıtan güçlü ve modern parçalar sunuyoruz.
                  </p>

                  <p>
                    Dayanıklılık, konfor ve estetiği bir arada sunan
                    koleksiyonlarımızla yalnızca bir giyim mağazası değil,
                    kendine özgü bir yaşam tarzı oluşturmayı hedefliyoruz.
                  </p>

                  <p>
                    Yakut Plaza&apos;daki mağazamızda sizleri ağırlamaktan
                    mutluluk duyarız. Garaj Jeans ailesi olarak her
                    müşterimizi bir dost olarak görüyoruz.
                  </p>
                </div>

                <a href="#iletisim" className="store-link">
                  MAĞAZAMIZI ZİYARET ET
                  <ArrowUpRight size={20} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="iletisim" className="contact">
          <div className="contact-container">
            <div className="contact-header">
              <div className="contact-header-left">
                <span className="contact-eyebrow">02 · İLETİŞİM</span>

                <a
                  href="https://www.instagram.com/garaj_jeanss1/"
                  target="_blank"
                  rel="noreferrer"
                  className="instagram-link"
                >
                  <span className="instagram-icon">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />

                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        fill="currentColor"
                      />
                    </svg>
                  </span>

                  <span className="instagram-text">
                    <small>INSTAGRAM</small>
                    <strong>@garaj_jeanss</strong>
                  </span>

                  <ArrowUpRight
                    className="instagram-arrow"
                    size={20}
                    strokeWidth={1.5}
                  />
                </a>
              </div>

              <h2>
                BİZE
                <br />
                ULAŞ.
              </h2>
            </div>

            <div className="contact-grid">
              <div className="contact-card">
                <div className="contact-icon">
                  <MapPin size={30} strokeWidth={1.5} />
                </div>

                <span>MAĞAZAMIZ</span>

                <h3>Yakut Plaza</h3>

                <p>
                  Kat 1 No: 31-32
                  <br />
                  Garaj Jeans
                  <br />
                  Erzurum, Türkiye
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Yakut+Plaza+Erzurum"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-action"
                >
                  HARİTADA GÖR
                  <ArrowUpRight size={17} strokeWidth={1.5} />
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <Phone size={30} strokeWidth={1.5} />
                </div>

                <span>TELEFON</span>

                <h3>İbrahim Kılıç</h3>

                <a href="tel:+905347869870" className="phone-number">
                  0 534 786 98 70
                </a>

                <a
                  href="https://wa.me/905347869870"
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp"
                >
                  <MessageCircle size={17} />
                  WHATSAPP
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <Phone size={30} strokeWidth={1.5} />
                </div>

                <span>TELEFON</span>

                <h3>Muhammed Kılıç</h3>

                <a href="tel:+905076750209" className="phone-number">
                  0 507 675 02 09
                </a>

                <a
                  href="https://wa.me/905076750209"
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp"
                >
                  <MessageCircle size={17} />
                  WHATSAPP
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <Phone size={30} strokeWidth={1.5} />
                </div>

                <span>TELEFON</span>

                <h3>Furkan Kılıç</h3>

                <a href="tel:+905375689870" className="phone-number">
                  0 537 568 98 70
                </a>

                <a
                  href="https://wa.me/905375689870"
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp"
                >
                  <MessageCircle size={17} />
                  WHATSAPP
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .about {
          width: 100%;
          padding: 90px 0 110px;
          overflow: hidden;
          background: #f5f3ee;
        }

        .about-container {
          width: min(1280px, calc(100% - 70px));
          margin: 0 auto;
        }

        .about-top {
          margin-bottom: 45px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
        }

        .about-eyebrow {
          display: block;
          margin-bottom: 18px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .about-heading h2 {
          margin: 0;
          font-size: clamp(72px, 6.2vw, 112px);
          font-weight: 900;
          line-height: 0.79;
          letter-spacing: -7px;
        }

        .about-top-info {
          padding-bottom: 7px;
          display: flex;
          align-items: baseline;
          gap: 18px;
        }

        .about-top-info span {
          color: #85817a;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .about-top-info strong {
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .about-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(390px, 0.8fr);
          gap: 60px;
          align-items: stretch;
        }

        .about-image-wrap {
          position: relative;
          width: 100%;
          min-height: 650px;
          overflow: hidden;
          background: #111111;
        }

        .about-image-wrap :global(.about-image) {
          object-fit: cover;
          object-position: center;
          transition: transform 1.1s cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .about-image-wrap:hover :global(.about-image) {
          transform: scale(1.025);
        }

        .about-image-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 45%,
            rgba(0, 0, 0, 0.68) 100%
          );
          pointer-events: none;
        }

        .about-image-brand {
          position: absolute;
          z-index: 2;
          left: 38px;
          bottom: 34px;
          display: flex;
          flex-direction: column;
          color: #ffffff;
        }

        .about-image-brand span {
          font-size: 50px;
          font-weight: 900;
          line-height: 0.75;
          letter-spacing: -4px;
        }

        .about-image-brand strong {
          font-size: 45px;
          font-weight: 300;
          line-height: 0.9;
          letter-spacing: -3px;
        }

        .about-image-brand small {
          margin-top: 15px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .about-story {
          min-height: 650px;
          padding: 10px 0 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .story-title {
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .story-title span {
          font-size: 14px;
        }

        .story-title p {
          margin: 0;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .about-story h3 {
          margin: 0 0 30px;
          font-size: clamp(42px, 3.5vw, 60px);
          font-weight: 900;
          line-height: 0.93;
          letter-spacing: -4px;
        }

        .about-lead {
          margin: 0;
          color: #171717;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.65;
          letter-spacing: -0.3px;
        }

        .about-divider {
          width: 100%;
          height: 1px;
          margin: 28px 0;
          background: #cbc7bf;
        }

        .story-text {
          display: grid;
          gap: 17px;
        }

        .story-text p {
          margin: 0;
          color: #5f5c57;
          font-size: 15px;
          line-height: 1.75;
        }

        .store-link {
          min-height: 56px;
          margin-top: auto;
          padding: 0 23px;
          border: 1px solid #111111;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 35px;
          color: #111111;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .store-link:hover {
          background: #111111;
          color: #ffffff;
          transform: translateY(-3px);
        }

        .contact {
          width: 100%;
          padding: 120px 0;
          overflow: hidden;
          background: #171717;
          color: #ffffff;
        }

        .contact-container {
          width: min(1380px, calc(100% - 70px));
          margin: 0 auto;
        }

        .contact-header {
          margin-bottom: 65px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 60px;
        }

        .contact-header-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 38px;
        }

        .contact-eyebrow {
          color: #8a8a8a;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
        }

        .contact-header h2 {
          margin: 0;
          font-size: clamp(80px, 7vw, 120px);
          font-weight: 900;
          line-height: 0.76;
          letter-spacing: -8px;
          text-align: right;
        }

        .instagram-link {
          min-width: 280px;
          min-height: 78px;
          padding: 0 22px;
          border: 1px solid #3c3c3c;
          display: flex;
          align-items: center;
          gap: 17px;
          color: #ffffff;
          transition:
            transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            background 0.3s ease,
            border-color 0.3s ease;
        }

        .instagram-link:hover {
          background: #222222;
          border-color: #686868;
          transform: translateY(-4px) scale(1.02);
        }

        .instagram-icon {
          width: 43px;
          height: 43px;
          border: 1px solid #4b4b4b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .instagram-text {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 5px;
        }

        .instagram-text small {
          color: #777777;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .instagram-text strong {
          font-size: 15px;
          font-weight: 700;
        }

        .instagram-arrow {
          transition: transform 0.3s ease;
        }

        .instagram-link:hover .instagram-arrow {
          transform: translate(3px, -3px);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-top: 1px solid #3a3a3a;
          border-left: 1px solid #3a3a3a;
        }

        .contact-card {
          position: relative;
          min-width: 0;
          min-height: 390px;
          padding: 40px 34px;
          border-right: 1px solid #3a3a3a;
          border-bottom: 1px solid #3a3a3a;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          background: #171717;
          transform: translateZ(0);
          transition:
            transform 0.38s cubic-bezier(0.2, 0.8, 0.2, 1),
            background 0.3s ease,
            border-color 0.3s ease;
        }

        .contact-card:hover {
          z-index: 3;
          background: #202020;
          border-color: #5b5b5b;
          transform: translateY(-7px) scale(1.025) rotate(-0.35deg);
          animation: cardShake 0.48s ease-in-out;
        }

        .contact-card:nth-child(even):hover {
          transform: translateY(-7px) scale(1.025) rotate(0.35deg);
        }

        @keyframes cardShake {
          0% {
            margin-left: 0;
          }

          25% {
            margin-left: -2px;
          }

          50% {
            margin-left: 2px;
          }

          75% {
            margin-left: -1px;
          }

          100% {
            margin-left: 0;
          }
        }

        .contact-icon {
          width: 54px;
          height: 54px;
          border: 1px solid #414141;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            background 0.3s ease,
            color 0.3s ease,
            transform 0.4s ease;
        }

        .contact-card:hover .contact-icon {
          background: #ffffff;
          color: #111111;
          transform: rotate(8deg) scale(1.06);
        }

        .contact-card > span {
          margin-top: 55px;
          margin-bottom: 15px;
          color: #858585;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .contact-card h3 {
          margin: 0 0 17px;
          font-size: 27px;
          letter-spacing: -1.2px;
        }

        .contact-card p,
        .phone-number {
          color: #b8b8b8;
          font-size: 16px;
          line-height: 1.8;
        }

        .phone-number {
          transition: color 0.2s ease;
        }

        .phone-number:hover {
          color: #ffffff;
        }

        .whatsapp,
        .contact-action {
          min-height: 48px;
          margin-top: auto;
          padding: 0 19px;
          border: 1px solid #555555;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .whatsapp:hover,
        .contact-action:hover {
          border-color: #ffffff;
          background: #ffffff;
          color: #111111;
          transform: translateY(-3px);
        }

        @media (max-width: 1000px) {
          .about-container,
          .contact-container {
            width: min(760px, calc(100% - 50px));
          }

          .about-layout {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .about-image-wrap {
            min-height: 600px;
          }

          .about-story {
            min-height: auto;
          }

          .store-link {
            margin-top: 35px;
          }

          .contact-header {
            align-items: flex-start;
          }

          .contact-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .about,
          .contact {
            padding: 70px 0;
          }

          .about-container,
          .contact-container {
            width: calc(100% - 30px);
          }

          .about-top {
            margin-bottom: 35px;
            align-items: flex-start;
            flex-direction: column;
            gap: 20px;
          }

          .about-heading h2 {
            font-size: 56px;
            letter-spacing: -4px;
          }

          .about-top-info {
            padding: 0;
          }

          .about-image-wrap {
            min-height: 430px;
          }

          .about-image-brand {
            left: 24px;
            bottom: 24px;
          }

          .about-image-brand span {
            font-size: 38px;
          }

          .about-image-brand strong {
            font-size: 34px;
          }

          .about-layout {
            gap: 38px;
          }

          .about-story h3 {
            font-size: 43px;
            letter-spacing: -3px;
          }

          .about-lead {
            font-size: 17px;
          }

          .story-text p {
            font-size: 14px;
          }

          .contact-header {
            margin-bottom: 45px;
            align-items: flex-start;
            flex-direction: column-reverse;
            gap: 40px;
          }

          .contact-header h2 {
            font-size: 68px;
            letter-spacing: -5px;
            text-align: left;
          }

          .contact-header-left {
            width: 100%;
            gap: 28px;
          }

          .instagram-link {
            width: 100%;
            min-width: 0;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-card {
            min-height: 330px;
          }

          .contact-card:hover,
          .contact-card:nth-child(even):hover {
            transform: translateY(-4px) scale(1.01);
            animation: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-card,
          .contact-icon,
          .instagram-link,
          .instagram-arrow,
          .store-link,
          .whatsapp,
          .contact-action,
          .about-image-wrap :global(.about-image) {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}