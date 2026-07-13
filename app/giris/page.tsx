"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  UserPlus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">(
    "login"
  );

  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function changeMode(newMode: "login" | "register") {
    setMode(newMode);
    setMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (mode === "register") {
        const cleanName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

        if (!cleanName) {
          setErrorMessage("Lütfen adınızı ve soyadınızı girin.");
          setLoading(false);
          return;
        }

        if (!cleanPhone) {
          setErrorMessage("Lütfen telefon numaranızı girin.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (
          data.user &&
          Array.isArray(data.user.identities) &&
          data.user.identities.length === 0
        ) {
          setErrorMessage(
            "Bu e-posta adresiyle daha önce hesap oluşturulmuş olabilir."
          );
          setLoading(false);
          return;
        }

        setMessage(
          "Hesabın oluşturuldu. E-posta adresine gönderilen doğrulama bağlantısına tıkla. Ardından giriş yapabilirsin."
        );

        setFullName("");
        setPassword("");
        setPhone("");

        setLoading(false);
        return;
      }

      const cleanEmail = email.trim().toLowerCase();

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        if (
          error.message
            .toLowerCase()
            .includes("email not confirmed")
        ) {
          setErrorMessage(
            "E-posta adresin henüz doğrulanmamış. Gelen kutundaki doğrulama bağlantısına tıkla."
          );

          setLoading(false);
          return;
        }

        if (
          error.message
            .toLowerCase()
            .includes("invalid login credentials")
        ) {
          setErrorMessage(
            "E-posta adresi veya şifre hatalı."
          );

          setLoading(false);
          return;
        }

        throw error;
      }

      if (!data.user) {
        setErrorMessage("Giriş işlemi tamamlanamadı.");
        setLoading(false);
        return;
      }

      const { data: adminData } = await supabase.rpc(
        "is_admin"
      );

      if (adminData === true) {
        router.push("/admin");
        router.refresh();
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Kimlik doğrulama hatası:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <div className="auth-container">
          <section className="auth-brand">
            <span>GARAJ JEANS · 2017</span>

            <h1>
              TARZINA
              <br />
              GİRİŞ
              <br />
              <em>YAP.</em>
            </h1>

            <p>
              Hesabına giriş yap, siparişlerini takip et ve
              Garaj Jeans koleksiyonunu keşfet.
            </p>
          </section>

          <section className="auth-box">
            <div className="auth-tabs">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => changeMode("login")}
              >
                <LogIn size={17} strokeWidth={1.7} />
                Giriş Yap
              </button>

              <button
                type="button"
                className={
                  mode === "register" ? "active" : ""
                }
                onClick={() => changeMode("register")}
              >
                <UserPlus size={17} strokeWidth={1.7} />
                Kayıt Ol
              </button>
            </div>

            <div className="auth-content">
              <span className="auth-label">
                {mode === "login"
                  ? "TEKRAR HOŞ GELDİN"
                  : "GARAJ'A KATIL"}
              </span>

              <h2>
                {mode === "login"
                  ? "Hesabına Gir."
                  : "Hesabını Oluştur."}
              </h2>

              {message && (
                <div className="success-message">
                  <CheckCircle2
                    size={22}
                    strokeWidth={1.7}
                  />

                  <p>{message}</p>
                </div>
              )}

              {errorMessage && (
                <div className="error-message">
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {mode === "register" && (
                  <div className="field">
                    <label>Ad Soyad</label>

                    <input
                      type="text"
                      placeholder="Adınız ve soyadınız"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(event.target.value)
                      }
                      autoComplete="name"
                      required
                    />
                  </div>
                )}

                <div className="field">
                  <label>E-posta</label>

                  <input
                    type="email"
                    placeholder="ornek@mail.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="field">
                  <label>Şifre</label>

                  <div className="password-field">
                    <input
                      type={
                        showPassword ? "text" : "password"
                      }
                      placeholder="Şifreniz"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      autoComplete={
                        mode === "login"
                          ? "current-password"
                          : "new-password"
                      }
                      minLength={6}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Şifreyi gizle"
                          : "Şifreyi göster"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={19}
                          strokeWidth={1.7}
                        />
                      ) : (
                        <Eye
                          size={19}
                          strokeWidth={1.7}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div className="field">
                    <label>Telefon</label>

                    <input
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      autoComplete="tel"
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-button">
                      <Loader2
                        size={18}
                        strokeWidth={1.8}
                      />
                      İşlem Yapılıyor
                    </span>
                  ) : mode === "login" ? (
                    "Giriş Yap"
                  ) : (
                    "Hesap Oluştur"
                  )}
                </Button>
              </form>

              <p className="auth-switch">
                {mode === "login"
                  ? "Henüz hesabın yok mu?"
                  : "Zaten hesabın var mı?"}

                <button
                  type="button"
                  onClick={() =>
                    changeMode(
                      mode === "login"
                        ? "register"
                        : "login"
                    )
                  }
                >
                  {mode === "login"
                    ? "Kayıt Ol"
                    : "Giriş Yap"}
                </button>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .auth-page {
          min-height: calc(100vh - 78px);
          padding: 80px 0 110px;
          background: #f5f3ee;
        }

        .auth-container {
          width: min(1250px, calc(100% - 64px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          gap: 100px;
          align-items: center;
        }

        .auth-brand > span {
          display: block;
          margin-bottom: 30px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 4px;
        }

        .auth-brand h1 {
          margin: 0;
          font-size: clamp(65px, 8vw, 125px);
          line-height: 0.8;
          letter-spacing: -8px;
          font-weight: 900;
        }

        .auth-brand h1 em {
          font-weight: 300;
        }

        .auth-brand p {
          max-width: 440px;
          margin-top: 45px;
          color: #666666;
          font-size: 15px;
          line-height: 1.9;
        }

        .auth-box {
          background: #ffffff;
          border: 1px solid #dedbd4;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #dedbd4;
        }

        .auth-tabs button {
          height: 65px;
          border: 0;
          background: #f5f3ee;
          color: #777777;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .auth-tabs button:first-child {
          border-right: 1px solid #dedbd4;
        }

        .auth-tabs button.active {
          background: #111111;
          color: #ffffff;
        }

        .auth-content {
          padding: 55px;
        }

        .auth-label {
          display: block;
          margin-bottom: 14px;
          color: #777777;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .auth-content h2 {
          margin: 0 0 40px;
          font-size: 43px;
          line-height: 1;
          letter-spacing: -3px;
        }

        .success-message,
        .error-message {
          margin-bottom: 25px;
          padding: 18px;
        }

        .success-message {
          border: 1px solid #b8c7b4;
          background: #f0f5ee;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .error-message {
          border: 1px solid #d9b9b5;
          background: #faf0ef;
        }

        .success-message p,
        .error-message p {
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .field label {
          font-size: 11px;
          font-weight: 700;
        }

        .field input {
          width: 100%;
          height: 54px;
          padding: 0 16px;
          border: 1px solid #d6d2ca;
          outline: none;
          background: #f8f7f3;
          color: #111111;
        }

        .field input:focus {
          border-color: #111111;
        }

        .password-field {
          position: relative;
        }

        .password-field input {
          padding-right: 55px;
        }

        .password-field button {
          position: absolute;
          top: 0;
          right: 0;
          width: 54px;
          height: 54px;
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .loading-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .loading-button :global(svg) {
          animation: spin 0.8s linear infinite;
        }

        .auth-switch {
          margin-top: 30px;
          color: #777777;
          font-size: 12px;
          text-align: center;
        }

        .auth-switch button {
          margin-left: 7px;
          border: 0;
          background: transparent;
          color: #111111;
          font-weight: 700;
          text-decoration: underline;
          cursor: pointer;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .auth-container {
            grid-template-columns: 1fr;
            gap: 60px;
          }
        }

        @media (max-width: 600px) {
          .auth-page {
            padding: 60px 0 80px;
          }

          .auth-container {
            width: calc(100% - 40px);
          }

          .auth-brand h1 {
            letter-spacing: -5px;
          }

          .auth-content {
            padding: 40px 22px;
          }

          .auth-content h2 {
            font-size: 35px;
          }
        }
      `}</style>
    </>
  );
}