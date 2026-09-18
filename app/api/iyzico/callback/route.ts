import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getIyzico, Iyzipay } from "@/lib/iyzico";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoredBasketItem = {
  product_id: string;
  product_name: string;
  product_image: string | null;
  selected_size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type PaymentSession = {
  id: string;
  conversation_id: string;
  iyzico_token: string | null;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_city: string | null;
  shipping_district: string | null;
  shipping_address: string | null;
  total_amount: number | string;
  basket: StoredBasketItem[];
  status: "created" | "paid" | "failed";
  order_id: string | null;
};

type IyzicoRetrieveResult = {
  status?: string;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
  paymentStatus?: string;
  paymentId?: string;
  conversationId?: string;
  token?: string;
  price?: number | string;
  paidPrice?: number | string;
  currency?: string;
  basketId?: string;
};

function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase sunucu bağlantı bilgileri eksik.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function redirectUrl(
  request: NextRequest,
  path: string
): NextResponse {
  return NextResponse.redirect(
    new URL(path, request.url),
    303
  );
}

function createOrderNumber() {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `GJ-${date}-${random}`;
}

async function getToken(request: NextRequest) {
  const contentType =
    request.headers.get("content-type") || "";

  if (
    contentType.includes(
      "application/x-www-form-urlencoded"
    ) ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();

    return String(formData.get("token") || "").trim();
  }

  if (contentType.includes("application/json")) {
    const body = await request.json();

    return String(body?.token || "").trim();
  }

  const text = await request.text();

  if (!text) {
    return "";
  }

  try {
    const params = new URLSearchParams(text);

    return String(params.get("token") || "").trim();
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  try {
    const token = await getToken(request);

    if (!token) {
      console.error("iyzico callback token bulunamadı.");

      return redirectUrl(
        request,
        "/odeme?durum=basarisiz"
      );
    }

    /*
     * Token initialize aşamasında payment_sessions
     * tablosuna kaydedilmişti.
     */
    const {
      data: sessionData,
      error: sessionError,
    } = await supabaseAdmin
      .from("payment_sessions")
      .select("*")
      .eq("iyzico_token", token)
      .maybeSingle();

    if (sessionError || !sessionData) {
      console.error(
        "Payment session bulunamadı:",
        sessionError
      );

      return redirectUrl(
        request,
        "/odeme?durum=basarisiz"
      );
    }

    const session = sessionData as PaymentSession;

    /*
     * Callback ikinci kez gelirse ikinci sipariş
     * oluşturulmasını engelliyoruz.
     */
    if (session.status === "paid" && session.order_id) {
      return redirectUrl(
        request,
        `/siparislerim?odeme=basarili&siparis=${session.order_id}`
      );
    }

    const iyzico = getIyzico();

    const retrieveRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: session.conversation_id,
      token,
    };

    const payment =
      await new Promise<IyzicoRetrieveResult>(
        (resolve, reject) => {
          iyzico.checkoutForm.retrieve(
            retrieveRequest as Parameters<
              typeof iyzico.checkoutForm.retrieve
            >[0],
            (
              error: Error | null,
              response: IyzicoRetrieveResult
            ) => {
              if (error) {
                reject(error);
                return;
              }

              resolve(response);
            }
          );
        }
      );

    /*
     * Sadece API isteğinin başarılı olması yetmez.
     * paymentStatus da SUCCESS olmalı.
     */
    if (
      payment.status !== "success" ||
      payment.paymentStatus !== "SUCCESS"
    ) {
      console.error("iyzico ödeme başarısız:", {
        status: payment.status,
        paymentStatus: payment.paymentStatus,
        errorCode: payment.errorCode,
        errorMessage: payment.errorMessage,
      });

      await supabaseAdmin
        .from("payment_sessions")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      return redirectUrl(
        request,
        "/odeme?durum=basarisiz"
      );
    }

    /*
     * iyzico'nun döndürdüğü conversationId bizim
     * oluşturduğumuz oturumla aynı olmalı.
     */
    if (
      payment.conversationId !==
      session.conversation_id
    ) {
      console.error(
        "iyzico conversationId uyuşmuyor."
      );

      return redirectUrl(
        request,
        "/odeme?durum=basarisiz"
      );
    }

    /*
     * Token da aynı olmalı.
     */
    if (payment.token && payment.token !== token) {
      console.error("iyzico token uyuşmuyor.");

      return redirectUrl(
        request,
        "/odeme?durum=basarisiz"
      );
    }

    /*
     * Ödenen tutarı kendi sunucu tarafında
     * hesapladığımız tutarla karşılaştırıyoruz.
     */
    const expectedAmount =
      Number(session.total_amount);

    const paidAmount =
      Number(payment.paidPrice);

    if (
      !Number.isFinite(expectedAmount) ||
      !Number.isFinite(paidAmount) ||
      Math.abs(expectedAmount - paidAmount) > 0.01
    ) {
      console.error("iyzico ödeme tutarı uyuşmuyor:", {
        expectedAmount,
        paidAmount,
      });

      return redirectUrl(
        request,
        "/odeme?durum=basarisiz"
      );
    }

    /*
     * Callback tekrar geldiyse tekrar kontrol.
     */
    const {
      data: freshSession,
      error: freshSessionError,
    } = await supabaseAdmin
      .from("payment_sessions")
      .select("status, order_id")
      .eq("id", session.id)
      .single();

    if (freshSessionError) {
      throw freshSessionError;
    }

    if (
      freshSession.status === "paid" &&
      freshSession.order_id
    ) {
      return redirectUrl(
        request,
        `/siparislerim?odeme=basarili&siparis=${freshSession.order_id}`
      );
    }

    const orderNumber = createOrderNumber();

    /*
     * Mevcut orders tablomuzdaki kolonlara göre
     * siparişi oluşturuyoruz.
     */
    const {
      data: order,
      error: orderError,
    } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: session.user_id,
        order_number: orderNumber,
        status: "pending",
        total_amount: expectedAmount,

        customer_name: session.customer_name,
        customer_email: session.customer_email,
        customer_phone: session.customer_phone,

        shipping_city: session.shipping_city,
        shipping_district: session.shipping_district,
        shipping_address: session.shipping_address,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error(
        "Sipariş oluşturulamadı:",
        orderError
      );

      throw new Error(
        "Ödeme başarılı fakat sipariş oluşturulamadı."
      );
    }

    const basket = Array.isArray(session.basket)
      ? session.basket
      : [];

    if (basket.length === 0) {
      throw new Error(
        "Ödeme sepet bilgisi bulunamadı."
      );
    }

    const orderItems = basket.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      selected_size: item.selected_size,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { error: itemError } =
      await supabaseAdmin
        .from("order_items")
        .insert(orderItems);

    if (itemError) {
      /*
       * order_items başarısız olursa yarım sipariş
       * bırakmıyoruz.
       */
      await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", order.id);

      console.error(
        "Sipariş ürünleri oluşturulamadı:",
        itemError
      );

      throw new Error(
        "Sipariş ürünleri kaydedilemedi."
      );
    }

    /*
     * Sipariş başarıyla oluşturuldu.
     */
    const { error: paymentSessionUpdateError } =
      await supabaseAdmin
        .from("payment_sessions")
        .update({
          status: "paid",
          order_id: order.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id);

    if (paymentSessionUpdateError) {
      console.error(
        "Payment session güncellenemedi:",
        paymentSessionUpdateError
      );

      throw paymentSessionUpdateError;
    }

    /*
     * Stokları ödeme tamamlandıktan sonra azaltıyoruz.
     */
    for (const item of basket) {
      const {
        data: product,
        error: productError,
      } = await supabaseAdmin
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();

      if (productError || !product) {
        console.error(
          "Stok okunamadı:",
          item.product_id,
          productError
        );

        continue;
      }

      const currentStock = Number(product.stock);

      const newStock = Math.max(
        0,
        currentStock - item.quantity
      );

      const { error: stockError } =
        await supabaseAdmin
          .from("products")
          .update({
            stock: newStock,
          })
          .eq("id", item.product_id);

      if (stockError) {
        console.error(
          "Stok güncellenemedi:",
          item.product_id,
          stockError
        );
      }
    }

    return redirectUrl(
      request,
      `/siparislerim?odeme=basarili&siparis=${order.id}`
    );
  } catch (error) {
    console.error(
      "iyzico callback hatası:",
      error
    );

    return redirectUrl(
      request,
      "/odeme?durum=basarisiz"
    );
  }
}

/*
 * Callback normalde POST gelir.
 * Tarayıcı veya yanlış yönlendirme ile GET gelirse
 * güvenli şekilde ödeme sayfasına gönderiyoruz.
 */
export async function GET(request: NextRequest) {
  return redirectUrl(
    request,
    "/odeme?durum=basarisiz"
  );
}