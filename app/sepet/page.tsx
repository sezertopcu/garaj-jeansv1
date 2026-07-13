"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const subtotal = items.reduce((total, item) => {
    const price =
      item.product.discountPrice !== null &&
      item.product.discountPrice !== undefined &&
      item.product.discountPrice < item.product.price
        ? item.product.discountPrice
        : item.product.price;

    return total + price * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <>
        <Navbar />

        <main className="empty-cart">
          <ShoppingBag size={55} strokeWidth={1.2} />

          <span>SEPETİN</span>

          <h1>Sepetin boş.</h1>

          <p>
            Garaj Jeans koleksiyonunu keşfet ve tarzına uygun
            parçaları sepete ekle.
          </p>

          <Link href="/urunler">
            Ürünleri Keşfet
          </Link>
        </main>

        <Footer />

        <style jsx>{`
          .empty-cart {
            min-height: 70vh;
            padding: 90px 20px;
            background: #f5f3ee;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .empty-cart > span {
            margin-top: 28px;
            margin-bottom: 15px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 4px;
          }

          .empty-cart h1 {
            font-size: clamp(48px, 7vw, 90px);
            letter-spacing: -5px;
          }

          .empty-cart p {
            max-width: 440px;
            margin: 25px 0 35px;
            color: #666666;
            font-size: 14px;
            line-height: 1.8;
          }

          .empty-cart a {
            min-height: 54px;
            padding: 0 28px;
            background: #111111;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <div>
              <span>ALIŞVERİŞ SEPETİ</span>

              <h1>Sepetin.</h1>
            </div>

            <Link href="/urunler">
              <ArrowLeft size={17} />
              Alışverişe Devam Et
            </Link>
          </div>

          <div className="cart-layout">
            <section className="cart-items">
              {items.map((item) => {
                const price =
                  item.product.discountPrice !== null &&
                  item.product.discountPrice !== undefined &&
                  item.product.discountPrice <
                    item.product.price
                    ? item.product.discountPrice
                    : item.product.price;

                return (
                  <article
                    key={`${item.product.id}-${item.size}`}
                    className="cart-item"
                  >
                    <div className="item-image">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                        />
                      ) : (
                        <span>GJ</span>
                      )}
                    </div>

                    <div className="item-info">
                      <span>{item.product.category}</span>

                      <h2>{item.product.name}</h2>

                      <p>Beden: {item.size}</p>

                      <strong>{formatPrice(price)}</strong>
                    </div>

                    <div className="item-actions">
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          removeFromCart(
                            item.product.id,
                            item.size
                          )
                        }
                        aria-label="Ürünü sepetten sil"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="quantity">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          aria-label="Adet azalt"
                        >
                          <Minus size={15} />
                        </button>

                        <strong>{item.quantity}</strong>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.quantity >= item.product.stock
                          }
                          aria-label="Adet artır"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <strong className="item-total">
                        {formatPrice(price * item.quantity)}
                      </strong>
                    </div>
                  </article>
                );
              })}

              <button
                type="button"
                className="clear-cart"
                onClick={() => {
                  const approved = window.confirm(
                    "Sepetteki tüm ürünleri silmek istediğine emin misin?"
                  );

                  if (approved) {
                    clearCart();
                  }
                }}
              >
                Sepeti Temizle
              </button>
            </section>

            <aside className="cart-summary">
              <span>SİPARİŞ ÖZETİ</span>

              <h2>Toplam.</h2>

              <div className="summary-row">
                <p>Ara Toplam</p>

                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="summary-row">
                <p>Kargo</p>

                <strong>Ücretsiz</strong>
              </div>

              <div className="summary-total">
                <p>Ödenecek Tutar</p>

                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <Link href="/odeme" className="payment-link">
                Ödemeye Geç
              </Link>

              <p className="payment-note">
                Güvenli ödeme altyapısı iyzico ile sağlanacaktır.
              </p>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .cart-page {
          min-height: 70vh;
          padding: 90px 0 120px;
          background: #f5f3ee;
        }

        .cart-container {
          width: min(1300px, calc(100% - 64px));
          margin: 0 auto;
        }

        .cart-header {
          margin-bottom: 65px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
        }

        .cart-header span {
          display: block;
          margin-bottom: 15px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 4px;
        }

        .cart-header h1 {
          font-size: clamp(65px, 8vw, 115px);
          line-height: 0.9;
          letter-spacing: -7px;
        }

        .cart-header a {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #666666;
          font-size: 11px;
          font-weight: 700;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 55px;
          align-items: start;
        }

        .cart-items {
          border-top: 1px solid #d2cec5;
        }

        .cart-item {
          min-height: 190px;
          padding: 25px 0;
          border-bottom: 1px solid #d2cec5;
          display: grid;
          grid-template-columns: 130px 1fr auto;
          gap: 25px;
          align-items: center;
        }

        .item-image {
          width: 130px;
          height: 150px;
          background: #dedbd4;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-image span {
          font-size: 20px;
          font-weight: 900;
        }

        .item-info > span {
          display: block;
          margin-bottom: 9px;
          color: #777777;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .item-info h2 {
          margin-bottom: 12px;
          font-size: 23px;
          letter-spacing: -1px;
        }

        .item-info p {
          margin-bottom: 15px;
          color: #777777;
          font-size: 12px;
        }

        .item-info > strong {
          font-size: 14px;
        }

        .item-actions {
          height: 150px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
        }

        .delete-button {
          width: 38px;
          height: 38px;
          border: 1px solid #d2cec5;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .delete-button:hover {
          background: #a52424;
          border-color: #a52424;
          color: #ffffff;
        }

        .quantity {
          display: flex;
          align-items: center;
          border: 1px solid #c5c1b8;
        }

        .quantity button {
          width: 38px;
          height: 38px;
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .quantity button:disabled {
          cursor: not-allowed;
          opacity: 0.3;
        }

        .quantity strong {
          min-width: 35px;
          text-align: center;
          font-size: 12px;
        }

        .item-total {
          font-size: 16px;
        }

        .clear-cart {
          margin-top: 22px;
          border: 0;
          background: transparent;
          color: #777777;
          font-size: 11px;
          font-weight: 700;
          text-decoration: underline;
          cursor: pointer;
        }

        .cart-summary {
          position: sticky;
          top: 110px;
          padding: 40px;
          background: #ffffff;
          border: 1px solid #dedbd4;
        }

        .cart-summary > span {
          display: block;
          margin-bottom: 12px;
          color: #777777;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .cart-summary h2 {
          margin-bottom: 40px;
          font-size: 48px;
          letter-spacing: -3px;
        }

        .summary-row {
          min-height: 55px;
          border-bottom: 1px solid #e2ded6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .summary-row p {
          color: #666666;
          font-size: 13px;
        }

        .summary-row strong {
          font-size: 13px;
        }

        .summary-total {
          padding: 30px 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .summary-total p {
          font-size: 13px;
          font-weight: 700;
        }

        .summary-total strong {
          font-size: 25px;
        }

        .payment-link {
          width: 100%;
          min-height: 54px;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .payment-link:hover {
          background: #292929;
          transform: translateY(-2px);
        }

        .payment-note {
          margin-top: 18px;
          color: #888888;
          font-size: 10px;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 950px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }

          .cart-summary {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 650px) {
          .cart-page {
            padding: 65px 0 80px;
          }

          .cart-container {
            width: calc(100% - 40px);
          }

          .cart-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .cart-header h1 {
            letter-spacing: -5px;
          }

          .cart-item {
            grid-template-columns: 90px 1fr;
            gap: 18px;
          }

          .item-image {
            width: 90px;
            height: 115px;
          }

          .item-actions {
            grid-column: 1 / -1;
            width: 100%;
            height: auto;
            flex-direction: row;
            align-items: center;
          }

          .cart-summary {
            padding: 30px 22px;
          }
        }
      `}</style>
    </>
  );
}