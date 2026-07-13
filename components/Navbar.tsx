"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Menu,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useCart } from "@/components/CartContext";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const { cartCount } = useCart();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        const { data: adminData } = await supabase.rpc(
          "is_admin"
        );

        if (mounted) {
          setIsAdmin(adminData === true);
        }
      } else {
        setIsAdmin(false);
      }

      if (mounted) {
        setAuthReady(true);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) {
          return;
        }

        const currentUser = session?.user ?? null;

        setUser(currentUser);

        if (currentUser) {
          const { data: adminData } = await supabase.rpc(
            "is_admin"
          );

          if (mounted) {
            setIsAdmin(adminData === true);
          }
        } else {
          setIsAdmin(false);
        }

        if (mounted) {
          setAuthReady(true);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const accountHref = user ? "/profil" : "/giris";

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          GARAJ<span>JEANS</span>
        </Link>

        <nav className="navbar-links">
          <Link href="/">Ana Sayfa</Link>
          <Link href="/urunler">Ürünler</Link>
          <Link href="/#hakkimizda">Hakkımızda</Link>
          <Link href="/#iletisim">İletişim</Link>
        </nav>

        <div className="navbar-actions">
          {isAdmin && (
            <Link
              href="/admin"
              className="navbar-icon admin-icon"
              aria-label="Yönetim Paneli"
              title="Yönetim Paneli"
            >
              <LayoutDashboard
                size={20}
                strokeWidth={1.8}
              />
            </Link>
          )}

          <Link
            href={authReady ? accountHref : "#"}
            className={`navbar-icon ${
              user ? "user-active" : ""
            }`}
            aria-label={user ? "Profilim" : "Giriş Yap"}
            title={user ? "Profilim" : "Giriş Yap"}
            onClick={(event) => {
              if (!authReady) {
                event.preventDefault();
              }
            }}
          >
            <User size={21} strokeWidth={1.8} />

            {user && <span className="user-status" />}
          </Link>

          <Link
            href="/sepet"
            className="navbar-icon"
            aria-label="Sepet"
            title="Sepet"
          >
            <ShoppingBag size={21} strokeWidth={1.8} />

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label="Menüyü Aç"
          >
            {menuOpen ? (
              <X size={24} strokeWidth={1.8} />
            ) : (
              <Menu size={24} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-menu">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
          >
            Ana Sayfa
          </Link>

          <Link
            href="/urunler"
            onClick={() => setMenuOpen(false)}
          >
            Ürünler
          </Link>

          <Link
            href="/#hakkimizda"
            onClick={() => setMenuOpen(false)}
          >
            Hakkımızda
          </Link>

          <Link
            href="/#iletisim"
            onClick={() => setMenuOpen(false)}
          >
            İletişim
          </Link>

          {authReady && (
            <Link
              href={accountHref}
              onClick={() => setMenuOpen(false)}
            >
              {user ? "Profilim" : "Giriş Yap"}
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
            >
              Yönetim Paneli
            </Link>
          )}

          <Link
            href="/sepet"
            onClick={() => setMenuOpen(false)}
          >
            Sepet {cartCount > 0 ? `(${cartCount})` : ""}
          </Link>
        </nav>
      )}

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(245, 243, 238, 0.94);
          border-bottom: 1px solid rgba(17, 17, 17, 0.1);
          backdrop-filter: blur(14px);
        }

        .navbar-container {
          width: min(1400px, calc(100% - 64px));
          height: 78px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          font-size: 23px;
          font-weight: 900;
          letter-spacing: -1.3px;
        }

        .navbar-logo span {
          font-weight: 400;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .navbar-links a {
          position: relative;
          font-size: 14px;
          font-weight: 600;
        }

        .navbar-links a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 0;
          height: 1px;
          background: #111111;
          transition: width 0.25s ease;
        }

        .navbar-links a:hover::after {
          width: 100%;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .navbar-icon,
        .mobile-menu-button {
          position: relative;
          width: 42px;
          height: 42px;
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .navbar-icon:hover,
        .mobile-menu-button:hover {
          background: #e8e5de;
          transform: translateY(-1px);
        }

        .user-active {
          background: #e8e5de;
        }

        .user-status {
          position: absolute;
          right: 5px;
          bottom: 5px;
          width: 8px;
          height: 8px;
          border: 2px solid #f5f3ee;
          border-radius: 50%;
          background: #2f8f52;
        }

        .admin-icon {
          background: #111111;
          color: #ffffff;
        }

        .admin-icon:hover {
          background: #2b2b2b;
        }

        .cart-count {
          position: absolute;
          top: 3px;
          right: 2px;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 20px;
          background: #111111;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-button {
          display: none;
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 800px) {
          .navbar-container {
            width: min(100% - 32px, 1400px);
            height: 68px;
          }

          .navbar-links {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            padding: 12px 16px 24px;
            background: #f5f3ee;
            border-top: 1px solid rgba(17, 17, 17, 0.08);
          }

          .mobile-menu a {
            padding: 15px 8px;
            border-bottom: 1px solid rgba(17, 17, 17, 0.08);
            font-size: 15px;
            font-weight: 600;
          }
        }

        @media (max-width: 420px) {
          .navbar-logo {
            font-size: 19px;
          }

          .navbar-actions {
            gap: 2px;
          }

          .navbar-icon,
          .mobile-menu-button {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>
    </header>
  );
}