"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero">
      <Image
        src="/images/hero.webp"
        alt="Garaj Jeans erkek denim koleksiyonu"
        fill
        priority
        className="hero-image"
        sizes="100vw"
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        <span className="hero-year">ERZURUM · 2017</span>

        <h1>
          ŞEHRİN
          <br />
          RUHUNU
          <br />
          GİY.
        </h1>

        <p>
          Modern erkek giyimin güçlü ve özgün hali.
          <br />
          Tarzını Garaj Jeans ile tamamla.
        </p>

        <Link href="/urunler" className="hero-button">
          ÜRÜNLERİ KEŞFET
          <ArrowRight size={18} strokeWidth={1.5} />
        </Link>
      </div>

      <div className="hero-brand">
        <span>GARAJ</span>
        <strong>JEANS</strong>
        <small>ERKEK GİYİM</small>
      </div>

      <div className="hero-badge">
        <strong>2017</strong>
        <span>ERZURUM</span>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          width: 100%;
          height: 680px;
          min-height: 680px;
          overflow: hidden;
          background: #111111;
        }

        .hero :global(.hero-image) {
          object-fit: cover;
          object-position: center;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.82) 0%,
              rgba(0, 0, 0, 0.55) 30%,
              rgba(0, 0, 0, 0.08) 62%,
              rgba(0, 0, 0, 0.18) 100%
            ),
            linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.32) 0%,
              transparent 40%
            );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: min(1400px, calc(100% - 64px));
          height: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          color: #ffffff;
        }

        .hero-year {
          margin-bottom: 25px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 5px;
        }

        .hero h1 {
          font-size: clamp(58px, 6vw, 105px);
          font-weight: 900;
          line-height: 0.78;
          letter-spacing: -7px;
        }

        .hero-content p {
          margin-top: 35px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.8;
        }

        .hero-button {
          min-height: 58px;
          margin-top: 35px;
          padding: 0 25px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 35px;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.18);
          transition:
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease;
        }

        .hero-button:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #111111;
        }

        .hero-brand {
          position: absolute;
          z-index: 2;
          right: 4%;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          color: #ffffff;
          pointer-events: none;
        }

        .hero-brand span,
        .hero-brand strong {
          font-size: clamp(55px, 6vw, 105px);
          line-height: 0.72;
          letter-spacing: -6px;
        }

        .hero-brand span {
          font-weight: 900;
        }

        .hero-brand strong {
          font-weight: 300;
        }

        .hero-brand small {
          margin-top: 30px;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 7px;
        }

        .hero-badge {
          position: absolute;
          z-index: 3;
          right: 25px;
          bottom: 25px;
          width: 105px;
          height: 105px;
          border-radius: 50%;
          background: #111111;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hero-badge strong {
          font-size: 25px;
          letter-spacing: -1px;
        }

        .hero-badge span {
          margin-top: 5px;
          font-size: 6px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        @media (max-width: 900px) {
          .hero {
            height: 780px;
          }

          .hero :global(.hero-image) {
            object-position: 58% center;
          }

          .hero-overlay {
            background: rgba(0, 0, 0, 0.58);
          }

          .hero-content {
            width: calc(100% - 40px);
          }

          .hero-brand {
            display: none;
          }

          .hero h1 {
            letter-spacing: -5px;
          }
        }

        @media (max-width: 600px) {
          .hero {
            height: calc(100svh - 70px);
            min-height: 650px;
          }

          .hero :global(.hero-image) {
            object-position: 47% center;
          }

          .hero-overlay {
            background:
              linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.78) 0%,
                rgba(0, 0, 0, 0.4) 100%
              ),
              linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.45),
                transparent
              );
          }

          .hero h1 {
            font-size: clamp(58px, 20vw, 88px);
            letter-spacing: -5px;
          }

          .hero-content p {
            font-size: 12px;
          }

          .hero-badge {
            width: 82px;
            height: 82px;
            right: 15px;
            bottom: 15px;
          }

          .hero-badge strong {
            font-size: 20px;
          }
        }
      `}</style>
    </section>
  );
}