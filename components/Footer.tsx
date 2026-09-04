"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, Mail, MapPin, Phone } from "lucide-react";

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
              href="https://www.instagram.com/garaj_jeanss1/"
              target="_blank"
              rel="noreferrer"
              className="instagram-link"
            >
              <Camera size={18} strokeWidth={1.7} />
              @garaj_jeanss1
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
            <Link href="/urunler?kategori=aksesuar">Aksesuar</Link>
          </div>

          <div className="footer-column">
            <span>YASAL</span>

            <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
            <Link href="/teslimat-ve-iade">Teslimat ve İade</Link>
            <Link href="/mesafeli-satis-sozlesmesi">
              Mesafeli Satış Sözleşmesi
            </Link>
          </div>

          <div className="footer-column contact-column">
            <span>MAĞAZA</span>

            <div className="contact-item">
              <MapPin size={18} strokeWidth={1.6} />

              <p>
                Yakut Plaza Kat 1
                <br />
                No: 31 Garaj Jeans
                <br />
                Erzurum, Türkiye
              </p>
            </div>

            <div className="contact-item">
              <Phone size={18} strokeWidth={1.6} />

              <a href="tel:+905347869870">0 534 786 98 70</a>
            </div>

            <div className="contact-item">
              <Mail size={18} strokeWidth={1.6} />

              <a href="mailto:kilic2551@gmail.com">
                kilic2551@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="payment-area">
          <div className="payment-copy">
            <span>GÜVENLİ ÖDEME</span>
            <p>
              Ödemeleriniz güvenli ödeme altyapısı üzerinden gerçekleştirilir.
            </p>
          </div>

          <div className="payment-logo-wrap">
            <Image
              src="/images/payment-methods-iyzico.png"
              alt="iyzico ile Öde, Mastercard, Visa, American Express ve Troy"
              width={858}
              height={64}
              className="payment-logo"
            />
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
          grid-template-columns: 1.4fr 0.65fr 0.7fr 0.95fr 1.1fr;
          gap: 48px;
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
          line-height: 1.45;
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

        .payment-area {
          margin-top: 70px;
          padding: 28px 0;
          border-top: 1px solid #292929;
          border-bottom: 1px solid #292929;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .payment-copy {
          min-width: 210px;
        }

        .payment-copy > span {
          display: block;
          margin-bottom: 8px;
          color: #ffffff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .payment-copy p {
          max-width: 390px;
          color: #666666;
          font-size: 11px;
          line-height: 1.65;
        }

        .payment-logo-wrap {
          width: min(100%, 560px);
          display: flex;
          justify-content: flex-end;
        }

        .payment-logo {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .footer-bottom {
          margin-top: 25px;
          padding-top: 0;
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

        @media (max-width: 1100px) {
          .footer-top {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 800px) {
          .payment-area {
            align-items: flex-start;
            flex-direction: column;
          }

          .payment-logo-wrap {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 650px) {
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

          .payment-area {
            margin-top: 55px;
          }

          .payment-logo {
            max-width: 100%;
          }

          .footer-bottom {
            margin-top: 25px;
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
}
