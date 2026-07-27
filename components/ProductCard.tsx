"use client";

import { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import type { Product } from "@/types/product";
import { calculateDiscount, formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscount(
    product.price,
    product.discountPrice
  );

  const hasDiscount =
    typeof product.discountPrice === "number" &&
    product.discountPrice < product.price;

  const [imageOpen, setImageOpen] = useState(false);

  function openImage(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setImageOpen(true);
  }

  function closeImage() {
    setImageOpen(false);
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeImage();
    }
  }

  useEffect(() => {
    if (!imageOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeImage();
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [imageOpen]);

  return (
    <>
    <article className="product-card">
      <div className="product-image">
        {product.image ? (
          <button
            type="button"
            className="image-button"
            onClick={openImage}
            aria-label={`${product.name} görselini büyüt`}
          >
            <img src={product.image} alt={product.name} />
          </button>
        ) : (
          <div className="image-empty">
            <div className="empty-logo">
              <span>GARAJ</span>
              <strong>JEANS</strong>
            </div>

            <span className="empty-category">
              {product.category}
            </span>
          </div>
        )}

        <div className="image-shade" />

        <span className="product-index">
          {String(product.id).padStart(2, "0")}
        </span>

        {discount && (
          <span className="discount-badge">-%{discount}</span>
        )}

        <div className="explore-button">
          <ArrowUpRight size={20} strokeWidth={1.5} />
        </div>

        <div className="hover-text">
          <span>ÜRÜNÜ İNCELE</span>
        </div>

        {product.stock <= 0 && (
          <div className="stock-overlay">
            <span>TÜKENDİ</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-top">
          <div className="product-title">
            <span className="product-category">
              {product.category}
            </span>

            <Link href={`/urunler/${product.id}`}>
              <h3>{product.name}</h3>
            </Link>
          </div>

          <span className="stock-info">
            {product.stock > 0 ? `${product.stock} ADET` : "TÜKENDİ"}
          </span>
        </div>

        <div className="product-bottom">
          <div className="product-price">
            {hasDiscount ? (
              <>
                <span className="old-price">
                  {formatPrice(product.price)}
                </span>

                <strong>
                  {formatPrice(product.discountPrice as number)}
                </strong>
              </>
            ) : (
              <strong>{formatPrice(product.price)}</strong>
            )}
          </div>

          <Link
            href={`/urunler/${product.id}`}
            className="product-link"
          >
            İNCELE
            <ArrowUpRight size={14} strokeWidth={1.7} />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          position: relative;
          width: 100%;
          transition: transform 0.45s
            cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .product-card:hover {
          transform: translateY(-7px);
        }

        .product-image {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          display: block;
          background: #dedbd4;
          overflow: hidden;
        }

        .image-button {
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          display: block;
          background: transparent;
          cursor: zoom-in;
        }

        .image-button img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
          transform: scale(1.001);
          transition: transform 0.8s
            cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .product-card:hover .image-button img {
          transform: scale(1.07);
        }

        .image-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 55%,
            rgba(0, 0, 0, 0.22) 100%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .product-card:hover .image-shade {
          opacity: 1;
        }

        .image-empty {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.15),
              transparent 50%
            ),
            #dedbd4;
          color: #111111;
        }

        .empty-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.7s
            cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .product-card:hover .empty-logo {
          transform: scale(1.06);
        }

        .empty-logo span,
        .empty-logo strong {
          font-size: clamp(28px, 3vw, 48px);
          line-height: 0.85;
          letter-spacing: -3px;
        }

        .empty-logo span {
          font-weight: 900;
        }

        .empty-logo strong {
          font-weight: 300;
        }

        .empty-category {
          position: absolute;
          bottom: 24px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .product-index {
          position: absolute;
          top: 17px;
          right: 17px;
          z-index: 3;
          color: #111111;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .discount-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 4;
          min-height: 34px;
          padding: 0 13px;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .explore-button {
          position: absolute;
          right: 18px;
          bottom: 18px;
          z-index: 4;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          background: rgba(17, 17, 17, 0.18);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          transform: translateY(8px) rotate(-15deg);
          opacity: 0;
          transition:
            opacity 0.35s ease,
            transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
            background 0.3s ease;
        }

        .product-card:hover .explore-button {
          opacity: 1;
          transform: translateY(0) rotate(0deg);
        }

        .explore-button:hover {
          background: #111111;
        }

        .hover-text {
          position: absolute;
          left: 18px;
          bottom: 22px;
          z-index: 4;
          color: #ffffff;
          transform: translateY(8px);
          opacity: 0;
          transition:
            opacity 0.35s ease,
            transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .hover-text span {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .product-card:hover .hover-text {
          opacity: 1;
          transform: translateY(0);
        }

        .stock-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          background: rgba(17, 17, 17, 0.66);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: grayscale(1);
        }

        .stock-overlay span {
          padding: 13px 22px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .product-info {
          padding: 20px 2px 0;
        }

        .product-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .product-title {
          min-width: 0;
        }

        .product-category {
          display: block;
          margin-bottom: 8px;
          color: #85817a;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .product-top h3 {
          min-height: 47px;
          margin: 0;
          font-size: 18px;
          font-weight: 750;
          line-height: 1.3;
          letter-spacing: -0.7px;
          transition: opacity 0.25s ease;
        }

        .product-top h3:hover {
          opacity: 0.55;
        }

        .stock-info {
          flex-shrink: 0;
          padding-top: 3px;
          color: #99958d;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .product-bottom {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid #d8d4cc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .product-price {
          min-height: 25px;
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .product-price strong {
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .old-price {
          color: #99958d;
          font-size: 12px;
          text-decoration: line-through;
        }

        .product-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          transition: gap 0.3s ease;
        }

        .product-link:hover {
          gap: 11px;
        }

        @media (max-width: 600px) {
          .product-card:hover {
            transform: none;
          }

          .product-info {
            padding-top: 15px;
          }

          .product-top h3 {
            min-height: 39px;
            font-size: 15px;
          }

          .stock-info {
            display: none;
          }

          .product-bottom {
            margin-top: 13px;
            padding-top: 13px;
          }

          .product-price {
            flex-direction: column;
            gap: 2px;
          }

          .product-price strong {
            font-size: 15px;
          }

          .product-link {
            font-size: 8px;
          }

          .explore-button,
          .hover-text {
            display: none;
          }

          .discount-badge {
            top: 10px;
            left: 10px;
          }

          .product-index {
            top: 13px;
            right: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-card,
          .image-button img,
          .empty-logo,
          .explore-button,
          .hover-text,
          .product-link {
            transition: none !important;
          }

          .product-card:hover {
            transform: none;
          }
        }
      `}</style>
    </article>

    {imageOpen && product.image && (
      <div
        className="image-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} büyük görsel`}
        onClick={closeFromBackdrop}
      >
        <button
          type="button"
          className="modal-close"
          onClick={closeImage}
          aria-label="Görseli kapat"
        >
          <X size={26} strokeWidth={1.7} />
        </button>

        <div className="modal-image-area">
          <img
            src={product.image}
            alt={product.name}
            draggable={false}
          />
        </div>

        <div className="modal-info">
          <span>{product.category}</span>
          <strong>{product.name}</strong>
          <small>İki parmağınla büyütüp küçültebilirsin</small>
        </div>

        <style jsx>{`
          .image-modal {
            position: fixed;
            inset: 0;
            z-index: 9999;
            padding: max(16px, env(safe-area-inset-top)) 16px
              max(16px, env(safe-area-inset-bottom));
            background: rgba(0, 0, 0, 0.95);
            color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: auto;
            overscroll-behavior: contain;
            touch-action: pinch-zoom;
          }

          .modal-close {
            position: fixed;
            top: max(18px, env(safe-area-inset-top));
            right: 18px;
            z-index: 3;
            width: 48px;
            height: 48px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            background: rgba(17, 17, 17, 0.72);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .modal-image-area {
            width: 100%;
            min-height: 0;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: pinch-zoom;
          }

          .modal-image-area img {
            width: auto;
            max-width: 100%;
            height: auto;
            max-height: calc(100dvh - 145px);
            display: block;
            object-fit: contain;
            user-select: none;
            touch-action: pinch-zoom;
          }

          .modal-info {
            width: 100%;
            padding-top: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            text-align: center;
          }

          .modal-info span {
            color: #909090;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
          }

          .modal-info strong {
            font-size: 14px;
          }

          .modal-info small {
            margin-top: 3px;
            color: #777777;
            font-size: 9px;
          }
        `}</style>
      </div>
    )}
    </>
  );
}