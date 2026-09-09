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
          <span className="eyebrow">YASAL · GİZLİLİK</span>
          <h1>Gizlilik Politikası</h1>
          <div className="legal-content">

            <section className="seller-box">
              <h2>Veri Sorumlusu</h2>
              <p><strong>Garaj Jeans</strong></p>
              <p>Yetkili: İbrahim Kılıç</p>
              <p>Adres: Yakut Plaza Kat 1 No: 31, Erzurum, Türkiye</p>
              <p>Telefon: 0 534 786 98 70</p>
              <p>E-posta: kilic2551@gmail.com</p>
              <p>Vergi Dairesi: Kazımkarabekir Vergi Dairesi</p>
              <p>Vergi No: 11381177694</p>
            </section>
            <section>
              <h2>1. Amaç ve Kapsam</h2>
              <p>Bu Gizlilik Politikası, Garaj Jeans web sitesini ziyaret eden ve alışveriş yapan kullanıcıların kişisel verilerinin hangi amaçlarla işlendiğini, nasıl korunduğunu ve kullanıcıların haklarını açıklar.</p>
            </section>
            <section>
              <h2>2. İşlenen Kişisel Veriler</h2>
              <ul>
                <li>Ad, soyad ve iletişim bilgileri</li>
                <li>Teslimat ve fatura adresi bilgileri</li>
                <li>Sipariş ve alışveriş geçmişi bilgileri</li>
                <li>Hesap ve oturum bilgileri</li>
                <li>Site kullanımına ilişkin teknik kayıtlar</li>
              </ul>
            </section>
            <section>
              <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
              <ul>
                <li>Siparişlerin alınması, hazırlanması ve teslim edilmesi</li>
                <li>Müşteri hesabının ve sipariş geçmişinin yönetilmesi</li>
                <li>Müşteri taleplerinin ve destek süreçlerinin yürütülmesi</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Dolandırıcılık ve güvenlik kontrollerinin gerçekleştirilmesi</li>
              </ul>
            </section>
            <section>
              <h2>4. Ödeme Bilgileri</h2>
              <p>Kart bilgileri Garaj Jeans tarafından saklanmaz. Ödeme işlemleri ilgili ödeme hizmet sağlayıcısının güvenli altyapısı üzerinden gerçekleştirilir.</p>
            </section>
            <section>
              <h2>5. Kişisel Verilerin Paylaşılması</h2>
              <p>Kişisel veriler; siparişin teslimi için kargo firmaları, ödeme işlemleri için ödeme hizmet sağlayıcıları ve yasal zorunluluklar kapsamında yetkili kamu kurumlarıyla gerekli olduğu ölçüde paylaşılabilir.</p>
            </section>
            <section>
              <h2>6. Saklama Süresi</h2>
              <p>Kişisel veriler, işlenme amacı için gerekli süre boyunca ve ilgili mevzuatta öngörülen yasal saklama süreleri kapsamında saklanır.</p>
            </section>
            <section>
              <h2>7. Haklarınız</h2>
              <p>Kişisel verilerinizle ilgili bilgi talep etmek, düzeltme veya silme istemek ve diğer yasal haklarınızı kullanmak için kilic2551@gmail.com adresinden bizimle iletişime geçebilirsiniz.</p>
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
