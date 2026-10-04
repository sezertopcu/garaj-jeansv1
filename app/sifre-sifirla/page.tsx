"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!mounted) return;

        if (data.session) {
          setValidSession(true);
        }
      } catch (error) {
        console.error(
          "Şifre sıfırlama oturumu kontrol hatası:",
          error
        );
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (
        event === "PASSWORD_RECOVERY" ||
        (event === "SIGNED_IN" && session)
      ) {
        setValidSession(true);
        setChecking(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage(
        "Yeni şifreniz en az 6 karakter olmalıdır."
      );
      return;
    }

    if (password !== passwordAgain) {
      setErrorMessage("Girdiğiniz şifreler eşleşmiyor.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw error;
      }

      setMessage(
        "Şifreniz başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsunuz."
      );

      setPassword("");
      setPasswordAgain("");

      await supabase.auth.signOut();

      window.setTimeout(() => {
        router.replace("/giris");
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Yeni şifre belirleme hatası:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Şifreniz değiştirilemedi. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="reset-page">
        <section className="reset-card">
          <div className="reset-icon">
            <KeyRound size={27} strokeWidth={1.6} />
          </div>

          <span className="reset-label">
            GARAJ JEANS · HESAP GÜVENLİĞİ
          </span>

          <h1>Yeni Şifreni Belirle.</h1>

          <p className="description">
            Hesabınız için yeni bir şifre oluşturun.
            Şifreniz en az 6 karakter olmalıdır.
          </p>

          {checking ? (
            <div className="checking">
              <Loader2 size={20} strokeWidth={1.7} />
              Bağlantı kontrol ediliyor...
            </div>
          ) : (
            <>
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

              {!validSession && !message ? (
                <div className="invalid-link">
                  <p>
                    Şifre sıfırlama bağlantısı geçersiz veya
                    süresi dolmuş olabilir.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/giris")
                    }
                  >
                    Yeni bağlantı iste
                  </button>
                </div>
              ) : (
                !message && (
                  <form onSubmit={handleSubmit}>
                    <div className="field">
                      <label>Yeni Şifre</label>

                      <div className="password-field">
                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Yeni şifreniz"
                          value={password}
                          onChange={(event) =>
                            setPassword(event.target.value)
                          }
                          minLength={6}
                          autoComplete="new-password"
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

                    <div className="field">
                      <label>Yeni Şifre Tekrar</label>

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Yeni şifrenizi tekrar girin"
                        value={passwordAgain}
                        onChange={(event) =>
                          setPasswordAgain(
                            event.target.value
                          )
                        }
                        minLength={6}
                        autoComplete="new-password"
                        required
                      />
                    </div>

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
                          Şifre Değiştiriliyor
                        </span>
                      ) : (
                        "Şifremi Değiştir"
                      )}
                    </Button>
                  </form>
                )
              )}

              <button
                type="button"
                className="back-login"
                onClick={() => router.push("/giris")}
              >
                Giriş sayfasına dön
              </button>
            </>
          )}
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .reset-page {
          min-height: calc(100vh - 78px);
          padding: 90px 20px 120px;
          background: #f5f3ee;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .reset-card {
          width: min(100%, 560px);
          padding: 55px;
          background: #ffffff;
          border: 1px solid #dedbd4;
        }

        .reset-icon {
          width: 54px;
          height: 54px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111111;
          color: #ffffff;
        }

        .reset-label {
          display: block;
          margin-bottom: 15px;
          color: #777777;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        h1 {
          margin: 0;
          font-size: 46px;
          line-height: 1;
          letter-spacing: -3px;
        }

        .description {
          margin: 22px 0 35px;
          color: #666666;
          font-size: 13px;
          line-height: 1.8;
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
          box-sizing: border-box;
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

        .success-message,
        .error-message,
        .invalid-link {
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

        .invalid-link {
          border: 1px solid #d9b9b5;
          background: #faf0ef;
        }

        .success-message p,
        .error-message p,
        .invalid-link p {
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
        }

        .invalid-link button {
          margin-top: 14px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #111111;
          font-weight: 700;
          text-decoration: underline;
          cursor: pointer;
        }

        .checking {
          padding: 22px;
          border: 1px solid #dedbd4;
          background: #f8f7f3;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }

        .checking :global(svg),
        .loading-button :global(svg) {
          animation: spin 0.8s linear infinite;
        }

        .loading-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .back-login {
          width: 100%;
          margin-top: 25px;
          padding: 8px;
          border: 0;
          background: transparent;
          color: #666666;
          font-size: 12px;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .reset-page {
            padding: 60px 20px 80px;
          }

          .reset-card {
            padding: 38px 22px;
          }

          h1 {
            font-size: 37px;
          }
        }
      `}</style>
    </>
  );
}