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
          <Link href="/" className="back-link">
            ← Ana Sayfaya Dön
          </Link>

          <span className="eyebrow">YASAL · SÖZLEŞME</span>
          <h1>Mesafeli Satış Sözleşmesi</h1>

          <div className="notice">
            Bu sayfa, Garaj Jeans internet sitesi üzerinden yapılacak mesafeli
            satışlara ilişkin genel sözleşme koşullarını içerir. Siparişe özel
            ürün, adet, tutar, teslimat ve alıcı bilgileri sipariş sırasında
            kullanıcıya ayrıca gösterilir.
          </div>

          <div className="legal-content">
            <section>
              <h2>1. TARAFLAR</h2>

              <h3>1.1. SATICI</h3>
              <div className="seller-box">
                <p>
                  <strong>Unvan / İşletme Adı:</strong> Garaj Jeans
                </p>
                <p>
                  <strong>Yetkili:</strong> İbrahim Kılıç
                </p>
                <p>
                  <strong>Adres:</strong> Yakut Plaza Kat 1 No: 31, Erzurum,
                  Türkiye
                </p>
                <p>
                  <strong>Telefon:</strong> 0 534 786 98 70
                </p>
                <p>
                  <strong>E-posta:</strong> kilic2551@gmail.com
                </p>
                <p>
                  <strong>Vergi Dairesi:</strong> Kazımkarabekir Vergi Dairesi
                </p>
                <p>
                  <strong>Vergi No:</strong> 11381177694
                </p>
              </div>

              <h3>1.2. ALICI</h3>
              <p>
                Alıcı; internet sitesi üzerinden sipariş veren ve sipariş
                sırasında ad, soyad, iletişim, teslimat ve gerektiğinde fatura
                bilgilerini beyan eden gerçek veya tüzel kişidir.
              </p>

              <p>
                ALICI, siparişi onaylaması halinde ürün bedeli ile sipariş
                ekranında açıkça gösterilen varsa kargo, vergi veya diğer
                ücretleri ödeme yükümlülüğü altına gireceğini kabul eder.
              </p>
            </section>

            <section>
              <h2>2. TANIMLAR</h2>

              <ul>
                <li>
                  <strong>BAKANLIK:</strong> Türkiye Cumhuriyeti Ticaret
                  Bakanlığı&apos;nı,
                </li>
                <li>
                  <strong>KANUN:</strong> 6502 sayılı Tüketicinin Korunması
                  Hakkında Kanun&apos;u,
                </li>
                <li>
                  <strong>YÖNETMELİK:</strong> Mesafeli Sözleşmeler
                  Yönetmeliği&apos;ni,
                </li>
                <li>
                  <strong>SATICI:</strong> Garaj Jeans&apos;i,
                </li>
                <li>
                  <strong>ALICI:</strong> Ticari veya mesleki olmayan amaçlarla
                  ürün satın alan tüketiciyi,
                </li>
                <li>
                  <strong>SİTE:</strong> Garaj Jeans&apos;e ait internet
                  sitesini,
                </li>
                <li>
                  <strong>TARAFLAR:</strong> SATICI ve ALICI&apos;yı,
                </li>
                <li>
                  <strong>SÖZLEŞME:</strong> İşbu Mesafeli Satış
                  Sözleşmesi&apos;ni,
                </li>
                <li>
                  <strong>MAL / ÜRÜN:</strong> Site üzerinden satışa sunulan
                  giyim ve aksesuar ürünlerini ifade eder.
                </li>
              </ul>
            </section>

            <section>
              <h2>3. SÖZLEŞMENİN KONUSU</h2>

              <p>
                İşbu Sözleşme, ALICI&apos;nın SATICI&apos;ya ait internet sitesi
                üzerinden elektronik ortamda sipariş verdiği ürün veya ürünlerin
                satışı ve teslimine ilişkin olarak 6502 sayılı Tüketicinin
                Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
                kapsamında tarafların hak ve yükümlülüklerini düzenler.
              </p>

              <p>
                Site üzerinde ilan edilen ürün fiyatları satış fiyatıdır.
                Kampanyalı veya süreli fiyatlar, belirtilen kampanya süresi
                boyunca geçerlidir.
              </p>
            </section>

            <section>
              <h2>4. SATICI BİLGİLERİ</h2>

              <p>Unvan / İşletme Adı: Garaj Jeans</p>
              <p>Yetkili: İbrahim Kılıç</p>
              <p>Adres: Yakut Plaza Kat 1 No: 31, Erzurum, Türkiye</p>
              <p>Telefon: 0 534 786 98 70</p>
              <p>E-posta: kilic2551@gmail.com</p>
              <p>Vergi Dairesi: Kazımkarabekir Vergi Dairesi</p>
              <p>Vergi No: 11381177694</p>
            </section>

            <section>
              <h2>5. ALICI VE SİPARİŞ VEREN BİLGİLERİ</h2>

              <p>
                Alıcının adı, soyadı, teslimat adresi, telefon numarası, e-posta
                adresi ve varsa fatura bilgileri sipariş sırasında ALICI
                tarafından girilen bilgilerdir. ALICI, verdiği bilgilerin doğru
                ve güncel olduğunu kabul eder.
              </p>
            </section>

            <section>
              <h2>6. SÖZLEŞME KONUSU ÜRÜN VE FİYAT BİLGİLERİ</h2>

              <p>
                Siparişe konu ürünün adı, kategorisi, bedeni, rengi, adedi,
                birim fiyatı, indirim bilgisi ve toplam satış bedeli sipariş
                öncesinde ürün sayfasında, sepette ve ödeme adımında ALICI&apos;ya
                gösterilir.
              </p>

              <p>
                Siparişin toplam bedeli, varsa kargo ücreti ve diğer ücretler
                ödeme işlemi tamamlanmadan önce ALICI&apos;ya açıkça gösterilir.
              </p>
            </section>

            <section>
              <h2>7. ÖDEME</h2>

              <p>
                ALICI, sipariş bedelini ödeme ekranında sunulan ödeme
                yöntemlerinden biriyle öder. Ödeme onayı alınmayan siparişler
                tamamlanmış sayılmaz.
              </p>

              <p>
                Kart bilgileri Garaj Jeans tarafından saklanmaz. Kartlı ödeme
                işlemleri ödeme hizmet sağlayıcısının güvenli altyapısı üzerinden
                gerçekleştirilir.
              </p>
            </section>

            <section>
              <h2>8. FATURA BİLGİLERİ</h2>

              <p>
                Fatura için gerekli ad, soyad veya unvan, adres ve diğer bilgiler
                ALICI tarafından sipariş sırasında beyan edilir. Fatura, yürürlükteki
                mevzuata ve SATICI&apos;nın kullandığı faturalama yöntemine uygun
                biçimde düzenlenir.
              </p>
            </section>

            <section>
              <h2>9. GENEL HÜKÜMLER</h2>

              <h3>9.1. Bilgilendirme ve Kabul</h3>
              <p>
                ALICI; sipariş vermeden önce ürünün temel nitelikleri, satış
                fiyatı, ödeme şekli, teslimat ve iade koşulları hakkında bilgi
                sahibi olduğunu ve siparişini bu bilgiler doğrultusunda
                onayladığını kabul eder.
              </p>

              <h3>9.2. Teslimat</h3>
              <p>
                Siparişler, ALICI&apos;nın sipariş sırasında bildirdiği teslimat
                adresine gönderilir. Teslimat, ürünün hazırlanması ve kargoya
                verilmesinden sonra ilgili kargo firmasının operasyon koşullarına
                göre gerçekleştirilir.
              </p>

              <h3>9.3. Teslim Süresi</h3>
              <p>
                Sözleşme konusu ürün, yasal zorunluluklar saklı kalmak kaydıyla
                mümkün olan en kısa sürede ve her durumda mevzuatta öngörülen
                azami süre içerisinde ALICI&apos;ya teslim edilir.
              </p>
            </section>

            <section>
              <h2>10. CAYMA HAKKI</h2>

              <p>
                ALICI, mal satışına ilişkin mesafeli sözleşmelerde, mevzuatta
                belirtilen istisnalar dışında, ürünü kendisinin veya gösterdiği
                kişi ya da kuruluşun teslim aldığı tarihten itibaren 14 gün
                içerisinde herhangi bir gerekçe göstermeksizin cayma hakkını
                kullanabilir.
              </p>

              <p>
                Cayma hakkının kullanılması için 14 günlük süre içerisinde
                SATICI&apos;ya açık bir bildirim yapılması gerekir. Bildirim
                kilic2551@gmail.com e-posta adresi veya 0 534 786 98 70
                numaralı telefon üzerinden iletilebilir.
              </p>
            </section>

            <section>
              <h2>11. CAYMA HAKKININ KULLANILAMAYACAĞI DURUMLAR</h2>

              <p>
                Cayma hakkına ilişkin kanuni istisnalar saklıdır. Özellikle
                ALICI&apos;nın talebi doğrultusunda kişiye özel hazırlanan
                ürünlerde veya tesliminden sonra ambalaj, bant, mühür ya da
                benzeri koruyucu unsurları açılmış olması nedeniyle sağlık ve
                hijyen açısından iadesi uygun olmayan ürünlerde mevzuat
                kapsamında cayma hakkı kullanılamayabilir.
              </p>
            </section>

            <section>
              <h2>12. İADE VE GERİ ÖDEME</h2>

              <p>
                Cayma hakkının usulüne uygun kullanılması halinde iade süreci,
                sitede yer alan Teslimat ve İade koşullarına ve yürürlükteki
                mevzuata uygun şekilde yürütülür.
              </p>

              <p>
                İade edilen ürünün gerekli koşulları sağlaması halinde geri ödeme,
                yasal süreler içerisinde ve mümkün olduğu ölçüde ALICI&apos;nın
                ödeme sırasında kullandığı ödeme yöntemine uygun olarak
                gerçekleştirilir.
              </p>
            </section>

            <section>
              <h2>13. TEMERRÜT HÂLİ VE HUKUKİ SONUÇLARI</h2>

              <p>
                ALICI&apos;nın kredi kartıyla gerçekleştirdiği işlemlerde bankaya
                karşı olan yükümlülükleri, ALICI ile kartı düzenleyen banka
                arasındaki sözleşme hükümlerine tabidir.
              </p>
            </section>

            <section>
              <h2>14. YETKİLİ MERCİLER</h2>

              <p>
                İşbu sözleşmeden doğabilecek tüketici uyuşmazlıklarında,
                yürürlükteki mevzuatta belirlenen parasal sınırlar ve yetki
                kuralları çerçevesinde tüketicinin yerleşim yerindeki veya
                tüketici işleminin yapıldığı yerdeki Tüketici Hakem Heyetleri ve
                Tüketici Mahkemelerine başvurulabilir.
              </p>
            </section>

            <section>
              <h2>15. YÜRÜRLÜK</h2>

              <p>
                ALICI, siparişi tamamlamadan önce kendisine sunulan ürün,
                fiyat, ödeme, teslimat, cayma ve iade bilgilerini okuyup
                onayladığını kabul eder. Siparişin ödeme adımında onaylanmasıyla
                siparişe ilişkin mesafeli satış hükümleri yürürlüğe girer.
              </p>
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
          color: #111111;
        }

        .legal-container {
          width: min(980px, calc(100% - 48px));
          margin: 0 auto;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 45px;
          color: #666666;
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
          margin: 0 0 35px;
          font-size: clamp(48px, 7vw, 92px);
          line-height: 0.9;
          letter-spacing: -6px;
        }

        .notice {
          margin-bottom: 45px;
          padding: 20px 22px;
          border: 1px solid #d6d2ca;
          background: #ffffff;
          color: #66615b;
          font-size: 13px;
          line-height: 1.75;
        }

        .legal-content {
          display: grid;
          gap: 34px;
        }

        .legal-content :global(section) {
          padding-bottom: 30px;
          border-bottom: 1px solid #d6d2ca;
        }

        .legal-content :global(section:last-child) {
          border-bottom: 0;
        }

        .legal-content :global(h2) {
          margin: 0 0 17px;
          font-size: 24px;
          letter-spacing: -1px;
        }

        .legal-content :global(h3) {
          margin: 22px 0 10px;
          font-size: 16px;
        }

        .legal-content :global(p),
        .legal-content :global(li) {
          color: #5f5b55;
          font-size: 15px;
          line-height: 1.8;
        }

        .legal-content :global(p) {
          margin: 8px 0;
        }

        .legal-content :global(ul) {
          margin: 12px 0 0;
          padding-left: 20px;
        }

        .seller-box {
          margin: 12px 0 18px;
          padding: 24px;
          border: 1px solid #d6d2ca;
          background: #ffffff;
        }

        .seller-box :global(p) {
          margin: 4px 0;
        }

        @media (max-width: 600px) {
          .legal-page {
            padding: 65px 0 80px;
          }

          .legal-container {
            width: calc(100% - 30px);
          }

          h1 {
            letter-spacing: -4px;
          }
        }
      `}</style>
    </>
  );
}
