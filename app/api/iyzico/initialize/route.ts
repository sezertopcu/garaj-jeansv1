import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getIyzico, Iyzipay } from "@/lib/iyzico";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CartItemInput = {
  productId: string;
  size: string;
  quantity: number;
};

type CheckoutBody = {
  accessToken: string;
  fullName: string;
  phone: string;
  identityNumber: string;
  city: string;
  district: string;
  address: string;
  addressTitle?: string;
  items: CartItemInput[];
};

type ProductRow = {
  id: string;
  name: string;
  image?: string | null;
  price: number | string;
  discount_price: number | string | null;
  category: string;
  sizes: string[] | null;
  stock: number;
  active: boolean;
};

type StoredBasketItem = {
  product_id: string;
  product_name: string;
  product_image: string | null;
  selected_size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type IyzicoInitializeResult = {
  status?: string;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
  token?: string;
  paymentPageUrl?: string;
  checkoutFormContent?: string;
  conversationId?: string;
};

function money(value: number): string {
  return value.toFixed(2);
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `+90${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `+90${digits}`;
  }

  return phone.trim();
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return {
      name: parts[0],
      surname: "-",
    };
  }

  return {
    name: parts.slice(0, -1).join(" "),
    surname: parts[parts.length - 1],
  };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "127.0.0.1";
}

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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;

    const {
      accessToken,
      fullName,
      phone,
      identityNumber,
      city,
      district,
      address,
      items,
    } = body;

    if (
      !accessToken ||
      !fullName?.trim() ||
      !phone?.trim() ||
      !identityNumber?.trim() ||
      !city?.trim() ||
      !district?.trim() ||
      !address?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Teslimat ve ödeme bilgileri eksik.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{11}$/.test(identityNumber.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "T.C. Kimlik Numarası 11 haneli olmalıdır.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Sepetiniz boş.",
        },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (
        !item.productId ||
        !item.size ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Sepette geçersiz bir ürün bulunuyor.",
          },
          { status: 400 }
        );
      }
    }

    const supabaseAdmin = createSupabaseAdmin();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.",
        },
        { status: 401 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Hesabınıza ait e-posta adresi bulunamadı.",
        },
        { status: 400 }
      );
    }

    const productIds = [...new Set(items.map((item) => item.productId))];

    const { data: productsData, error: productsError } =
      await supabaseAdmin
        .from("products")
        .select(
          "id, name, image, price, discount_price, category, sizes, stock, active"
        )
        .in("id", productIds)
        .eq("active", true);

    if (productsError) {
      console.error("Ürün sorgulama hatası:", productsError);

      return NextResponse.json(
        {
          success: false,
          message: "Ürün bilgileri kontrol edilemedi.",
        },
        { status: 500 }
      );
    }

    const products = (productsData || []) as ProductRow[];

    if (products.length !== productIds.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Sepetinizde artık satışta olmayan bir ürün bulunuyor.",
        },
        { status: 400 }
      );
    }

    const productMap = new Map(
      products.map((product) => [product.id, product])
    );

    let totalAmount = 0;

    const storedBasket: StoredBasketItem[] = [];

    const basketItems = items.map((item, index) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error("Ürün bulunamadı.");
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `${product.name} için yeterli stok bulunmuyor.`
        );
      }

      if (
        Array.isArray(product.sizes) &&
        product.sizes.length > 0 &&
        !product.sizes.includes(item.size)
      ) {
        throw new Error(
          `${product.name} için seçilen beden artık mevcut değil.`
        );
      }

      const normalPrice = Number(product.price);

      const discountPrice =
        product.discount_price !== null
          ? Number(product.discount_price)
          : null;

      const unitPrice =
        discountPrice !== null &&
        Number.isFinite(discountPrice) &&
        discountPrice > 0 &&
        discountPrice < normalPrice
          ? discountPrice
          : normalPrice;

      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        throw new Error(
          `${product.name} ürününün fiyatı geçersiz.`
        );
      }

      const lineTotal = Number(
        (unitPrice * item.quantity).toFixed(2)
      );

      totalAmount += lineTotal;

      storedBasket.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image || null,
        selected_size: item.size,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: lineTotal,
      });

      return {
        id: `${product.id}-${index + 1}`,
        name:
          item.quantity > 1
            ? `${product.name} x${item.quantity}`
            : product.name,
        category1: product.category || "Giyim",
        category2: `Beden: ${item.size}`,
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: money(lineTotal),
      };
    });

    totalAmount = Number(totalAmount.toFixed(2));

    if (totalAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Sipariş tutarı geçersiz.",
        },
        { status: 400 }
      );
    }

    const { name, surname } = splitName(fullName);

    const conversationId = crypto.randomUUID();

    const basketId =
      `GJ-${Date.now()}-${user.id.slice(0, 8)}`;

    const fullAddress =
      `${address.trim()}, ${district.trim()}/${city.trim()}`;

    const callbackUrl =
      "https://garajjeans.com/api/iyzico/callback";

    const { error: sessionError } = await supabaseAdmin
      .from("payment_sessions")
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        customer_name: fullName.trim(),
        customer_email: user.email,
        customer_phone: normalizePhone(phone),
        shipping_city: city.trim(),
        shipping_district: district.trim(),
        shipping_address: address.trim(),
        total_amount: totalAmount,
        basket: storedBasket,
        status: "created",
      });

    if (sessionError) {
      console.error(
        "Payment session oluşturulamadı:",
        sessionError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Ödeme oturumu oluşturulamadı.",
        },
        { status: 500 }
      );
    }

    const iyzicoRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,

      price: money(totalAmount),
      paidPrice: money(totalAmount),

      currency: Iyzipay.CURRENCY.TRY,

      basketId,

      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,

      callbackUrl,

      buyer: {
        id: user.id,
        name,
        surname,

        gsmNumber: normalizePhone(phone),

        email: user.email,

        identityNumber: identityNumber.trim(),

        registrationAddress: fullAddress,

        ip: getClientIp(request),

        city: city.trim(),

        country: "Turkey",
      },

      shippingAddress: {
        contactName: fullName.trim(),

        city: city.trim(),

        country: "Turkey",

        address: fullAddress,
      },

      billingAddress: {
        contactName: fullName.trim(),

        city: city.trim(),

        country: "Turkey",

        address: fullAddress,
      },

      basketItems,
    };

    const iyzico = getIyzico();

    const result =
      await new Promise<IyzicoInitializeResult>(
        (resolve, reject) => {
          iyzico.checkoutFormInitialize.create(
            iyzicoRequest as Parameters<
              typeof iyzico.checkoutFormInitialize.create
            >[0],

            (
              error: Error | null,
              response: IyzicoInitializeResult
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

    if (
      result.status !== "success" ||
      !result.paymentPageUrl ||
      !result.token
    ) {
      await supabaseAdmin
        .from("payment_sessions")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("conversation_id", conversationId);

      console.error("iyzico initialize başarısız:", {
        status: result.status,
        errorCode: result.errorCode,
        errorMessage: result.errorMessage,
        errorGroup: result.errorGroup,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            result.errorMessage ||
            "Ödeme sayfası başlatılamadı.",
        },
        { status: 400 }
      );
    }

    await supabaseAdmin
      .from("payment_sessions")
      .update({
        iyzico_token: result.token,
        updated_at: new Date().toISOString(),
      })
      .eq("conversation_id", conversationId);

    return NextResponse.json({
      success: true,
      paymentPageUrl: result.paymentPageUrl,
    });
  } catch (error) {
    console.error(
      "iyzico initialize API hatası:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Ödeme başlatılırken beklenmeyen bir hata oluştu.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}