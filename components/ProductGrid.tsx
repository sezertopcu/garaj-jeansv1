"use client";

import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({
  products,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="empty-products">
        <div className="empty-number">00</div>

        <div className="empty-brand">
          <span>GARAJ</span>
          <strong>JEANS</strong>
        </div>

        <div className="empty-line" />

        <h3>Henüz ürün bulunmuyor.</h3>

        <p>
          Bu kategoride şu anda yayınlanmış aktif ürün bulunamadı.
          <br />
          Yeni ürünler çok yakında burada.
        </p>

        <span className="empty-bottom">
          YENİ KOLEKSİYON · ERZURUM
        </span>

        <style jsx>{`
          .empty-products {
            position: relative;
            min-height: 520px;
            padding: 70px 30px;
            border: 1px solid #d4d0c8;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            text-align: center;
            background:
              linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.32),
                transparent 55%
              ),
              #ebe8e1;
            animation: emptyEnter 0.6s
              cubic-bezier(0.2, 0.8, 0.2, 1) both;
          }

          .empty-products::before {
            content: "";
            position: absolute;
            width: 420px;
            height: 420px;
            border: 1px solid rgba(17, 17, 17, 0.07);
            border-radius: 50%;
            transform: translate(-330px, -230px);
          }

          .empty-products::after {
            content: "";
            position: absolute;
            width: 300px;
            height: 300px;
            border: 1px solid rgba(17, 17, 17, 0.07);
            border-radius: 50%;
            transform: translate(420px, 250px);
          }

          .empty-number {
            position: absolute;
            top: 25px;
            right: 28px;
            color: #aaa69e;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 3px;
          }

          .empty-brand {
            position: relative;
            z-index: 2;
            margin-bottom: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .empty-brand span,
          .empty-brand strong {
            font-size: clamp(52px, 6vw, 88px);
            line-height: 0.78;
            letter-spacing: -6px;
          }

          .empty-brand span {
            font-weight: 900;
          }

          .empty-brand strong {
            font-weight: 300;
          }

          .empty-line {
            position: relative;
            z-index: 2;
            width: 45px;
            height: 1px;
            margin-bottom: 28px;
            background: #111111;
          }

          .empty-products h3 {
            position: relative;
            z-index: 2;
            margin: 0 0 15px;
            font-size: clamp(27px, 3vw, 43px);
            font-weight: 900;
            letter-spacing: -2.5px;
          }

          .empty-products p {
            position: relative;
            z-index: 2;
            margin: 0;
            color: #6d6962;
            font-size: 15px;
            line-height: 1.8;
          }

          .empty-bottom {
            position: absolute;
            z-index: 2;
            bottom: 25px;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 4px;
          }

          @keyframes emptyEnter {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 600px) {
            .empty-products {
              min-height: 430px;
              padding: 60px 20px;
            }

            .empty-brand span,
            .empty-brand strong {
              letter-spacing: -4px;
            }

            .empty-products p {
              font-size: 13px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="product-grid-item"
          style={
            {
              "--product-delay": `${index * 70}ms`,
            } as React.CSSProperties
          }
        >
          <ProductCard product={product} />
        </div>
      ))}

      <style jsx>{`
        .product-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 62px 26px;
          align-items: start;
        }

        .product-grid-item {
          min-width: 0;
          opacity: 0;
          animation: productCardEnter 0.65s
            cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          animation-delay: var(--product-delay);
        }

        @keyframes productCardEnter {
          from {
            opacity: 0;
            transform: translateY(28px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1100px) {
          .product-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 55px 22px;
          }
        }

        @media (max-width: 750px) {
          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 42px 14px;
          }
        }

        @media (max-width: 380px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 45px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-grid-item {
            opacity: 1;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}