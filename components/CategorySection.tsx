"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "JEAN",
    description: "Şehrin ritmine uyum sağlayan denim.",
    image: "/images/jean.webp",
    href: "/urunler?kategori=jean",
    number: "01",
  },
  {
    name: "T-SHIRT",
    description: "Sade, güçlü ve modern kesimler.",
    image: "/images/tshirt.webp",
    href: "/urunler?kategori=tshirt",
    number: "02",
  },
  {
    name: "CEKET",
    description: "Karakterini tamamlayan güçlü parçalar.",
    image: "/images/ceket.webp",
    href: "/urunler?kategori=ceket",
    number: "03",
  },
  {
    name: "AYAKKABI",
    description: "Şehir stilinin son dokunuşu.",
    image: "/images/ayakkabi.webp",
    href: "/urunler?kategori=ayakkabi",
    number: "04",
  },
  {
    name: "AKSESUAR",
    description: "Detaylarda kendini göster.",
    image: "/images/aksesuar.webp",
    href: "/urunler?kategori=aksesuar",
    number: "05",
  },
];

export default function CategorySection() {
  return (
    <section className="categories" id="koleksiyon">
      <div className="categories-container">
        <div className="section-header">
          <div>
            <span className="eyebrow">KOLEKSİYON</span>

            <h2>
              TARZINI
              <br />
              SEÇ.
            </h2>
          </div>

          <p>
            Garaj Jeans erkek koleksiyonunu keşfet.
            <br />
            Şehir stilini kendi tarzınla tamamla.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <article className="category-card" key={category.name}>
              <Link href={category.href} className="category-link">
                <Image
                  src={category.image}
                  alt={`${category.name} kategorisi`}
                  fill
                  className="category-image"
                  sizes="340px"
                />

                <div className="category-shade" />

                <span className="category-number">
                  {category.number}
                </span>

                <div className="category-content">
                  <span>GARAJ JEANS · ERKEK GİYİM</span>

                  <h3>{category.name}</h3>

                  <p>{category.description}</p>
                </div>

                <div className="category-arrow">
                  <ArrowUpRight size={19} strokeWidth={1.5} />
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="all-products-row">
          <span>2017 · ERZURUM</span>

          <Link href="/urunler">
            TÜM ÜRÜNLERİ GÖR
            <ArrowUpRight size={18} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .categories {
          position: relative;
          width: 100%;
          padding: 90px 0;
          overflow: hidden;
          background: #f5f3ee;
        }

        .categories-container {
          width: min(1100px, calc(100% - 50px));
          margin: 0 auto;
        }

        .section-header {
          margin-bottom: 50px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
        }

        .eyebrow {
          display: block;
          margin-bottom: 18px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 5px;
        }

        .section-header h2 {
          font-size: clamp(55px, 6vw, 88px);
          font-weight: 900;
          line-height: 0.8;
          letter-spacing: -5px;
        }

        .section-header > p {
          max-width: 330px;
          padding-bottom: 3px;
          color: #777777;
          font-size: 12px;
          line-height: 1.8;
        }

        .category-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
          justify-content: center;
        }

        .category-card {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          min-width: 0;
          overflow: hidden;
          background: #111111;
        }

        .category-card:nth-child(1) {
          grid-column: 1 / span 2;
        }

        .category-card:nth-child(2) {
          grid-column: 3 / span 2;
        }

        .category-card:nth-child(3) {
          grid-column: 5 / span 2;
        }

        .category-card:nth-child(4) {
          grid-column: 2 / span 2;
        }

        .category-card:nth-child(5) {
          grid-column: 4 / span 2;
        }

        .category-link {
          position: relative;
          isolation: isolate;
          width: 100%;
          height: 100%;
          display: block;
          overflow: hidden;
          color: #ffffff;
        }

        .category-link :global(.category-image) {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          object-fit: cover;
          object-position: center;
          z-index: 0;
          transition: transform 0.7s
            cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .category-card:hover
          .category-link
          :global(.category-image) {
          transform: scale(1.05);
        }

        .category-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.02) 30%,
            rgba(0, 0, 0, 0.82) 100%
          );
          pointer-events: none;
        }

        .category-number {
          position: absolute;
          z-index: 2;
          top: 18px;
          left: 20px;
          color: #ffffff;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .category-content {
          position: absolute;
          z-index: 2;
          left: 20px;
          right: 62px;
          bottom: 20px;
        }

        .category-content > span {
          display: block;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 6px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .category-content h3 {
          color: #ffffff;
          font-size: clamp(28px, 2.7vw, 43px);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -2.5px;
        }

        .category-content p {
          margin-top: 10px;
          color: rgba(255, 255, 255, 0.75);
          font-size: 9px;
          line-height: 1.5;
        }

        .category-arrow {
          position: absolute;
          z-index: 2;
          right: 17px;
          bottom: 17px;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .category-card:hover .category-arrow {
          background: #ffffff;
          color: #111111;
          transform: rotate(45deg);
        }

        .all-products-row {
          min-height: 100px;
          border-bottom: 1px solid #cbc7bf;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .all-products-row > span {
          color: #888888;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .all-products-row :global(a) {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        @media (max-width: 900px) {
          .categories-container {
            width: min(720px, calc(100% - 40px));
          }

          .section-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .category-card:nth-child(1),
          .category-card:nth-child(2),
          .category-card:nth-child(3),
          .category-card:nth-child(4),
          .category-card:nth-child(5) {
            grid-column: auto;
          }

          .category-card:nth-child(5) {
            grid-column: 1 / -1;
            width: calc(50% - 7px);
            justify-self: center;
          }
        }

        @media (max-width: 600px) {
          .categories {
            padding: 70px 0;
          }

          .categories-container {
            width: calc(100% - 30px);
          }

          .section-header {
            margin-bottom: 40px;
            gap: 22px;
          }

          .section-header h2 {
            font-size: 60px;
            letter-spacing: -4px;
          }

          .category-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .category-card,
          .category-card:nth-child(5) {
            grid-column: auto;
            width: 100%;
            aspect-ratio: 1 / 1;
          }

          .category-content {
            left: 20px;
            right: 65px;
            bottom: 22px;
          }

          .category-content h3 {
            font-size: 42px;
          }

          .category-content p {
            font-size: 10px;
          }

          .category-arrow {
            right: 18px;
            bottom: 18px;
            width: 42px;
            height: 42px;
          }

          .all-products-row {
            min-height: 90px;
          }
        }
      `}</style>
    </section>
  );
}