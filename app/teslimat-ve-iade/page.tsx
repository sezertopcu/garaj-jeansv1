"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="legal-page">
        <div className="legal-container">
          <Link href="/" className="back-link">← Ana Sayfaya Dön</Link>
          <span className="eyebrow">YASAL · TESLİMAT</span>
          <h1>Teslimat ve İade</h1>
          <div className="legal-content">

            <section className="seller-box">
              <h2>Satıcı Bilgileri</h2>
              <p><strong>Garaj Jeans</strong></p>
              <p>Yetkili: İbrahim Kılıç</p>
              <p>Adres: Yakut Plaza Kat 1 No: 31, Erzurum, Türkiye</p>
              <p>Telefon: 0 534 786 98 70</p>
              <p>E-posta: kilic2551@gmail.com</p>
            </section>
            <section>
              <h2>1. Teslimat</h2>
              <p>Siparişler, ödeme onayının ardından hazırlanır ve belirtilen teslimat adresine gönderilir. Teslimat süresi stok durumu, kargo yoğunluğu ve alıcının bulunduğu bölgeye göre değişebilir.</p>
            </section>
            <section>
              <h2>2. Kargo</h2>
              <p>Siparişler anlaşmalı kargo firmaları aracılığıyla gönderilir. Kargo firmasından kaynaklanan gecikmelerde müşteriye mümkün olan en kısa sürede bilgi verilir.</p>
            </section>
            <section>
              <h2>3. Teslimat Kontrolü</h2>
              <p>Teslimat sırasında paketin hasarlı olması halinde kargo görevlisi yanında tutanak tutulması önerilir. Hasarlı veya eksik ürün durumunda bizimle iletişime geçilmelidir.</p>
            </section>
            <section>
              <h2>4. Cayma Hakkı ve İade</h2>
              <p>Tüketici, yasal istisnalar saklı kalmak kaydıyla, ürünü teslim aldığı tarihten itibaren 14 gün içinde cayma hakkını kullanabilir. İade talebi için ürün kullanılmamış, yeniden satılabilir durumda ve varsa tüm aksesuarlarıyla birlikte gönderilmelidir.</p>
            </section>
            <section>
              <h2>5. İade Süreci</h2>
              <p>İade talebi oluşturmak için kilic2551@gmail.com adresine e-posta gönderebilir veya 0 534 786 98 70 numaralı telefondan bizimle iletişime geçebilirsiniz.</p>
            </section>
            <section>
              <h2>6. İade Bedeli</h2>
              <p>İade edilen ürünün mevzuata ve iade koşullarına uygun olması halinde ürün bedeli, ödeme yöntemine uygun şekilde yasal süre içerisinde iade edilir.</p>
            </section>

          </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .legal-page {
          min-height: 70vh;
          padding: 90px 0 120px;
          background: #f5f3ee;
          color: #111;
        }
        .legal-container {
          width: min(980px, calc(100% - 48px));
          margin: 0 auto;
        }
        .back-link {
          display: inline-block;
          margin-bottom: 45px;
          color: #666;
          font-size: 12px;
          font-weight: 700;
        }
        .eyebrow {
          display: block;
          margin-bottom: 16px;
          color: #7d7972;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
        }
        h1 {
          margin: 0 0 55px;
          font-size: clamp(48px, 7vw, 92px);
          line-height: .9;
          letter-spacing: -6px;
        }
        .legal-content {
          display: grid;
          gap: 34px;
        }
        .legal-content :global(section) {
          padding-bottom: 28px;
          border-bottom: 1px solid #d6d2ca;
        }
        .legal-content :global(section:last-child) {
          border-bottom: 0;
        }
        .legal-content :global(h2) {
          margin: 0 0 14px;
          font-size: 24px;
          letter-spacing: -1px;
        }
        .legal-content :global(p),
        .legal-content :global(li) {
          color: #5f5b55;
          font-size: 15px;
          line-height: 1.8;
        }
        .legal-content :global(ul) {
          margin: 12px 0 0;
          padding-left: 20px;
        }
        .seller-box {
          padding: 24px;
          border: 1px solid #d6d2ca;
          background: #fff;
        }
        .seller-box :global(p) {
          margin: 4px 0;
        }
        @media (max-width: 600px) {
          .legal-page { padding: 65px 0 80px; }
          .legal-container { width: calc(100% - 30px); }
          h1 { letter-spacing: -4px; }
        }
      `}</style>

    </>
  );
}
