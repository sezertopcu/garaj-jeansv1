"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  LogOut,
  Mail,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (!currentUser) {
        router.replace("/giris");
        return;
      }

      setUser(currentUser);

      const { data: adminData } = await supabase.rpc(
        "is_admin"
      );

      if (mounted) {
        setIsAdmin(adminData === true);
        setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);

    await supabase.auth.signOut();

    router.replace("/giris");
    router.refresh();
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="profile-loading">
          <span>GARAJ JEANS</span>
          <h1>Profil yükleniyor.</h1>
        </main>

        <style jsx>{`
          .profile-loading {
            min-height: 70vh;
            background: #f5f3ee;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .profile-loading span {
            margin-bottom: 15px;
            color: #77736c;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 4px;
          }

          .profile-loading h1 {
            margin: 0;
            font-size: clamp(35px, 5vw, 70px);
            letter-spacing: -4px;
          }
        `}</style>
      </>
    );
  }

  if (!user) {
    return null;
  }

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "Garaj Jeans Kullanıcısı";

  const phone =
    typeof user.user_metadata?.phone === "string"
      ? user.user_metadata.phone
      : "Telefon bilgisi bulunmuyor";

  const email = user.email ?? "E-posta bilgisi bulunmuyor";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <section className="profile-hero">
          <div className="profile-container">
            <div className="profile-eyebrow">
              <span>GARAJ JEANS · HESABIM</span>

              <strong>2017</strong>
            </div>

            <div className="profile-title">
              <div>
                <h1>
                  BENİM
                  <br />
                  <em>PROFİLİM.</em>
                </h1>

                <p>
                  Siparişlerini takip et, mesajlarını görüntüle ve
                  hesap bilgilerini kontrol et.
                </p>
              </div>

              <div className="profile-avatar">
                <span>{initials || "GJ"}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-content">
          <div className="profile-container">
            <div className="profile-layout">
              <aside className="profile-sidebar">
                <div className="user-card">
                  <div className="user-card-top">
                    <div className="small-avatar">
                      {initials || "GJ"}
                    </div>

                    <div>
                      <span>HOŞ GELDİN</span>
                      <h2>{fullName}</h2>
                    </div>
                  </div>

                  <div className="user-detail">
                    <Mail size={18} strokeWidth={1.6} />

                    <div>
                      <span>E-POSTA</span>
                      <p>{email}</p>
                    </div>
                  </div>

                  <div className="user-detail">
                    <Phone size={18} strokeWidth={1.6} />

                    <div>
                      <span>TELEFON</span>
                      <p>{phone}</p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="admin-badge">
                      <ShieldCheck
                        size={18}
                        strokeWidth={1.7}
                      />
                      Yönetici Hesabı
                    </div>
                  )}

                  <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <LogOut size={18} strokeWidth={1.7} />

                    {loggingOut
                      ? "Çıkış Yapılıyor..."
                      : "Çıkış Yap"}
                  </button>
                </div>
              </aside>

              <div className="profile-main">
                <div className="profile-section-header">
                  <span>HESAP MERKEZİ</span>

                  <h2>Ne yapmak istersin?</h2>
                </div>

                <div className="profile-menu-grid">
                  <button
                    type="button"
                    className="profile-menu-card"
                    onClick={() => router.push("/siparislerim")}
                  >
                    <span className="card-number">01</span>

                    <Package size={34} strokeWidth={1.4} />

                    <div>
                      <h3>Siparişlerim</h3>

                      <p>
                        Verdiğin siparişleri ve kargo durumunu
                        takip et.
                      </p>
                    </div>

                    <strong>GÖRÜNTÜLE →</strong>
                  </button>

                  <button
                    type="button"
                    className="profile-menu-card"
                    onClick={() => router.push("/mesajlarim")}
                  >
                    <span className="card-number">02</span>

                    <MessageCircle
                      size={34}
                      strokeWidth={1.4}
                    />

                    <div>
                      <h3>Mesajlarım</h3>

                      <p>
                        Garaj Jeans mağazasıyla olan mesajlarını
                        görüntüle.
                      </p>
                    </div>

                    <strong>MESAJLARA GİT →</strong>
                  </button>

                  <button
                    type="button"
                    className="profile-menu-card"
                    onClick={() => router.push("/hesabim")}
                  >
                    <span className="card-number">03</span>

                    <UserRound size={34} strokeWidth={1.4} />

                    <div>
                      <h3>Hesap Bilgilerim</h3>

                      <p>
                        Ad, telefon ve hesap bilgilerini kontrol
                        et.
                      </p>
                    </div>

                    <strong>HESABIM →</strong>
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      className="profile-menu-card admin-card"
                      onClick={() => router.push("/admin")}
                    >
                      <span className="card-number">04</span>

                      <ShieldCheck
                        size={34}
                        strokeWidth={1.4}
                      />

                      <div>
                        <h3>Yönetim Paneli</h3>

                        <p>
                          Ürünleri, siparişleri ve mağaza
                          işlemlerini yönet.
                        </p>
                      </div>

                      <strong>YÖNETİME GİT →</strong>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .profile-page {
          width: 100%;
          overflow: hidden;
          background: #f5f3ee;
        }

        .profile-container {
          width: min(1280px, calc(100% - 70px));
          margin: 0 auto;
        }

        .profile-hero {
          padding: 70px 0 80px;
          border-bottom: 1px solid #d8d4cc;
        }

        .profile-eyebrow {
          margin-bottom: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .profile-eyebrow span {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .profile-eyebrow strong {
          color: #8c8880;
          font-size: 13px;
          letter-spacing: 3px;
        }

        .profile-title {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 60px;
        }

        .profile-title h1 {
          margin: 0;
          font-size: clamp(70px, 8vw, 125px);
          line-height: 0.78;
          letter-spacing: -8px;
          font-weight: 900;
        }

        .profile-title h1 em {
          font-weight: 300;
        }

        .profile-title p {
          max-width: 500px;
          margin: 40px 0 0;
          color: #66625c;
          font-size: 16px;
          line-height: 1.8;
        }

        .profile-avatar {
          width: 170px;
          height: 170px;
          flex-shrink: 0;
          border: 1px solid #cbc7bf;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-avatar span {
          font-size: 55px;
          font-weight: 900;
          letter-spacing: -4px;
        }

        .profile-content {
          padding: 80px 0 120px;
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 350px minmax(0, 1fr);
          gap: 70px;
          align-items: start;
        }

        .user-card {
          border: 1px solid #d4d0c8;
          background: #ebe8e1;
          padding: 30px;
        }

        .user-card-top {
          padding-bottom: 28px;
          border-bottom: 1px solid #d0ccc4;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .small-avatar {
          width: 55px;
          height: 55px;
          flex-shrink: 0;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 800;
        }

        .user-card-top span,
        .user-detail span {
          display: block;
          margin-bottom: 5px;
          color: #858078;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .user-card-top h2 {
          margin: 0;
          font-size: 20px;
          line-height: 1.2;
          letter-spacing: -1px;
        }

        .user-detail {
          padding: 22px 0;
          border-bottom: 1px solid #d0ccc4;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .user-detail p {
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          word-break: break-word;
        }

        .admin-badge {
          margin-top: 22px;
          min-height: 45px;
          padding: 0 15px;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
        }

        .logout-button {
          width: 100%;
          min-height: 50px;
          margin-top: 25px;
          border: 1px solid #bbb7af;
          background: transparent;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .logout-button:hover {
          background: #111111;
          color: #ffffff;
        }

        .logout-button:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        .profile-section-header {
          margin-bottom: 35px;
        }

        .profile-section-header > span {
          display: block;
          margin-bottom: 12px;
          color: #7d7972;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .profile-section-header h2 {
          margin: 0;
          font-size: clamp(35px, 4vw, 55px);
          line-height: 1;
          letter-spacing: -4px;
        }

        .profile-menu-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          border-top: 1px solid #cbc7bf;
          border-left: 1px solid #cbc7bf;
        }

        .profile-menu-card {
          position: relative;
          min-height: 330px;
          padding: 32px;
          border: 0;
          border-right: 1px solid #cbc7bf;
          border-bottom: 1px solid #cbc7bf;
          background: transparent;
          color: #111111;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          cursor: pointer;
          transition:
            background 0.3s ease,
            transform 0.3s ease;
        }

        .profile-menu-card:hover {
          z-index: 2;
          background: #ebe8e1;
          transform: translateY(-5px);
        }

        .card-number {
          position: absolute;
          top: 30px;
          right: 30px;
          color: #99958d;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .profile-menu-card > :global(svg) {
          margin-bottom: 65px;
        }

        .profile-menu-card h3 {
          margin: 0 0 12px;
          font-size: 27px;
          letter-spacing: -1.5px;
        }

        .profile-menu-card p {
          max-width: 280px;
          margin: 0;
          color: #6e6a63;
          font-size: 13px;
          line-height: 1.7;
        }

        .profile-menu-card > strong {
          margin-top: auto;
          padding-top: 30px;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .admin-card {
          background: #111111;
          color: #ffffff;
        }

        .admin-card:hover {
          background: #242424;
        }

        .admin-card p,
        .admin-card .card-number {
          color: #999999;
        }

        @media (max-width: 1000px) {
          .profile-container {
            width: min(760px, calc(100% - 50px));
          }

          .profile-layout {
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .profile-sidebar {
            max-width: 500px;
          }
        }

        @media (max-width: 650px) {
          .profile-container {
            width: calc(100% - 30px);
          }

          .profile-hero {
            padding: 55px 0 65px;
          }

          .profile-title {
            align-items: flex-start;
            flex-direction: column;
            gap: 45px;
          }

          .profile-title h1 {
            font-size: clamp(65px, 21vw, 95px);
            letter-spacing: -6px;
          }

          .profile-title p {
            font-size: 14px;
          }

          .profile-avatar {
            width: 110px;
            height: 110px;
          }

          .profile-avatar span {
            font-size: 38px;
          }

          .profile-content {
            padding: 60px 0 80px;
          }

          .profile-menu-grid {
            grid-template-columns: 1fr;
          }

          .profile-menu-card {
            min-height: 280px;
            padding: 27px;
          }

          .profile-menu-card > :global(svg) {
            margin-bottom: 50px;
          }
        }
      `}</style>
    </>
  );
}