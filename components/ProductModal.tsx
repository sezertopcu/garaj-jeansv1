"use client";

import { X } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({
  product,
  onClose,
}: ProductModalProps) {
  if (!product) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Kapat"
        >
          <X size={22} strokeWidth={1.7} />
        </button>

        <div className="modal-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="image-empty">
              <span>GARAJ</span>
              <strong>JEANS</strong>
            </div>
          )}
        </div>

        <div className="modal-info">
          <span className="category">{product.category}</span>

          <h2>{product.name}</h2>

          <div className="price">
            {product.discountPrice &&
            product.discountPrice < product.price ? (
              <>
                <span>{formatPrice(product.price)}</span>
                <strong>{formatPrice(product.discountPrice)}</strong>
              </>
            ) : (
              <strong>{formatPrice(product.price)}</strong>
            )}
          </div>

          <p className="description">{product.description}</p>

          <div className="sizes">
            <span className="sizes-title">BEDENLER</span>

            <div className="size-list">
              {product.sizes.map((size) => (
                <div key={size} className="size">
                  {size}
                </div>
              ))}
            </div>
          </div>

          <div className="stock">
            {product.stock > 0
              ? `Stokta ${product.stock} adet mevcut`
              : "Ürün tükendi"}
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          padding: 30px;
          background: rgba(0, 0, 0, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
        }

        .modal-content {
          position: relative;
          width: min(950px, 100%);
          max-height: calc(100vh - 60px);
          background: #f5f3ee;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow-y: auto;
        }

        .modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 5;
          width: 44px;
          height: 44px;
          border: 0;
          background: #ffffff;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image {
          min-height: 620px;
          background: #dedbd4;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-empty {
          width: 100%;
          height: 100%;
          min-height: 620px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .image-empty span,
        .image-empty strong {
          font-size: 60px;
          line-height: 0.85;
          letter-spacing: -5px;
        }

        .image-empty span {
          font-weight: 900;
        }

        .image-empty strong {
          font-weight: 300;
        }

        .modal-info {
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .category {
          margin-bottom: 20px;
          color: #777777;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        h2 {
          font-size: clamp(38px, 5vw, 68px);
          line-height: 0.95;
          letter-spacing: -4px;
        }

        .price {
          margin-top: 28px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .price span {
          color: #999999;
          font-size: 16px;
          text-decoration: line-through;
        }

        .price strong {
          font-size: 23px;
        }

        .description {
          margin-top: 32px;
          color: #5f5f5f;
          font-size: 14px;
          line-height: 1.8;
        }

        .sizes {
          margin-top: 38px;
        }

        .sizes-title {
          display: block;
          margin-bottom: 14px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .size-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .size {
          min-width: 45px;
          height: 45px;
          padding: 0 12px;
          border: 1px solid #c9c5bc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .stock {
          margin-top: 30px;
          padding-top: 22px;
          border-top: 1px solid #d6d2ca;
          color: #707070;
          font-size: 12px;
        }

        @media (max-width: 750px) {
          .modal-overlay {
            padding: 15px;
            align-items: flex-start;
          }

          .modal-content {
            max-height: calc(100vh - 30px);
            grid-template-columns: 1fr;
          }

          .modal-image {
            min-height: 430px;
          }

          .image-empty {
            min-height: 430px;
          }

          .modal-info {
            padding: 50px 25px;
          }

          h2 {
            letter-spacing: -3px;
          }
        }
      `}</style>
    </div>
  );
}