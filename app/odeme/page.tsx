"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  LockKeyhole,
  MapPin,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function PaymentPage() {
  const router = useRouter();
  const { items } = useCart();

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [addressTitle, setAddressTitle] = useState("Ev");

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const hasDiscount =
        item.product.discountPrice !== null &&
        item.product.discountPrice !== undefined &&
        item.product.discountPrice < item.product.price;

      const price = hasDiscount
        ? item.product.discountPrice!
        : item.product.price;

      return total + price * item.quantity;
    }, 0);
  }, [items]);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/giris?redirect=/odeme");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setPhone(profile.phone ?? "");
      }

      setLoading(false);
    }

    loadUser();
  }, [router]);

  function handleContinuePayment() {
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !district.trim() ||
      !address.trim()
    ) {
      alert("Lütfen tüm teslimat bilgilerini doldurun.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      alert("Telefon numarasını kontrol edin.");
      return;
    }

    if (items.length === 0) {
      alert("Sepetiniz boş.");
      router.push("/urunler");
      return;
    }

    setChecking(true);

    window.setTimeout(() => {
      setChecking(false);

      alert(
        "Teslimat bilgileri hazır. Şimdi iyzico ödeme sistemini bağlayacağız."
      );
    }, 700);
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="loading-page">
          <div className="loader" />
          <span>HESAP KONTROL EDİLİYOR</span>
        </main>

        <Footer />

        <style jsx>{`
          .loading-page {
            min-height: 70vh;
            background: #f5f3ee;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }

          .loader {
            width: 36px;
            height: 36px;
            border: 2px solid #d5d1c8;
            border-top-color: #111111;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }

          .loading-page span {
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 4px;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />

        <main className="empty-page">
          <ShoppingBag size={52} strokeWidth={1.2} />

          <span>ÖDEME</span>

          <h1>Sepetin boş.</h1>

          <p>
            Ödeme işlemine devam etmek için önce sepetine ürün
            eklemelisin.
          </p>

          <Link href="/urunler">Ürünleri Keşfet</Link>
        </main>

        <Footer />

        <style jsx>{`
          .empty-page {
            min-height: 70vh;
            padding: 80px 20px;
            background: #f5f3ee;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .empty-page > span {
            margin: 25px 0 15px;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 4px;
          }

          .empty-page h1 {
            font-size: clamp(45px, 7vw, 85px);
            letter-spacing: -5px;
          }

          .empty-page p {
            max-width: 430px;
            margin: 25px 0 35px;
            color: #666666;
            font-size: 14px;
            line-height: 1.8;
          }

          .empty-page a {
            min-height: 52px;
            padding: 0 25px;
            background: #111111;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 800;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="payment-page">
        <div className="payment-container">
          <div className="payment-header">
            <div>
              <span>GÜVENLİ ÖDEME</span>

              <h1>
                Siparişi
                <br />
                Tamamla.
              </h1>
            </div>

            <Link href="/sepet">
              <ArrowLeft size={17} />
              Sepete Dön
            </Link>
          </div>

          <div className="steps">
            <div className="step active">
              <span>01</span>
              <strong>Teslimat</strong>
            </div>

            <div className="step">
              <span>02</span>
              <strong>Ödeme</strong>
            </div>

            <div className="step">
              <span>03</span>
              <strong>Tamamlandı</strong>
            </div>
          </div>

          <div className="payment-layout">
            <section className="delivery-section">
              <div className="section-heading">
                <MapPin size={25} strokeWidth={1.5} />

                <div>
                  <span>TESLİMAT BİLGİLERİ</span>
                  <h2>Adresini gir.</h2>
                </div>
              </div>

              <div className="form-grid">
                <div className="field field-full">
                  <label>Ad Soyad</label>

                  <div className="input-wrapper">
                    <User size={17} strokeWidth={1.5} />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(event.target.value)
                      }
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Telefon</label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="05XX XXX XX XX"
                  />
                </div>

                <div className="field">
                  <label>Adres Başlığı</label>

                  <input
                    type="text"
                    value={addressTitle}
                    onChange={(event) =>
                      setAddressTitle(event.target.value)
                    }
                    placeholder="Ev, İş..."
                  />
                </div>

                <div className="field">
                  <label>Şehir</label>

                  <input
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(event.target.value)
                    }
                    placeholder="Erzurum"
                  />
                </div>

                <div className="field">
                  <label>İlçe</label>

                  <input
                    type="text"
                    value={district}
                    onChange={(event) =>
                      setDistrict(event.target.value)
                    }
                    placeholder="Yakutiye"
                  />
                </div>

                <div className="field field-full">
                  <label>Açık Adres</label>

                  <textarea
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    placeholder="Mahalle, cadde, sokak, bina ve daire bilgileri..."
                    rows={6}
                  />
                </div>
              </div>

              <div className="delivery-note">
                <Package size={20} strokeWidth={1.5} />

                <div>
                  <strong>Ücretsiz Kargo</strong>

                  <p>
                    Siparişin ödeme sonrasında hazırlanarak kargoya
                    teslim edilir.
                  </p>
                </div>
              </div>
            </section>

            <aside className="order-summary">
              <div className="summary-heading">
                <span>SİPARİŞ ÖZETİ</span>
                <h2>Sepetin.</h2>
              </div>

              <div className="summary-products">
                {items.map((item) => {
                  const hasDiscount =
                    item.product.discountPrice !== null &&
                    item.product.discountPrice !== undefined &&
                    item.product.discountPrice <
                      item.product.price;

                  const price = hasDiscount
                    ? item.product.discountPrice!
                    : item.product.price;

                  return (
                    <article
                      key={`${item.product.id}-${item.size}`}
                      className="summary-product"
                    >
                      <div className="product-image">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                          />
                        ) : (
                          <span>GJ</span>
                        )}
                      </div>

                      <div className="product-info">
                        <span>{item.product.category}</span>

                        <strong>{item.product.name}</strong>

                        <p>
                          {item.size} · {item.quantity} Adet
                        </p>
                      </div>

                      <strong className="product-price">
                        {formatPrice(price * item.quantity)}
                      </strong>
                    </article>
                  );
                })}
              </div>

              <div className="summary-price-row">
                <span>Ara Toplam</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <div className="summary-price-row">
                <span>Kargo</span>
                <strong>Ücretsiz</strong>
              </div>

              <div className="summary-total">
                <span>TOPLAM</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <Button
                type="button"
                fullWidth
                disabled={checking}
                onClick={handleContinuePayment}
              >
                {checking ? (
                  "Kontrol Ediliyor..."
                ) : (
                  <>
                    <LockKeyhole size={18} />
                    Ödemeye Devam Et
                  </>
                )}
              </Button>

              <div className="secure-note">
                <Check size={15} />

                <span>
                  Ödeme bilgileriniz güvenli ödeme altyapısı
                  üzerinden işlenir.
                </span>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .payment-page {
          min-height: 80vh;
          padding: 80px 0 120px;
          background: #f5f3ee;
        }

        .payment-container {
          width: min(1300px, calc(100% - 64px));
          margin: 0 auto;
        }

        .payment-header {
          margin-bottom: 55px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
        }

        .payment-header > div > span {
          display: block;
          margin-bottom: 20px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .payment-header h1 {
          font-size: clamp(65px, 8vw, 115px);
          line-height: 0.82;
          letter-spacing: -8px;
        }

        .payment-header a {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #666666;
          font-size: 11px;
          font-weight: 700;
        }

        .steps {
          margin-bottom: 55px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #d2cec5;
          border-left: 1px solid #d2cec5;
        }

        .step {
          min-height: 80px;
          padding: 20px;
          border-right: 1px solid #d2cec5;
          border-bottom: 1px solid #d2cec5;
          display: flex;
          align-items: center;
          gap: 18px;
          color: #99958c;
        }

        .step.active {
          background: #111111;
          color: #ffffff;
        }

        .step span {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .step strong {
          font-size: 13px;
        }

        .payment-layout {
          display: grid;
          grid-template-columns: 1fr 430px;
          gap: 55px;
          align-items: start;
        }

        .delivery-section {
          padding: 40px;
          border: 1px solid #d8d4cc;
          background: #ffffff;
        }

        .section-heading {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid #e1ddd5;
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }

        .section-heading span,
        .summary-heading span {
          display: block;
          margin-bottom: 8px;
          color: #777777;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .section-heading h2,
        .summary-heading h2 {
          font-size: 38px;
          letter-spacing: -2px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .field-full {
          grid-column: 1 / -1;
        }

        .field label {
          font-size: 11px;
          font-weight: 700;
        }

        .field input,
        .field textarea {
          width: 100%;
          border: 1px solid #d6d2ca;
          outline: none;
          background: #f8f7f3;
          color: #111111;
        }

        .field input {
          height: 52px;
          padding: 0 15px;
        }

        .field textarea {
          padding: 15px;
          resize: vertical;
          line-height: 1.6;
        }

        .field input:focus,
        .field textarea:focus {
          border-color: #111111;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper :global(svg) {
          position: absolute;
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
        }

        .input-wrapper input {
          padding-left: 45px;
        }

        .delivery-note {
          margin-top: 30px;
          padding: 22px;
          background: #f5f3ee;
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .delivery-note strong {
          display: block;
          margin-bottom: 5px;
          font-size: 12px;
        }

        .delivery-note p {
          color: #777777;
          font-size: 11px;
          line-height: 1.6;
        }

        .order-summary {
          position: sticky;
          top: 105px;
          padding: 35px;
          border: 1px solid #d8d4cc;
          background: #ffffff;
        }

        .summary-heading {
          margin-bottom: 30px;
        }

        .summary-products {
          max-height: 340px;
          overflow-y: auto;
        }

        .summary-product {
          padding: 16px 0;
          border-bottom: 1px solid #e1ddd5;
          display: grid;
          grid-template-columns: 65px 1fr auto;
          gap: 15px;
          align-items: center;
        }

        .product-image {
          width: 65px;
          height: 80px;
          background: #dedbd4;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-image span {
          font-size: 13px;
          font-weight: 900;
        }

        .product-info > span {
          display: block;
          margin-bottom: 5px;
          color: #888888;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .product-info strong {
          display: block;
          font-size: 11px;
          line-height: 1.4;
        }

        .product-info p {
          margin-top: 7px;
          color: #777777;
          font-size: 9px;
        }

        .product-price {
          font-size: 11px;
          white-space: nowrap;
        }

        .summary-price-row {
          min-height: 50px;
          border-bottom: 1px solid #e1ddd5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .summary-price-row span {
          color: #666666;
          font-size: 12px;
        }

        .summary-price-row strong {
          font-size: 12px;
        }

        .summary-total {
          padding: 27px 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .summary-total span {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .summary-total strong {
          font-size: 27px;
        }

        .secure-note {
          margin-top: 18px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 8px;
          color: #777777;
        }

        .secure-note span {
          max-width: 260px;
          font-size: 9px;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 950px) {
          .payment-layout {
            grid-template-columns: 1fr;
          }

          .order-summary {
            position: relative;
            top: auto;
          }
        }

        @media (max-width: 650px) {
          .payment-page {
            padding: 55px 0 80px;
          }

          .payment-container {
            width: calc(100% - 40px);
          }

          .payment-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .payment-header h1 {
            letter-spacing: -5px;
          }

          .steps {
            grid-template-columns: 1fr;
          }

          .delivery-section,
          .order-summary {
            padding: 25px 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field-full {
            grid-column: auto;
          }

          .summary-product {
            grid-template-columns: 55px 1fr;
          }

          .product-image {
            width: 55px;
            height: 70px;
          }

          .product-price {
            grid-column: 2;
          }
        }
      `}</style>
    </>
  );
}