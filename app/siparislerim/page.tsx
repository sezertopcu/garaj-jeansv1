"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  selected_size: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Order = {
  id: string;
  order_number: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "shipped"
    | "delivered"
    | "cancelled";
  total_amount: number;
  cargo_company: string | null;
  tracking_number: string | null;
  created_at: string;
  order_items: OrderItem[];
};

const statusMap = {
  pending: {
    label: "Sipariş Alındı",
    description: "Siparişiniz sisteme ulaştı.",
    icon: Clock3,
  },
  confirmed: {
    label: "Sipariş Onaylandı",
    description: "Siparişiniz mağaza tarafından onaylandı.",
    icon: CheckCircle2,
  },
  preparing: {
    label: "Hazırlanıyor",
    description: "Ürünleriniz kargo için hazırlanıyor.",
    icon: Box,
  },
  shipped: {
    label: "Kargoya Verildi",
    description: "Siparişiniz kargo firmasına teslim edildi.",
    icon: Truck,
  },
  delivered: {
    label: "Teslim Edildi",
    description: "Siparişiniz teslim edildi.",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "İptal Edildi",
    description: "Siparişiniz iptal edildi.",
    icon: XCircle,
  },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState<string | null>(
    null
  );

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/giris");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          order_number,
          status,
          total_amount,
          cargo_company,
          tracking_number,
          created_at,
          order_items (
            id,
            product_id,
            product_name,
            product_image,
            selected_size,
            quantity,
            unit_price,
            total_price
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!mounted) {
        return;
      }

      if (error) {
        console.error("Siparişler alınamadı:", error);
        setOrders([]);
      } else {
        setOrders((data as Order[]) ?? []);
      }

      setLoading(false);
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="loading-page">
          <span>GARAJ JEANS</span>
          <h1>Siparişler yükleniyor.</h1>
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

  return (
    <>
      <Navbar />

      <main className="orders-page">
        <section className="orders-hero">
          <div className="container">
            <div className="hero-top">
              <span>GARAJ JEANS · HESABIM</span>
              <strong>01</strong>
            </div>

            <div className="hero-content">
              <h1>
                SİPARİŞ
                <br />
                <em>LERİM.</em>
              </h1>

              <p>
                Siparişlerini görüntüle, hazırlık sürecini takip et
                ve kargo bilgilerine ulaş.
              </p>
            </div>
          </div>
        </section>

        <section className="orders-content">
          <div className="container">
            <div className="section-header">
              <div>
                <span>SİPARİŞ GEÇMİŞİ</span>
                <h2>Siparişlerin.</h2>
              </div>

              <strong>{orders.length.toString().padStart(2, "0")}</strong>
            </div>

            {orders.length === 0 ? (
              <div className="empty-orders">
                <Package size={48} strokeWidth={1.2} />

                <span>HENÜZ SİPARİŞ YOK</span>

                <h3>İlk parçanı keşfet.</h3>

                <p>
                  Henüz Garaj Jeans üzerinden oluşturulmuş bir
                  siparişin bulunmuyor.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/urunler")}
                >
                  ÜRÜNLERİ KEŞFET →
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order, index) => {
                  const status = statusMap[order.status];
                  const StatusIcon = status.icon;
                  const isOpen = openOrderId === order.id;

                  return (
                    <article className="order-card" key={order.id}>
                      <button
                        type="button"
                        className="order-summary"
                        onClick={() =>
                          setOpenOrderId(
                            isOpen ? null : order.id
                          )
                        }
                      >
                        <div className="order-index">
                          {(index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </div>

                        <div className="order-number">
                          <span>SİPARİŞ NUMARASI</span>
                          <strong>{order.order_number}</strong>
                        </div>

                        <div className="order-date">
                          <span>SİPARİŞ TARİHİ</span>
                          <strong>{formatDate(order.created_at)}</strong>
                        </div>

                        <div className="order-status">
                          <StatusIcon size={19} strokeWidth={1.6} />

                          <div>
                            <span>DURUM</span>
                            <strong>{status.label}</strong>
                          </div>
                        </div>

                        <div className="order-total">
                          <span>TOPLAM</span>
                          <strong>
                            {formatPrice(
                              Number(order.total_amount)
                            )}
                          </strong>
                        </div>

                        <div
                          className={`order-arrow ${
                            isOpen ? "open" : ""
                          }`}
                        >
                          <ChevronDown
                            size={20}
                            strokeWidth={1.6}
                          />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="order-detail">
                          <div className="status-panel">
                            <StatusIcon
                              size={30}
                              strokeWidth={1.4}
                            />

                            <div>
                              <span>SİPARİŞ DURUMU</span>
                              <h3>{status.label}</h3>
                              <p>{status.description}</p>
                            </div>
                          </div>

                          {order.status === "shipped" &&
                            (order.cargo_company ||
                              order.tracking_number) && (
                              <div className="cargo-panel">
                                <Truck
                                  size={25}
                                  strokeWidth={1.4}
                                />

                                <div>
                                  <span>KARGO BİLGİLERİ</span>

                                  {order.cargo_company && (
                                    <h3>
                                      {order.cargo_company}
                                    </h3>
                                  )}

                                  {order.tracking_number && (
                                    <p>
                                      Takip No:{" "}
                                      <strong>
                                        {order.tracking_number}
                                      </strong>
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                          <div className="items-header">
                            <span>SİPARİŞ ÜRÜNLERİ</span>

                            <strong>
                              {order.order_items.length} ÜRÜN
                            </strong>
                          </div>

                          <div className="order-items">
                            {order.order_items.map((item) => (
                              <div
                                className="order-item"
                                key={item.id}
                              >
                                <div className="item-image">
                                  {item.product_image ? (
                                    <img
                                      src={item.product_image}
                                      alt={item.product_name}
                                    />
                                  ) : (
                                    <div className="empty-image">
                                      <span>GARAJ</span>
                                      <strong>JEANS</strong>
                                    </div>
                                  )}
                                </div>

                                <div className="item-info">
                                  <span>ÜRÜN</span>
                                  <h3>{item.product_name}</h3>

                                  <div className="item-meta">
                                    {item.selected_size && (
                                      <span>
                                        Beden:{" "}
                                        <strong>
                                          {item.selected_size}
                                        </strong>
                                      </span>
                                    )}

                                    <span>
                                      Adet:{" "}
                                      <strong>
                                        {item.quantity}
                                      </strong>
                                    </span>
                                  </div>
                                </div>

                                <div className="item-price">
                                  <span>TOPLAM</span>
                                  <strong>
                                    {formatPrice(
                                      Number(item.total_price)
                                    )}
                                  </strong>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="detail-total">
                            <span>SİPARİŞ TOPLAMI</span>

                            <strong>
                              {formatPrice(
                                Number(order.total_amount)
                              )}
                            </strong>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .orders-page {
          width: 100%;
          overflow: hidden;
          background: #f5f3ee;
          color: #111111;
        }

        .container {
          width: min(1280px, calc(100% - 70px));
          margin: 0 auto;
        }

        .orders-hero {
          padding: 70px 0 85px;
          border-bottom: 1px solid #d8d4cc;
        }

        .hero-top {
          margin-bottom: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-top span,
        .section-header span,
        .empty-orders > span {
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

        .orders-content {
          padding: 75px 0 120px;
        }

        .section-header {
          margin-bottom: 35px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
        }

        .section-header span {
          display: block;
          margin-bottom: 12px;
          color: #7d7972;
        }

        .section-header h2 {
          margin: 0;
          font-size: clamp(38px, 5vw, 65px);
          line-height: 1;
          letter-spacing: -5px;
        }

        .section-header > strong {
          color: #a29e96;
          font-size: 55px;
          font-weight: 300;
        }

        .empty-orders {
          min-height: 500px;
          padding: 60px 25px;
          border: 1px solid #d3cfc7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-orders > :global(svg) {
          margin-bottom: 30px;
        }

        .empty-orders > span {
          margin-bottom: 20px;
          color: #817d75;
        }

        .empty-orders h3 {
          margin: 0 0 15px;
          font-size: clamp(35px, 5vw, 60px);
          letter-spacing: -4px;
        }

        .empty-orders p {
          max-width: 430px;
          margin: 0;
          color: #6d6962;
          font-size: 14px;
          line-height: 1.8;
        }

        .empty-orders button {
          min-height: 52px;
          margin-top: 35px;
          padding: 0 25px;
          border: 1px solid #111111;
          background: #111111;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          cursor: pointer;
        }

        .orders-list {
          border-top: 1px solid #cbc7bf;
        }

        .order-card {
          border-right: 1px solid #cbc7bf;
          border-bottom: 1px solid #cbc7bf;
          border-left: 1px solid #cbc7bf;
        }

        .order-summary {
          width: 100%;
          min-height: 125px;
          padding: 25px 30px;
          border: 0;
          background: transparent;
          color: #111111;
          display: grid;
          grid-template-columns:
            55px minmax(150px, 1.2fr)
            minmax(170px, 1fr) minmax(180px, 1fr)
            minmax(120px, 0.7fr) 40px;
          align-items: center;
          gap: 25px;
          text-align: left;
          cursor: pointer;
          transition: background 0.25s ease;
        }

        .order-summary:hover {
          background: #ebe8e1;
        }

        .order-index {
          color: #9b978f;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .order-number span,
        .order-date span,
        .order-status span,
        .order-total span,
        .status-panel span,
        .cargo-panel span,
        .items-header span,
        .item-info > span,
        .item-price span,
        .detail-total span {
          display: block;
          margin-bottom: 7px;
          color: #8a867e;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .order-number strong,
        .order-date strong,
        .order-status strong,
        .order-total strong {
          font-size: 13px;
          line-height: 1.5;
        }

        .order-status {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .order-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease;
        }

        .order-arrow.open {
          transform: rotate(180deg);
        }

        .order-detail {
          padding: 35px;
          border-top: 1px solid #cbc7bf;
          background: #ebe8e1;
        }

        .status-panel,
        .cargo-panel {
          min-height: 140px;
          padding: 30px;
          border: 1px solid #d0ccc4;
          display: flex;
          align-items: flex-start;
          gap: 25px;
        }

        .cargo-panel {
          margin-top: 15px;
        }

        .status-panel h3,
        .cargo-panel h3 {
          margin: 0 0 8px;
          font-size: 25px;
          letter-spacing: -1px;
        }

        .status-panel p,
        .cargo-panel p {
          margin: 0;
          color: #69655f;
          font-size: 13px;
          line-height: 1.7;
        }

        .items-header {
          margin-top: 40px;
          padding-bottom: 15px;
          border-bottom: 1px solid #cbc7bf;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .items-header span {
          margin: 0;
        }

        .items-header strong {
          font-size: 9px;
          letter-spacing: 2px;
        }

        .order-item {
          padding: 22px 0;
          border-bottom: 1px solid #d0ccc4;
          display: grid;
          grid-template-columns: 100px 1fr auto;
          align-items: center;
          gap: 25px;
        }

        .item-image {
          width: 100px;
          height: 125px;
          background: #dedbd4;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .empty-image {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .empty-image span,
        .empty-image strong {
          font-size: 16px;
          line-height: 0.9;
        }

        .empty-image span {
          font-weight: 900;
        }

        .empty-image strong {
          font-weight: 300;
        }

        .item-info h3 {
          margin: 0 0 15px;
          font-size: 20px;
          letter-spacing: -1px;
        }

        .item-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .item-meta span {
          color: #77736c;
          font-size: 12px;
        }

        .item-meta strong {
          color: #111111;
        }

        .item-price {
          text-align: right;
        }

        .item-price strong {
          font-size: 17px;
        }

        .detail-total {
          padding-top: 30px;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 30px;
        }

        .detail-total span {
          margin: 0 0 7px;
        }

        .detail-total strong {
          font-size: 35px;
          letter-spacing: -2px;
        }

        @media (max-width: 1000px) {
          .container {
            width: min(760px, calc(100% - 50px));
          }

          .order-summary {
            grid-template-columns: 40px 1fr 1fr;
          }

          .order-status,
          .order-total {
            margin-left: 65px;
          }

          .order-arrow {
            position: absolute;
            right: 45px;
          }
        }

        @media (max-width: 650px) {
          .container {
            width: calc(100% - 30px);
          }

          .orders-hero {
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

          .orders-content {
            padding: 55px 0 80px;
          }

          .section-header > strong {
            font-size: 40px;
          }

          .order-summary {
            position: relative;
            padding: 25px 20px;
            grid-template-columns: 35px 1fr;
            gap: 20px;
          }

          .order-date,
          .order-status,
          .order-total {
            grid-column: 2;
            margin-left: 0;
          }

          .order-arrow {
            top: 25px;
            right: 20px;
          }

          .order-detail {
            padding: 20px;
          }

          .status-panel,
          .cargo-panel {
            padding: 22px;
          }

          .order-item {
            grid-template-columns: 75px 1fr;
            gap: 17px;
          }

          .item-image {
            width: 75px;
            height: 100px;
          }

          .item-price {
            grid-column: 2;
            text-align: left;
          }

          .detail-total {
            align-items: flex-end;
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
}