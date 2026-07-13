"use client";

import Link from "next/link";
import { Camera, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              GARAJ<span>JEANS</span>
            </Link>

            <p>
              2017&apos;den beri Erzurum&apos;da modern erkek giyim.
              Şehir ruhunu tarzına yansıt.
            </p>

            <a
              href="https://www.instagram.com/garaj_jeanss/"
              target="_blank"
              rel="noreferrer"
              className="instagram-link"
            >
              <Camera size={18} strokeWidth={1.7} />
              @garaj_jeanss
            </a>
          </div>

          <div className="footer-column">
            <span>MENÜ</span>

            <Link href="/">Ana Sayfa</Link>
            <Link href="/urunler">Ürünler</Link>
            <Link href="/#hakkimizda">Hakkımızda</Link>
            <Link href="/#iletisim">İletişim</Link>
          </div>

          <div className="footer-column">
            <span>KATEGORİLER</span>

            <Link href="/urunler?kategori=jean">Jean</Link>
            <Link href="/urunler?kategori=tshirt">T-Shirt</Link>
            <Link href="/urunler?kategori=ceket">Ceket</Link>
            <Link href="/urunler?kategori=ayakkabi">Ayakkabı</Link>
            <Link href="/urunler?kategori=aksesuar">Aksesuar</Link>
          </div>

          <div className="footer-column contact-column">
            <span>MAĞAZA</span>

            <div className="contact-item">
              <MapPin size={18} strokeWidth={1.6} />

              <p>
                Yakut Plaza Kat 1
                <br />
                No: 31-32 Garaj Jeans
                <br />
                Erzurum, Türkiye
              </p>
            </div>

            <div className="contact-item">
              <Phone size={18} strokeWidth={1.6} />

              <a href="tel:+905347869870">
                0 534 786 98 70
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 GARAJ JEANS. TÜM HAKLARI SAKLIDIR.</p>

          <p>ERZURUM · TÜRKİYE</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          padding: 90px 0 30px;
          background: #111111;
          color: #ffffff;
        }

        .footer-container {
          width: min(1400px, calc(100% - 64px));
          margin: 0 auto;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr 0.7fr 0.7fr 1fr;
          gap: 70px;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-logo {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1.5px;
        }

        .footer-logo span {
          font-weight: 300;
        }

        .footer-brand > p {
          max-width: 330px;
          margin-top: 25px;
          color: #888888;
          font-size: 13px;
          line-height: 1.8;
        }

        .instagram-link {
          margin-top: 30px;
          min-height: 45px;
          padding: 0 16px;
          border: 1px solid #333333;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .instagram-link:hover {
          border-color: #ffffff;
          background: #ffffff;
          color: #111111;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .footer-column > span {
          margin-bottom: 12px;
          color: #555555;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .footer-column > a {
          color: #999999;
          font-size: 13px;
          transition: color 0.2s ease;
        }

        .footer-column > a:hover {
          color: #ffffff;
        }

        .contact-column {
          gap: 22px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          color: #888888;
        }

        .contact-item svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contact-item p,
        .contact-item a {
          color: #888888;
          font-size: 12px;
          line-height: 1.8;
        }

        .contact-item a:hover {
          color: #ffffff;
        }

        .footer-bottom {
          margin-top: 80px;
          padding-top: 25px;
          border-top: 1px solid #292929;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .footer-bottom p {
          color: #555555;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        @media (max-width: 950px) {
          .footer-top {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .footer {
            padding-top: 65px;
          }

          .footer-container {
            width: calc(100% - 40px);
          }

          .footer-top {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .footer-bottom {
            margin-top: 60px;
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
}