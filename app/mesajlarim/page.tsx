"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCheck,
  MessageCircle,
  Send,
  Store,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  user_id: string;
  sender_id: string;
  sender_type: "user" | "admin";
  message: string;
  created_at: string;
  read_at: string | null;
};

function formatMessageTime(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatMessageDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function MessagesPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadMessages() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.replace("/giris");
        return;
      }

      if (!mounted) {
        return;
      }

      setUser(currentUser);

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          user_id,
          sender_id,
          sender_type,
          message,
          created_at,
          read_at
        `
        )
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: true });

      if (!mounted) {
        return;
      }

      if (error) {
        console.error("Mesajlar alınamadı:", error);
        setMessages([]);
      } else {
        setMessages((data as Message[]) ?? []);
      }

      setLoading(false);
    }

    loadMessages();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const channel = supabase
      .channel(`messages-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;

          setMessages((currentMessages) => {
            const messageExists = currentMessages.some(
              (item) => item.id === newMessage.id
            );

            if (messageExists) {
              return currentMessages;
            }

            return [...currentMessages, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !message.trim() || sending) {
      return;
    }

    const cleanMessage = message.trim();

    setSending(true);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        user_id: user.id,
        sender_id: user.id,
        sender_type: "user",
        message: cleanMessage,
      })
      .select(
        `
        id,
        user_id,
        sender_id,
        sender_type,
        message,
        created_at,
        read_at
      `
      )
      .single();

    if (error) {
      console.error("Mesaj gönderilemedi:", error);
      setSending(false);
      return;
    }

    setMessages((currentMessages) => {
      const messageExists = currentMessages.some(
        (item) => item.id === data.id
      );

      if (messageExists) {
        return currentMessages;
      }

      return [...currentMessages, data as Message];
    });

    setMessage("");
    setSending(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="loading-page">
          <span>GARAJ JEANS</span>
          <h1>Mesajlar yükleniyor.</h1>
        </main>

        <style jsx>{`
          .loading-page {
            min-height: 75vh;
            background: #f5f3ee;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .loading-page span {
            margin-bottom: 15px;
            color: #77736c;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 4px;
          }

          .loading-page h1 {
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

  return (
    <>
      <Navbar />

      <main className="messages-page">
        <section className="messages-hero">
          <div className="container">
            <div className="hero-top">
              <span>GARAJ JEANS · HESABIM</span>
              <strong>02</strong>
            </div>

            <div className="hero-content">
              <h1>
                MESAJ
                <br />
                <em>LARIM.</em>
              </h1>

              <p>
                Garaj Jeans mağazasıyla iletişime geç. Ürünler,
                siparişler ve diğer soruların için bize yaz.
              </p>
            </div>
          </div>
        </section>

        <section className="messages-content">
          <div className="container">
            <button
              type="button"
              className="back-button"
              onClick={() => router.push("/profil")}
            >
              <ArrowLeft size={17} strokeWidth={1.6} />
              PROFİLE DÖN
            </button>

            <div className="chat-layout">
              <aside className="chat-sidebar">
                <div className="store-card">
                  <div className="store-icon">
                    <Store size={28} strokeWidth={1.5} />
                  </div>

                  <span>MAĞAZA</span>

                  <h2>Garaj Jeans</h2>

                  <p>
                    Ürün, sipariş ve mağaza hakkındaki sorularınız
                    için bize mesaj gönderebilirsiniz.
                  </p>

                  <div className="online-status">
                    <span />
                    MAĞAZA İLETİŞİMİ
                  </div>
                </div>
              </aside>

              <div className="chat-panel">
                <div className="chat-header">
                  <div className="chat-header-icon">
                    <Store size={22} strokeWidth={1.5} />
                  </div>

                  <div>
                    <span>GARAJ JEANS</span>
                    <h2>Mağaza Mesajları</h2>
                  </div>
                </div>

                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div className="empty-messages">
                      <MessageCircle
                        size={45}
                        strokeWidth={1.2}
                      />

                      <span>YENİ KONUŞMA</span>

                      <h3>Bize yaz.</h3>

                      <p>
                        Garaj Jeans ile henüz bir mesajlaşmanız
                        bulunmuyor. İlk mesajınızı aşağıdan
                        gönderebilirsiniz.
                      </p>
                    </div>
                  ) : (
                    messages.map((item, index) => {
                      const previousMessage =
                        index > 0 ? messages[index - 1] : null;

                      const showDate =
                        !previousMessage ||
                        formatMessageDate(
                          previousMessage.created_at
                        ) !==
                          formatMessageDate(item.created_at);

                      const isUserMessage =
                        item.sender_type === "user";

                      return (
                        <div key={item.id}>
                          {showDate && (
                            <div className="message-date">
                              <span>
                                {formatMessageDate(
                                  item.created_at
                                )}
                              </span>
                            </div>
                          )}

                          <div
                            className={`message-row ${
                              isUserMessage
                                ? "user-message"
                                : "admin-message"
                            }`}
                          >
                            <div className="message-bubble">
                              {!isUserMessage && (
                                <span className="message-sender">
                                  GARAJ JEANS
                                </span>
                              )}

                              <p>{item.message}</p>

                              <div className="message-meta">
                                <span>
                                  {formatMessageTime(
                                    item.created_at
                                  )}
                                </span>

                                {isUserMessage && (
                                  <CheckCheck
                                    size={14}
                                    strokeWidth={1.6}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <form
                  className="message-form"
                  onSubmit={handleSendMessage}
                >
                  <textarea
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    placeholder="Mesajınızı yazın..."
                    maxLength={1000}
                    rows={1}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />

                  <div className="form-bottom">
                    <span>{message.length}/1000</span>

                    <button
                      type="submit"
                      disabled={
                        !message.trim() || sending
                      }
                    >
                      <Send size={17} strokeWidth={1.7} />

                      {sending
                        ? "GÖNDERİLİYOR"
                        : "GÖNDER"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .messages-page {
          width: 100%;
          overflow: hidden;
          background: #f5f3ee;
          color: #111111;
        }

        .container {
          width: min(1280px, calc(100% - 70px));
          margin: 0 auto;
        }

        .messages-hero {
          padding: 70px 0 85px;
          border-bottom: 1px solid #d8d4cc;
        }

        .hero-top {
          margin-bottom: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-top span {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .hero-top strong {
          color: #918d85;
          font-size: 12px;
          letter-spacing: 3px;
        }

        .hero-content {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 70px;
        }

        .hero-content h1 {
          margin: 0;
          font-size: clamp(70px, 8vw, 125px);
          line-height: 0.78;
          letter-spacing: -8px;
          font-weight: 900;
        }

        .hero-content h1 em {
          font-weight: 300;
        }

        .hero-content p {
          max-width: 430px;
          margin: 0 0 5px;
          color: #68645e;
          font-size: 15px;
          line-height: 1.8;
        }

        .messages-content {
          padding: 55px 0 120px;
        }

        .back-button {
          min-height: 42px;
          margin-bottom: 30px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #111111;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          cursor: pointer;
        }

        .chat-layout {
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          border: 1px solid #cbc7bf;
        }

        .chat-sidebar {
          border-right: 1px solid #cbc7bf;
          background: #ebe8e1;
        }

        .store-card {
          min-height: 650px;
          padding: 35px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .store-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 65px;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .store-card > span {
          margin-bottom: 10px;
          color: #817d75;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .store-card h2 {
          margin: 0 0 18px;
          font-size: 30px;
          letter-spacing: -2px;
        }

        .store-card p {
          margin: 0;
          color: #6c6861;
          font-size: 13px;
          line-height: 1.8;
        }

        .online-status {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .online-status span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #111111;
        }

        .chat-panel {
          min-width: 0;
          background: #f5f3ee;
        }

        .chat-header {
          min-height: 90px;
          padding: 20px 30px;
          border-bottom: 1px solid #cbc7bf;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .chat-header-icon {
          width: 48px;
          height: 48px;
          border: 1px solid #c7c3bb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-header span {
          display: block;
          margin-bottom: 5px;
          color: #817d75;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .chat-header h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -1px;
        }

        .messages-list {
          height: 480px;
          padding: 30px;
          overflow-y: auto;
        }

        .empty-messages {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-messages > :global(svg) {
          margin-bottom: 25px;
        }

        .empty-messages > span {
          margin-bottom: 15px;
          color: #817d75;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .empty-messages h3 {
          margin: 0 0 12px;
          font-size: 38px;
          letter-spacing: -3px;
        }

        .empty-messages p {
          max-width: 380px;
          margin: 0;
          color: #6d6962;
          font-size: 13px;
          line-height: 1.8;
        }

        .message-date {
          margin: 20px 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .message-date span {
          color: #8b877f;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .message-row {
          margin-bottom: 12px;
          display: flex;
        }

        .user-message {
          justify-content: flex-end;
        }

        .admin-message {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: min(540px, 78%);
          padding: 16px 18px 11px;
          border: 1px solid #d0ccc4;
        }

        .user-message .message-bubble {
          background: #111111;
          color: #ffffff;
          border-color: #111111;
        }

        .admin-message .message-bubble {
          background: #ebe8e1;
        }

        .message-sender {
          display: block;
          margin-bottom: 8px;
          color: #817d75;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .message-bubble p {
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .message-meta {
          margin-top: 7px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          opacity: 0.6;
        }

        .message-meta span {
          font-size: 9px;
        }

        .message-form {
          padding: 22px 25px;
          border-top: 1px solid #cbc7bf;
          background: #ebe8e1;
        }

        .message-form textarea {
          width: 100%;
          min-height: 75px;
          max-height: 160px;
          padding: 17px;
          border: 1px solid #c8c4bc;
          outline: none;
          resize: vertical;
          background: #f5f3ee;
          color: #111111;
          font: inherit;
          font-size: 13px;
          line-height: 1.6;
        }

        .message-form textarea:focus {
          border-color: #111111;
        }

        .form-bottom {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .form-bottom > span {
          color: #8b877f;
          font-size: 9px;
          font-weight: 700;
        }

        .form-bottom button {
          min-width: 145px;
          min-height: 48px;
          padding: 0 20px;
          border: 1px solid #111111;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          cursor: pointer;
        }

        .form-bottom button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        @media (max-width: 900px) {
          .container {
            width: min(760px, calc(100% - 50px));
          }

          .chat-layout {
            grid-template-columns: 1fr;
          }

          .chat-sidebar {
            border-right: 0;
            border-bottom: 1px solid #cbc7bf;
          }

          .store-card {
            min-height: auto;
          }

          .store-icon {
            margin-bottom: 35px;
          }

          .online-status {
            margin-top: 35px;
          }
        }

        @media (max-width: 650px) {
          .container {
            width: calc(100% - 30px);
          }

          .messages-hero {
            padding: 55px 0 65px;
          }

          .hero-content {
            align-items: flex-start;
            flex-direction: column;
            gap: 40px;
          }

          .hero-content h1 {
            font-size: clamp(62px, 20vw, 90px);
            letter-spacing: -6px;
          }

          .hero-content p {
            font-size: 14px;
          }

          .messages-content {
            padding: 40px 0 80px;
          }

          .store-card {
            padding: 25px;
          }

          .chat-header {
            padding: 17px 20px;
          }

          .messages-list {
            height: 440px;
            padding: 20px 15px;
          }

          .message-bubble {
            max-width: 88%;
          }

          .message-form {
            padding: 17px 15px;
          }

          .form-bottom button {
            min-width: 125px;
          }
        }
      `}</style>
    </>
  );
}