"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useCart } from "@/components/CartContext";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category: string;
  image: string | null;
  images: string[] | null;
  sizes: string[] | null;
  stock: number;
  featured: boolean;
  active: boolean;
  created_at: string;
};

export default function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .maybeSingle();

      if (error) {
        console.error("Ürün yüklenemedi:", error);
        setProduct(null);
        setLoading(false);
        return;
      }

      if (!data) {
        setProduct(null);
        setLoading(false);
        return;
      }

      const row = data as ProductRow;

      const mappedProduct: Product = {
        id: row.id,
        name: row.name,
        description: row.description ?? "",
        price: Number(row.price),
        discountPrice:
          row.discount_price !== null
            ? Number(row.discount_price)
            : null,
        category: row.category,
        image: row.image ?? "",
        images: row.images ?? [],
        sizes: row.sizes ?? [],
        stock: Number(row.stock),
        featured: row.featured,
        active: row.active,
        createdAt: row.created_at,
      };

      setProduct(mappedProduct);
      setSelectedSize("");
      setQuantity(1);
      setSelectedImageIndex(0);
      setLoading(false);
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="loading-page">
          <div className="loader" />

          <span>ÜRÜN YÜKLENİYOR</span>
        </main>

        <Footer />

        <style jsx>{`
          .loading-page {
            min-height: 70vh;
            background: #f5f3ee;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }

          .loader {
            width: 35px;
            height: 35px;
            border: 2px solid #d1cdc4;
            border-top-color: #111111;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }

          .loading-page span {
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 4px;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="not-found">
          <span>404</span>

          <h1>Ürün bulunamadı.</h1>

          <Link href="/urunler">
            <ArrowLeft size={18} />
            Ürünlere Dön
          </Link>
        </main>

        <Footer />

        <style jsx>{`
          .not-found {
            min-height: 70vh;
            padding: 80px 20px;
            background: #f5f3ee;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .not-found > span {
            margin-bottom: 20px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 4px;
          }

          .not-found h1 {
            margin-bottom: 35px;
            font-size: clamp(40px, 7vw, 80px);
            letter-spacing: -4px;
          }

          .not-found a {
            min-height: 50px;
            padding: 0 20px;
            border: 1px solid #111111;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            font-weight: 700;
          }
        `}</style>
      </>
    );
  }

  const currentProduct = product;

  const productImages =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images
      : currentProduct.image
        ? [currentProduct.image]
        : [];

  const selectedImage =
    productImages[selectedImageIndex] ?? currentProduct.image;

  const hasDiscount =
    currentProduct.discountPrice !== null &&
    currentProduct.discountPrice !== undefined &&
    currentProduct.discountPrice < currentProduct.price;

  const currentPrice = hasDiscount
    ? currentProduct.discountPrice!
    : currentProduct.price;

  function handlePreviousImage() {
    if (productImages.length <= 1) {
      return;
    }

    setSelectedImageIndex((current) =>
      current === 0
        ? productImages.length - 1
        : current - 1
    );
  }

  function handleNextImage() {
    if (productImages.length <= 1) {
      return;
    }

    setSelectedImageIndex((current) =>
      current === productImages.length - 1
        ? 0
        : current + 1
    );
  }

  function handleAddToCart() {
    if (
      currentProduct.sizes.length > 0 &&
      !selectedSize
    ) {
      alert("Lütfen beden seçin.");
      return;
    }

    if (currentProduct.stock <= 0) {
      return;
    }

    addToCart(
      currentProduct,
      selectedSize || "Standart",
      quantity
    );

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  return (
    <>
      <Navbar />

      <main className="product-page">
        <div className="product-container">
          <div className="product-gallery">
            <div className="product-visual">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={currentProduct.name}
                />
              ) : (
                <div className="image-empty">
                  <span>GARAJ</span>

                  <strong>JEANS</strong>

                  <p>{currentProduct.category}</p>
                </div>
              )}

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="gallery-arrow gallery-arrow-left"
                    onClick={handlePreviousImage}
                    aria-label="Önceki fotoğraf"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    type="button"
                    className="gallery-arrow gallery-arrow-right"
                    onClick={handleNextImage}
                    aria-label="Sonraki fotoğraf"
                  >
                    <ChevronRight size={22} />
                  </button>

                  <span className="image-counter">
                    {String(selectedImageIndex + 1).padStart(
                      2,
                      "0"
                    )}
                    {" / "}
                    {String(productImages.length).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="thumbnail-list">
                {productImages.map((imageUrl, index) => (
                  <button
                    type="button"
                    key={`${imageUrl}-${index}`}
                    className={
                      selectedImageIndex === index
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedImageIndex(index)
                    }
                    aria-label={`${index + 1}. fotoğrafı göster`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${currentProduct.name} ${
                        index + 1
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-content">
            <Link href="/urunler" className="back-link">
              <ArrowLeft size={17} strokeWidth={1.7} />
              Ürünlere Dön
            </Link>

            <span className="category">
              {currentProduct.category}
            </span>

            <h1>{currentProduct.name}</h1>

            <div className="price">
              {hasDiscount ? (
                <>
                  <span>
                    {formatPrice(currentProduct.price)}
                  </span>

                  <strong>
                    {formatPrice(
                      currentProduct.discountPrice!
                    )}
                  </strong>
                </>
              ) : (
                <strong>
                  {formatPrice(currentProduct.price)}
                </strong>
              )}
            </div>

            <p className="description">
              {currentProduct.description ||
                "Bu ürün için henüz açıklama eklenmedi."}
            </p>

            {currentProduct.sizes.length > 0 && (
              <div className="size-section">
                <div className="section-title">
                  <span>BEDEN SEÇ</span>

                  {selectedSize && (
                    <strong>{selectedSize}</strong>
                  )}
                </div>

                <div className="size-list">
                  {currentProduct.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={
                        selectedSize === size
                          ? "active"
                          : ""
                      }
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="quantity-section">
              <span>ADET</span>

              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  aria-label="Adet azalt"
                >
                  <Minus size={16} />
                </button>

                <strong>{quantity}</strong>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(
                        currentProduct.stock,
                        current + 1
                      )
                    )
                  }
                  disabled={currentProduct.stock <= 0}
                  aria-label="Adet artır"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <Button
              type="button"
              fullWidth
              disabled={currentProduct.stock <= 0}
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check size={18} />
                  Sepete Eklendi
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />

                  {currentProduct.stock > 0
                    ? `Sepete Ekle · ${formatPrice(
                        currentPrice * quantity
                      )}`
                    : "Ürün Tükendi"}
                </>
              )}
            </Button>

            <div className="product-meta">
              <span>STOK</span>

              <p>
                {currentProduct.stock > 0
                  ? `${currentProduct.stock} adet mevcut`
                  : "Ürün tükendi"}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .product-page {
          padding: 70px 0 110px;
          background: #f5f3ee;
        }

        .product-container {
          width: min(1300px, calc(100% - 64px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 80px;
          align-items: start;
        }

        .product-gallery {
          min-width: 0;
        }

        .product-visual {
          position: relative;
          min-height: 720px;
          background: #dedbd4;
          overflow: hidden;
        }

        .product-visual img {
          width: 100%;
          height: 720px;
          display: block;
          object-fit: cover;
        }

        .image-empty {
          min-height: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .image-empty span,
        .image-empty strong {
          font-size: clamp(55px, 7vw, 100px);
          line-height: 0.84;
          letter-spacing: -7px;
        }

        .image-empty span {
          font-weight: 900;
        }

        .image-empty strong {
          font-weight: 300;
        }

        .image-empty p {
          margin-top: 30px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 5px;
          text-transform: uppercase;
        }

        .gallery-arrow {
          position: absolute;
          top: 50%;
          z-index: 3;
          width: 50px;
          height: 50px;
          border: 1px solid
            rgba(255, 255, 255, 0.45);
          border-radius: 50%;
          background: rgba(17, 17, 17, 0.5);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transform: translateY(-50%);
          backdrop-filter: blur(8px);
        }

        .gallery-arrow-left {
          left: 20px;
        }

        .gallery-arrow-right {
          right: 20px;
        }

        .image-counter {
          position: absolute;
          right: 20px;
          bottom: 20px;
          padding: 10px 13px;
          background: rgba(17, 17, 17, 0.72);
          color: #ffffff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .thumbnail-list {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(
            6,
            minmax(0, 1fr)
          );
          gap: 8px;
        }

        .thumbnail-list button {
          padding: 0;
          aspect-ratio: 0.82;
          border: 1px solid transparent;
          background: #dedbd4;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.55;
          transition:
            opacity 0.2s ease,
            border-color 0.2s ease;
        }

        .thumbnail-list button:hover,
        .thumbnail-list button.active {
          opacity: 1;
          border-color: #111111;
        }

        .thumbnail-list img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .product-content {
          position: sticky;
          top: 110px;
          padding-top: 20px;
        }

        .back-link {
          width: fit-content;
          margin-bottom: 70px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #666666;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .category {
          display: block;
          margin-bottom: 20px;
          color: #777777;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        h1 {
          font-size: clamp(50px, 6vw, 88px);
          line-height: 0.9;
          letter-spacing: -6px;
        }

        .price {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .price span {
          color: #999999;
          font-size: 17px;
          text-decoration: line-through;
        }

        .price strong {
          font-size: 27px;
        }

        .description {
          margin: 40px 0;
          padding-bottom: 40px;
          border-bottom: 1px solid #d2cec5;
          color: #5f5f5f;
          font-size: 15px;
          line-height: 1.9;
        }

        .section-title {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title span,
        .quantity-section > span {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .section-title strong {
          font-size: 11px;
        }

        .size-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .size-list button {
          min-width: 52px;
          height: 52px;
          padding: 0 12px;
          border: 1px solid #c5c1b8;
          background: transparent;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .size-list button:hover,
        .size-list button.active {
          border-color: #111111;
          background: #111111;
          color: #ffffff;
        }

        .quantity-section {
          margin: 35px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          border: 1px solid #c5c1b8;
        }

        .quantity-control button {
          width: 45px;
          height: 45px;
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .quantity-control button:disabled {
          cursor: not-allowed;
          opacity: 0.35;
        }

        .quantity-control strong {
          min-width: 45px;
          text-align: center;
          font-size: 13px;
        }

        .product-meta {
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid #d2cec5;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-meta span {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .product-meta p {
          color: #777777;
          font-size: 12px;
        }

        @media (max-width: 850px) {
          .product-container {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .product-content {
            position: relative;
            top: auto;
          }

          .back-link {
            margin-bottom: 45px;
          }
        }

        @media (max-width: 600px) {
          .product-page {
            padding: 25px 0 75px;
          }

          .product-container {
            width: calc(100% - 40px);
          }

          .product-visual,
          .image-empty {
            min-height: 500px;
          }

          .product-visual img {
            height: 500px;
          }

          .thumbnail-list {
            grid-template-columns: repeat(
              4,
              minmax(0, 1fr)
            );
          }

          .gallery-arrow {
            width: 42px;
            height: 42px;
          }

          .gallery-arrow-left {
            left: 12px;
          }

          .gallery-arrow-right {
            right: 12px;
          }

          h1 {
            letter-spacing: -4px;
          }
        }
      `}</style>
    </>
  );
}