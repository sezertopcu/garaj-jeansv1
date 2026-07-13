"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  LayoutDashboard,
  MessageCircle,
  Package,
  Send,
  Settings,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import AdminProductForm from "@/components/AdminProductForm";
import AdminProductTable from "@/components/AdminProductTable";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type AdminTab =
  | "dashboard"
  | "products"
  | "orders"
  | "messages"
  | "settings";

type DatabaseProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  discount_price: number | string | null;
  category: string;
  image: string | null;
  images: string[] | null;
  sizes: string[] | null;
  stock: number;
  featured: boolean;
  active: boolean;
  created_at: string;
};

type Order = {
  id: string;
  user_id: string;
  order_number: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "shipped"
    | "delivered"
    | "cancelled";
  total_amount: number | string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_city: string | null;
  shipping_district: string | null;
  shipping_address: string | null;
  cargo_company: string | null;
  tracking_number: string | null;
  customer_note: string | null;
  admin_note: string | null;
  created_at: string;
};

type Message = {
  id: string;
  user_id: string;
  sender_id: string;
  sender_type: "user" | "admin";
  message: string;
  read_at: string | null;
  created_at: string;
};

type MessageThread = {
  userId: string;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
};

const orderStatusOptions: {
  value: Order["status"];
  label: string;
}[] = [
  {
    value: "pending",
    label: "Sipariş Alındı",
  },
  {
    value: "confirmed",
    label: "Sipariş Onaylandı",
  },
  {
    value: "preparing",
    label: "Hazırlanıyor",
  },
  {
    value: "shipped",
    label: "Kargoya Verildi",
  },
  {
    value: "delivered",
    label: "Teslim Edildi",
  },
  {
    value: "cancelled",
    label: "İptal Edildi",
  },
];

function mapDatabaseProduct(
  product: DatabaseProduct
): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price),
    discountPrice:
      product.discount_price === null
        ? null
        : Number(product.discount_price),
    category: product.category,
    image: product.image ?? "",
    images: product.images ?? [],
    sizes: product.sizes ?? [],
    stock: Number(product.stock),
    featured: product.featured,
    active: product.active,
    createdAt: product.created_at,
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getOrderStatusLabel(status: Order["status"]) {
  return (
    orderStatusOptions.find(
      (item) => item.value === status
    )?.label ?? status
  );
}

export default function AdminPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<AdminTab>("dashboard");

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [selectedThreadUserId, setSelectedThreadUserId] =
    useState<string | null>(null);

  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdminAndLoad() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/giris");
        return;
      }

      const { data: adminData, error: adminError } =
        await supabase.rpc("is_admin");

      if (
        adminError ||
        adminData !== true
      ) {
        router.replace("/");
        return;
      }

      if (!mounted) {
        return;
      }

      setAuthorized(true);

      await Promise.all([
        loadProducts(),
        loadOrders(),
        loadMessages(),
      ]);

      if (mounted) {
        setLoading(false);
      }
    }

    checkAdminAndLoad();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!authorized) {
      return;
    }

    const channel = supabase
      .channel("garaj-admin-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          loadProducts();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          loadOrders();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authorized]);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Ürünler alınamadı:", error);
      return;
    }

    setProducts(
      ((data ?? []) as DatabaseProduct[]).map(
        mapDatabaseProduct
      )
    );
  }

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Siparişler alınamadı:", error);
      return;
    }

    setOrders((data as Order[]) ?? []);
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error("Mesajlar alınamadı:", error);
      return;
    }

    setMessages((data as Message[]) ?? []);
  }

  async function handleSaveProduct(
    product: Product
  ): Promise<boolean> {
    const payload = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount_price:
        product.discountPrice ?? null,
      category: product.category,
      image: product.image,
      images: product.images ?? [],
      sizes: product.sizes,
      stock: product.stock,
      featured: product.featured,
      active: product.active,
    };

    const productExists = products.some(
      (item) => item.id === product.id
    );

    if (productExists) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", product.id);

      if (error) {
        console.error(
          "Ürün güncellenemedi:",
          error
        );

        alert(
          `Ürün güncellenemedi: ${error.message}`
        );

        return false;
      }

      setEditingProduct(null);

      await loadProducts();

      alert("Ürün başarıyla güncellendi.");

      return true;
    }

    const { error } = await supabase
      .from("products")
      .insert(payload);

    if (error) {
      console.error("Ürün eklenemedi:", error);

      alert(
        `Ürün eklenemedi: ${error.message}`
      );

      return false;
    }

    await loadProducts();

    alert("Ürün başarıyla eklendi.");

    return true;
  }

  async function handleDeleteProduct(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Ürün silinemedi:", error);

      alert(
        `Ürün silinemedi: ${error.message}`
      );

      return;
    }

    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }

    await loadProducts();

    alert("Ürün silindi.");
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleUpdateOrder(
    order: Order,
    status: Order["status"],
    cargoCompany: string,
    trackingNumber: string,
    adminNote: string
  ) {
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        cargo_company:
          cargoCompany.trim() || null,
        tracking_number:
          trackingNumber.trim() || null,
        admin_note:
          adminNote.trim() || null,
      })
      .eq("id", order.id);

    if (error) {
      console.error(
        "Sipariş güncellenemedi:",
        error
      );

      alert(
        `Sipariş güncellenemedi: ${error.message}`
      );

      return;
    }

    await loadOrders();

    alert("Sipariş güncellendi.");
  }

  const messageThreads = useMemo(() => {
    const threadMap = new Map<
      string,
      Message[]
    >();

    messages.forEach((message) => {
      const current =
        threadMap.get(message.user_id) ?? [];

      current.push(message);

      threadMap.set(message.user_id, current);
    });

    return Array.from(threadMap.entries())
      .map(([userId, threadMessages]) => {
        const lastMessage =
          threadMessages[
            threadMessages.length - 1
          ];

        const unreadCount = threadMessages.filter(
          (message) =>
            message.sender_type === "user" &&
            !message.read_at
        ).length;

        return {
          userId,
          messages: threadMessages,
          lastMessage,
          unreadCount,
        };
      })
      .sort(
        (a, b) =>
          new Date(
            b.lastMessage.created_at
          ).getTime() -
          new Date(
            a.lastMessage.created_at
          ).getTime()
      );
  }, [messages]);

  const selectedThread =
    messageThreads.find(
      (thread) =>
        thread.userId === selectedThreadUserId
    ) ?? null;

  async function openMessageThread(
    thread: MessageThread
  ) {
    setSelectedThreadUserId(thread.userId);

    const unreadIds = thread.messages
      .filter(
        (message) =>
          message.sender_type === "user" &&
          !message.read_at
      )
      .map((message) => message.id);

    if (unreadIds.length === 0) {
      return;
    }

    const { error } = await supabase
      .from("messages")
      .update({
        read_at: new Date().toISOString(),
      })
      .in("id", unreadIds);

    if (error) {
      console.error(
        "Mesajlar okundu yapılamadı:",
        error
      );

      return;
    }

    await loadMessages();
  }

  async function handleSendReply(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !selectedThread ||
      !replyMessage.trim() ||
      sendingReply
    ) {
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/giris");
      return;
    }

    setSendingReply(true);

    const { error } = await supabase
      .from("messages")
      .insert({
        user_id: selectedThread.userId,
        sender_id: user.id,
        sender_type: "admin",
        message: replyMessage.trim(),
      });

    if (error) {
      console.error(
        "Cevap gönderilemedi:",
        error
      );

      alert(
        `Cevap gönderilemedi: ${error.message}`
      );

      setSendingReply(false);

      return;
    }

    setReplyMessage("");
    setSendingReply(false);

    await loadMessages();
  }

  const totalStock = products.reduce(
    (total, product) =>
      total + product.stock,
    0
  );

  const totalProductValue = products.reduce(
    (total, product) => {
      const hasDiscount =
        product.discountPrice !== null &&
        product.discountPrice !== undefined &&
        product.discountPrice < product.price;

      const price = hasDiscount
        ? product.discountPrice!
        : product.price;

      return total + price * product.stock;
    },
    0
  );

  const unreadMessageCount = messageThreads.reduce(
    (total, thread) =>
      total + thread.unreadCount,
    0
  );

  if (loading) {
    return (
      <main className="admin-loading">
        <span>GARAJ JEANS</span>
        <h1>Yönetim paneli yükleniyor.</h1>

        <style jsx>{`
          .admin-loading {
            min-height: 100vh;
            background: #111111;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .admin-loading span {
            margin-bottom: 15px;
            color: #777777;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 4px;
          }

          .admin-loading h1 {
            margin: 0;
            font-size: clamp(
              35px,
              5vw,
              70px
            );
            letter-spacing: -4px;
          }
        `}</style>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="admin-page">
      <aside className="sidebar">
        <div>
          <Link href="/" className="logo">
            GARAJ<span>JEANS</span>
          </Link>

          <span className="panel-label">
            YÖNETİM PANELİ
          </span>
        </div>

        <nav>
          <button
            type="button"
            className={
              activeTab === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("dashboard")
            }
          >
            <LayoutDashboard size={19} />
            Genel Bakış
          </button>

          <button
            type="button"
            className={
              activeTab === "products"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("products")
            }
          >
            <Package size={19} />
            Ürünler
          </button>

          <button
            type="button"
            className={
              activeTab === "orders"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("orders")
            }
          >
            <ShoppingBag size={19} />
            Siparişler

            {orders.length > 0 && (
              <span className="nav-count">
                {orders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            className={
              activeTab === "messages"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("messages")
            }
          >
            <MessageCircle size={19} />
            Mesajlar

            {unreadMessageCount > 0 && (
              <span className="nav-count">
                {unreadMessageCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={
              activeTab === "settings"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("settings")
            }
          >
            <Settings size={19} />
            Ayarlar
          </button>
        </nav>

        <Link href="/" className="back-site">
          <ArrowLeft size={17} />
          Siteye Dön
        </Link>
      </aside>

      <section className="admin-content">
        {activeTab === "dashboard" && (
          <>
            <div className="page-header">
              <span>GARAJ JEANS</span>

              <h1>Genel Bakış.</h1>

              <p>
                Ürün, sipariş ve mesaj yönetimi.
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <Package
                  size={25}
                  strokeWidth={1.5}
                />

                <span>TOPLAM ÜRÜN</span>

                <strong>{products.length}</strong>
              </div>

              <div className="stat-card">
                <Boxes
                  size={25}
                  strokeWidth={1.5}
                />

                <span>TOPLAM STOK</span>

                <strong>{totalStock}</strong>
              </div>

              <div className="stat-card">
                <ShoppingBag
                  size={25}
                  strokeWidth={1.5}
                />

                <span>SİPARİŞLER</span>

                <strong>{orders.length}</strong>
              </div>

              <div className="stat-card">
                <MessageCircle
                  size={25}
                  strokeWidth={1.5}
                />

                <span>OKUNMAMIŞ MESAJ</span>

                <strong>
                  {unreadMessageCount}
                </strong>
              </div>
            </div>

            <div className="dashboard-bottom">
              <div className="welcome-box">
                <span>2017 · ERZURUM</span>

                <h2>
                  Garaj&apos;dan
                  <br />
                  Yönetime.
                </h2>

                <p>
                  İki yönetici de aynı ürünleri,
                  siparişleri ve müşteri
                  konuşmalarını yönetebilir.
                </p>
              </div>

              <div className="stock-value">
                <LayoutDashboard
                  size={30}
                  strokeWidth={1.4}
                />

                <span>TOPLAM STOK DEĞERİ</span>

                <strong>
                  {formatPrice(totalProductValue)}
                </strong>
              </div>
            </div>
          </>
        )}

        {activeTab === "products" && (
          <>
            <div className="page-header">
              <span>ÜRÜN YÖNETİMİ</span>

              <h1>Ürünler.</h1>

              <p>
                Ürün ekleyin, güncelleyin veya
                silin.
              </p>
            </div>

            <div className="products-layout">
              <AdminProductForm
                editingProduct={editingProduct}
                onSaveProduct={handleSaveProduct}
                onCancelEdit={() =>
                  setEditingProduct(null)
                }
              />

              <AdminProductTable
                products={products}
                onEditProduct={handleEditProduct}
                onDeleteProduct={
                  handleDeleteProduct
                }
              />
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <div className="page-header">
              <span>SİPARİŞ YÖNETİMİ</span>

              <h1>Siparişler.</h1>

              <p>
                Sipariş durumunu ve kargo
                bilgilerini yönetin.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="empty-section">
                <ShoppingBag
                  size={45}
                  strokeWidth={1.3}
                />

                <h2>Henüz sipariş yok.</h2>

                <p>
                  Gerçek siparişler oluşturulduğunda
                  burada görünecek.
                </p>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map((order) => (
                  <AdminOrderCard
                    key={order.id}
                    order={order}
                    onSave={handleUpdateOrder}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "messages" && (
          <>
            <div className="page-header">
              <span>MÜŞTERİ MESAJLARI</span>

              <h1>Mesajlar.</h1>

              <p>
                Kullanıcı konuşmalarını okuyun ve
                cevap verin.
              </p>
            </div>

            {messageThreads.length === 0 ? (
              <div className="empty-section">
                <MessageCircle
                  size={45}
                  strokeWidth={1.3}
                />

                <h2>Henüz mesaj yok.</h2>

                <p>
                  Kullanıcı mesajları burada
                  görünecek.
                </p>
              </div>
            ) : (
              <div className="messages-layout">
                <div className="thread-list">
                  <div className="thread-list-title">
                    <span>KONUŞMALAR</span>

                    <strong>
                      {messageThreads.length}
                    </strong>
                  </div>

                  {messageThreads.map((thread) => (
                    <button
                      type="button"
                      key={thread.userId}
                      className={
                        selectedThreadUserId ===
                        thread.userId
                          ? "thread active"
                          : "thread"
                      }
                      onClick={() =>
                        openMessageThread(thread)
                      }
                    >
                      <div className="thread-avatar">
                        <UserRound
                          size={20}
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="thread-content">
                        <strong>
                          Müşteri #
                          {thread.userId
                            .slice(0, 8)
                            .toUpperCase()}
                        </strong>

                        <p>
                          {thread.lastMessage.message}
                        </p>

                        <span>
                          {formatDate(
                            thread.lastMessage.created_at
                          )}
                        </span>
                      </div>

                      {thread.unreadCount > 0 && (
                        <span className="unread-count">
                          {thread.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="admin-chat">
                  {!selectedThread ? (
                    <div className="select-thread">
                      <MessageCircle
                        size={45}
                        strokeWidth={1.2}
                      />

                      <h2>Konuşma seç.</h2>

                      <p>
                        Sol taraftan bir müşteri
                        konuşmasını aç.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="admin-chat-header">
                        <div className="thread-avatar">
                          <UserRound
                            size={21}
                            strokeWidth={1.5}
                          />
                        </div>

                        <div>
                          <span>MÜŞTERİ</span>

                          <strong>
                            #
                            {selectedThread.userId
                              .slice(0, 8)
                              .toUpperCase()}
                          </strong>
                        </div>
                      </div>

                      <div className="admin-messages">
                        {selectedThread.messages.map(
                          (message) => (
                            <div
                              key={message.id}
                              className={
                                message.sender_type ===
                                "admin"
                                  ? "admin-message-row"
                                  : "user-message-row"
                              }
                            >
                              <div className="admin-message-bubble">
                                <span>
                                  {message.sender_type ===
                                  "admin"
                                    ? "GARAJ JEANS"
                                    : "MÜŞTERİ"}
                                </span>

                                <p>{message.message}</p>

                                <small>
                                  {formatDate(
                                    message.created_at
                                  )}
                                </small>
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <form
                        className="reply-form"
                        onSubmit={handleSendReply}
                      >
                        <textarea
                          value={replyMessage}
                          onChange={(event) =>
                            setReplyMessage(
                              event.target.value
                            )
                          }
                          placeholder="Müşteriye cevap yaz..."
                          maxLength={1000}
                          rows={4}
                        />

                        <div className="reply-bottom">
                          <span>
                            {replyMessage.length}/1000
                          </span>

                          <button
                            type="submit"
                            disabled={
                              !replyMessage.trim() ||
                              sendingReply
                            }
                          >
                            <Send
                              size={17}
                              strokeWidth={1.7}
                            />

                            {sendingReply
                              ? "GÖNDERİLİYOR"
                              : "CEVAP GÖNDER"}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "settings" && (
          <>
            <div className="page-header">
              <span>MAĞAZA AYARLARI</span>

              <h1>Ayarlar.</h1>

              <p>
                Garaj Jeans iletişim ve mağaza
                bilgileri.
              </p>
            </div>

            <div className="settings-box">
              <div className="setting-row">
                <span>MAĞAZA</span>
                <strong>Garaj Jeans</strong>
              </div>

              <div className="setting-row">
                <span>KURULUŞ</span>
                <strong>2017</strong>
              </div>

              <div className="setting-row">
                <span>İBRAHİM KILIÇ</span>
                <strong>
                  0 534 786 98 70
                </strong>
              </div>

              <div className="setting-row">
                <span>MUHAMMED KILIÇ</span>
                <strong>
                  0 507 675 02 09
                </strong>
              </div>

              <div className="setting-row">
                <span>FURKAN KILIÇ</span>
                <strong>
                  0 537 568 98 70
                </strong>
              </div>

              <div className="setting-row">
                <span>ADRES</span>

                <strong>
                  Yakut Plaza Kat 1 No: 31-32,
                  Erzurum
                </strong>
              </div>
            </div>
          </>
        )}
      </section>

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: #f5f3ee;
          display: grid;
          grid-template-columns: 270px 1fr;
        }

        .sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 38px 28px;
          background: #111111;
          color: #ffffff;
          display: flex;
          flex-direction: column;
        }

        .logo {
          display: inline-block;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .logo span {
          font-weight: 300;
        }

        .panel-label {
          display: block;
          margin-top: 12px;
          color: #666666;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        nav {
          margin-top: 70px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        nav button {
          position: relative;
          width: 100%;
          min-height: 52px;
          padding: 0 16px;
          border: 0;
          background: transparent;
          color: #888888;
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        nav button:hover,
        nav button.active {
          background: #ffffff;
          color: #111111;
        }

        .nav-count {
          min-width: 22px;
          height: 22px;
          margin-left: auto;
          padding: 0 6px;
          border-radius: 20px;
          background: #ffffff;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 800;
        }

        nav button.active .nav-count {
          background: #111111;
          color: #ffffff;
        }

        .back-site {
          margin-top: auto;
          min-height: 48px;
          border-top: 1px solid #292929;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          color: #777777;
          font-size: 11px;
          font-weight: 700;
        }

        .admin-content {
          min-width: 0;
          padding: 65px;
        }

        .page-header {
          margin-bottom: 55px;
        }

        .page-header > span {
          display: block;
          margin-bottom: 16px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 4px;
        }

        .page-header h1 {
          margin: 0;
          font-size: clamp(55px, 7vw, 100px);
          line-height: 0.9;
          letter-spacing: -6px;
        }

        .page-header p {
          margin: 20px 0 0;
          color: #777777;
          font-size: 14px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-card {
          min-height: 210px;
          padding: 28px;
          background: #ffffff;
          border: 1px solid #dedbd4;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .stat-card span {
          margin-top: auto;
          margin-bottom: 12px;
          color: #777777;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .stat-card strong {
          font-size: clamp(27px, 3vw, 42px);
          letter-spacing: -2px;
        }

        .dashboard-bottom {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.5fr 0.5fr;
          gap: 16px;
        }

        .welcome-box {
          min-height: 400px;
          padding: 55px;
          background: #1a1a1a;
          color: #ffffff;
        }

        .welcome-box span {
          color: #777777;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 4px;
        }

        .welcome-box h2 {
          margin: 60px 0 0;
          font-size: clamp(55px, 7vw, 100px);
          line-height: 0.85;
          letter-spacing: -6px;
        }

        .welcome-box p {
          max-width: 480px;
          margin: 35px 0 0;
          color: #999999;
          font-size: 14px;
          line-height: 1.8;
        }

        .stock-value {
          min-height: 400px;
          padding: 35px;
          border: 1px solid #dedbd4;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .stock-value span {
          margin-top: auto;
          margin-bottom: 15px;
          color: #777777;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .stock-value strong {
          font-size: clamp(25px, 3vw, 42px);
          letter-spacing: -2px;
          word-break: break-word;
        }

        .products-layout,
        .orders-grid {
          display: flex;
          flex-direction: column;
          gap: 35px;
        }

        .empty-section {
          min-height: 420px;
          padding: 50px;
          border: 1px solid #dedbd4;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-section h2 {
          margin: 25px 0 10px;
          font-size: 35px;
          letter-spacing: -2px;
        }

        .empty-section p {
          max-width: 430px;
          margin: 0;
          color: #777777;
          font-size: 14px;
          line-height: 1.8;
        }

        .messages-layout {
          min-height: 680px;
          border: 1px solid #d3cfc7;
          background: #ffffff;
          display: grid;
          grid-template-columns: 360px minmax(0, 1fr);
        }

        .thread-list {
          border-right: 1px solid #d3cfc7;
          overflow-y: auto;
        }

        .thread-list-title {
          min-height: 75px;
          padding: 0 25px;
          border-bottom: 1px solid #d3cfc7;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .thread-list-title span {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .thread-list-title strong {
          font-size: 20px;
        }

        .thread {
          position: relative;
          width: 100%;
          min-height: 115px;
          padding: 20px;
          border: 0;
          border-bottom: 1px solid #e4e1da;
          background: transparent;
          color: #111111;
          display: flex;
          align-items: flex-start;
          gap: 15px;
          text-align: left;
          cursor: pointer;
        }

        .thread:hover,
        .thread.active {
          background: #ebe8e1;
        }

        .thread-avatar {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thread-content {
          min-width: 0;
          padding-right: 25px;
        }

        .thread-content strong {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
        }

        .thread-content p {
          margin: 0 0 7px;
          color: #6e6a63;
          font-size: 12px;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .thread-content span {
          color: #99958d;
          font-size: 9px;
        }

        .unread-count {
          position: absolute;
          top: 20px;
          right: 17px;
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          border-radius: 20px;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 800;
        }

        .admin-chat {
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .select-thread {
          min-height: 680px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .select-thread h2 {
          margin: 25px 0 10px;
          font-size: 35px;
          letter-spacing: -2px;
        }

        .select-thread p {
          margin: 0;
          color: #777777;
          font-size: 13px;
        }

        .admin-chat-header {
          min-height: 75px;
          padding: 15px 25px;
          border-bottom: 1px solid #d3cfc7;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .admin-chat-header span {
          display: block;
          margin-bottom: 5px;
          color: #88847c;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .admin-chat-header strong {
          font-size: 13px;
        }

        .admin-messages {
          height: 450px;
          padding: 25px;
          overflow-y: auto;
          background: #f8f7f3;
        }

        .user-message-row,
        .admin-message-row {
          margin-bottom: 12px;
          display: flex;
        }

        .user-message-row {
          justify-content: flex-start;
        }

        .admin-message-row {
          justify-content: flex-end;
        }

        .admin-message-bubble {
          max-width: 75%;
          padding: 15px 17px;
          border: 1px solid #d3cfc7;
          background: #ffffff;
        }

        .admin-message-row .admin-message-bubble {
          border-color: #111111;
          background: #111111;
          color: #ffffff;
        }

        .admin-message-bubble > span {
          display: block;
          margin-bottom: 8px;
          color: #8b877f;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .admin-message-bubble p {
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .admin-message-bubble small {
          display: block;
          margin-top: 8px;
          opacity: 0.55;
          font-size: 9px;
          text-align: right;
        }

        .reply-form {
          padding: 20px 25px;
          border-top: 1px solid #d3cfc7;
        }

        .reply-form textarea {
          width: 100%;
          padding: 15px;
          border: 1px solid #d3cfc7;
          outline: none;
          resize: vertical;
          background: #f8f7f3;
          color: #111111;
          font: inherit;
          font-size: 13px;
          line-height: 1.6;
        }

        .reply-form textarea:focus {
          border-color: #111111;
        }

        .reply-bottom {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .reply-bottom > span {
          color: #88847c;
          font-size: 9px;
        }

        .reply-bottom button {
          min-height: 48px;
          padding: 0 20px;
          border: 0;
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

        .reply-bottom button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .settings-box {
          background: #ffffff;
          border: 1px solid #dedbd4;
        }

        .setting-row {
          min-height: 85px;
          padding: 0 30px;
          border-bottom: 1px solid #ece9e2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .setting-row:last-child {
          border-bottom: 0;
        }

        .setting-row span {
          color: #777777;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .setting-row strong {
          font-size: 13px;
          text-align: right;
        }

        @media (max-width: 1150px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-bottom {
            grid-template-columns: 1fr;
          }

          .messages-layout {
            grid-template-columns: 300px minmax(0, 1fr);
          }
        }

        @media (max-width: 850px) {
          .admin-page {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: relative;
            width: 100%;
            height: auto;
          }

          nav {
            margin-top: 35px;
          }

          .back-site {
            margin-top: 35px;
            padding-top: 20px;
          }

          .admin-content {
            padding: 40px 25px;
          }

          .messages-layout {
            grid-template-columns: 1fr;
          }

          .thread-list {
            max-height: 350px;
            border-right: 0;
            border-bottom: 1px solid #d3cfc7;
          }
        }

        @media (max-width: 550px) {
          .admin-content {
            padding: 35px 15px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .welcome-box {
            padding: 35px 25px;
          }

          .page-header h1 {
            letter-spacing: -4px;
          }

          .admin-message-bubble {
            max-width: 88%;
          }

          .setting-row {
            padding: 20px;
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }

          .setting-row strong {
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}

type AdminOrderCardProps = {
  order: Order;
  onSave: (
    order: Order,
    status: Order["status"],
    cargoCompany: string,
    trackingNumber: string,
    adminNote: string
  ) => Promise<void>;
};

function AdminOrderCard({
  order,
  onSave,
}: AdminOrderCardProps) {
  const [status, setStatus] =
    useState<Order["status"]>(order.status);

  const [cargoCompany, setCargoCompany] = useState(
    order.cargo_company ?? ""
  );

  const [trackingNumber, setTrackingNumber] = useState(
    order.tracking_number ?? ""
  );

  const [adminNote, setAdminNote] = useState(
    order.admin_note ?? ""
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(order.status);
    setCargoCompany(order.cargo_company ?? "");
    setTrackingNumber(order.tracking_number ?? "");
    setAdminNote(order.admin_note ?? "");
  }, [order]);

  async function handleSave() {
    setSaving(true);

    await onSave(
      order,
      status,
      cargoCompany,
      trackingNumber,
      adminNote
    );

    setSaving(false);
  }

  return (
    <article className="admin-order-card">
      <div className="order-card-header">
        <div>
          <span>SİPARİŞ NUMARASI</span>

          <h2>{order.order_number}</h2>
        </div>

        <div className="order-status-label">
          {getOrderStatusLabel(order.status)}
        </div>
      </div>

      <div className="order-info-grid">
        <div>
          <span>MÜŞTERİ</span>
          <strong>{order.customer_name}</strong>
        </div>

        <div>
          <span>E-POSTA</span>
          <strong>{order.customer_email}</strong>
        </div>

        <div>
          <span>TELEFON</span>
          <strong>
            {order.customer_phone || "Belirtilmedi"}
          </strong>
        </div>

        <div>
          <span>TOPLAM</span>
          <strong>
            {formatPrice(Number(order.total_amount))}
          </strong>
        </div>

        <div>
          <span>TARİH</span>
          <strong>{formatDate(order.created_at)}</strong>
        </div>

        <div>
          <span>ADRES</span>
          <strong>
            {[
              order.shipping_address,
              order.shipping_district,
              order.shipping_city,
            ]
              .filter(Boolean)
              .join(", ") || "Belirtilmedi"}
          </strong>
        </div>
      </div>

      {order.customer_note && (
        <div className="customer-note">
          <span>MÜŞTERİ NOTU</span>

          <p>{order.customer_note}</p>
        </div>
      )}

      <div className="order-edit-grid">
        <div className="order-field">
          <label>Sipariş Durumu</label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as Order["status"]
              )
            }
          >
            {orderStatusOptions.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="order-field">
          <label>Kargo Şirketi</label>

          <input
            value={cargoCompany}
            onChange={(event) =>
              setCargoCompany(event.target.value)
            }
            placeholder="Örn. Yurtiçi Kargo"
          />
        </div>

        <div className="order-field">
          <label>Takip Numarası</label>

          <input
            value={trackingNumber}
            onChange={(event) =>
              setTrackingNumber(event.target.value)
            }
            placeholder="Kargo takip numarası"
          />
        </div>

        <div className="order-field">
          <label>Yönetici Notu</label>

          <input
            value={adminNote}
            onChange={(event) =>
              setAdminNote(event.target.value)
            }
            placeholder="Yalnızca yönetim için not"
          />
        </div>
      </div>

      <button
        type="button"
        className="save-order-button"
        onClick={handleSave}
        disabled={saving}
      >
        <Truck size={17} strokeWidth={1.7} />

        {saving
          ? "KAYDEDİLİYOR"
          : "SİPARİŞİ GÜNCELLE"}
      </button>

      <style jsx>{`
        .admin-order-card {
          padding: 35px;
          border: 1px solid #dedbd4;
          background: #ffffff;
        }

        .order-card-header {
          padding-bottom: 25px;
          border-bottom: 1px solid #dedbd4;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 30px;
        }

        .order-card-header span,
        .order-info-grid span,
        .customer-note span {
          display: block;
          margin-bottom: 7px;
          color: #777777;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .order-card-header h2 {
          margin: 0;
          font-size: 27px;
          letter-spacing: -1px;
        }

        .order-status-label {
          min-height: 36px;
          padding: 0 13px;
          border: 1px solid #111111;
          display: flex;
          align-items: center;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .order-info-grid {
          padding: 28px 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .order-info-grid strong {
          font-size: 13px;
          line-height: 1.6;
          word-break: break-word;
        }

        .customer-note {
          margin-bottom: 25px;
          padding: 20px;
          background: #f5f3ee;
        }

        .customer-note p {
          margin: 0;
          color: #55514c;
          font-size: 13px;
          line-height: 1.7;
        }

        .order-edit-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .order-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .order-field label {
          font-size: 10px;
          font-weight: 700;
        }

        .order-field input,
        .order-field select {
          width: 100%;
          height: 50px;
          padding: 0 15px;
          border: 1px solid #d6d2ca;
          outline: none;
          background: #f8f7f3;
          color: #111111;
        }

        .order-field input:focus,
        .order-field select:focus {
          border-color: #111111;
        }

        .save-order-button {
          min-height: 50px;
          margin-top: 25px;
          padding: 0 22px;
          border: 0;
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

        .save-order-button:disabled {
          cursor: wait;
          opacity: 0.55;
        }

        @media (max-width: 700px) {
          .admin-order-card {
            padding: 25px 20px;
          }

          .order-card-header {
            flex-direction: column;
          }

          .order-info-grid,
          .order-edit-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </article>
  );
}