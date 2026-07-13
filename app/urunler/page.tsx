"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/product";

const categories = [
  { name: "Tümü", slug: "tumu", number: "00" },
  { name: "Jean", slug: "jean", number: "01" },
  { name: "T-Shirt", slug: "tshirt", number: "02" },
  { name: "Ceket", slug: "ceket", number: "03" },
  { name: "Ayakkabı", slug: "ayakkabi", number: "04" },
  { name: "Aksesuar", slug: "aksesuar", number: "05" },
];

type SupabaseProduct = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  discount_price: number | string | null;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
  active: boolean;
  created_at: string;
};

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const categoryFromUrl =
    searchParams.get("kategori") || "tumu";

  const validCategory = categories.some(
    (category) => category.slug === categoryFromUrl
  )
    ? categoryFromUrl
    : "tumu";

  const [selectedCategory, setSelectedCategory] =
    useState(validCategory);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Ürünler yüklenemedi:", error);
        setProducts([]);
        setLoadError(
          "Ürünler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin."
        );
        setLoading(false);
        return;
      }

      const formattedProducts: Product[] = (
        (data ?? []) as SupabaseProduct[]
      ).map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        discountPrice:
          product.discount_price === null
            ? null
            : Number(product.discount_price),
        category: product.category,
        image: product.image ?? "",
        images: product.images ?? [],
        sizes: product.sizes ?? [],
        stock: product.stock ?? 0,
        featured: product.featured ?? false,
        active: product.active ?? true,
        createdAt: product.created_at,
      }));

      setProducts(formattedProducts);
      setLoading(false);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(validCategory);
  }, [validCategory]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "tumu") {
      return products;
    }

    const category = categories.find(
      (item) => item.slug === selectedCategory
    );

    return products.filter(
      (product) => product.category === category?.name
    );
  }, [products, selectedCategory]);

  const activeCategory =
    categories.find(
      (category) => category.slug === selectedCategory
    ) ?? categories[0];

  return (
    <>
      <Navbar />

      <main className="products-page">
        <section className="products-hero">
          <div className="products-hero-container">
            <div className="hero-top">
              <span className="hero-eyebrow">
                GARAJ JEANS · ERKEK GİYİM
              </span>

              <div className="hero-year">
                <span>ERZURUM</span>
                <strong>2017</strong>
              </div>
            </div>

            <div className="hero-content">
              <h1>
                TÜM
                <br />
                ÜRÜNLER.
              </h1>

              <div className="hero-description">
                <span>✦ KOLEKSİYON</span>

                <p>
                  Şehir stilini tamamlayan modern erkek giyim
                  ürünlerini keşfet. Güçlü parçalar, özgün
                  kombinler ve Garaj Jeans ruhu.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="products-section">
          <div className="products-container">
            <div className="filter-header">
              <div>
                <span className="filter-label">
                  KATEGORİLER
                </span>

                <h2>Koleksiyonu Keşfet.</h2>
              </div>

              <div className="active-category">
                <span>{activeCategory.number}</span>
                <strong>{activeCategory.name}</strong>
              </div>
            </div>

            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  className={
                    selectedCategory === category.slug
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedCategory(category.slug)
                  }
                >
                  <span>{category.number}</span>
                  <strong>{category.name}</strong>
                </button>
              ))}
            </div>

            <div className="products-info">
              <span>
                {loading
                  ? "ÜRÜNLER YÜKLENİYOR"
                  : `${String(filteredProducts.length).padStart(
                      2,
                      "0"
                    )} ÜRÜN GÖSTERİLİYOR`}
              </span>

              <span className="products-info-category">
                {activeCategory.name}
              </span>
            </div>

            {loading ? (
              <div className="products-loading">
                <span>GARAJ JEANS</span>
                <strong>Koleksiyon yükleniyor.</strong>
              </div>
            ) : loadError ? (
              <div className="products-error">
                <span>BAĞLANTI HATASI</span>
                <strong>Ürünlere ulaşılamadı.</strong>
                <p>{loadError}</p>
              </div>
            ) : (
              <div
                key={selectedCategory}
                className="products-grid-animation"
              >
                <ProductGrid products={filteredProducts} />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .products-page {
          width: 100%;
          overflow: hidden;
          background: #f5f3ee;
        }

        .products-hero {
          padding: 82px 0 88px;
          border-bottom: 1px solid #d8d4cc;
        }

        .products-hero-container {
          width: min(1280px, calc(100% - 70px));
          margin: 0 auto;
        }

        .hero-top {
          margin-bottom: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .hero-eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .hero-year {
          display: flex;
          align-items: baseline;
          gap: 17px;
        }

        .hero-year span {
          color: #85817a;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .hero-year strong {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .hero-content {
          display: grid;
          grid-template-columns:
            minmax(0, 1.35fr)
            minmax(300px, 0.65fr);
          gap: 80px;
          align-items: end;
        }

        .products-hero h1 {
          margin: 0;
          font-size: clamp(90px, 8vw, 138px);
          line-height: 0.76;
          letter-spacing: -9px;
          font-weight: 900;
        }

        .hero-description {
          padding-bottom: 5px;
        }

        .hero-description > span {
          display: block;
          margin-bottom: 25px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .hero-description p {
          max-width: 420px;
          margin: 0;
          color: #57544f;
          font-size: 17px;
          line-height: 1.8;
        }

        .products-section {
          padding: 80px 0 120px;
        }

        .products-container {
          width: min(1280px, calc(100% - 70px));
          margin: 0 auto;
        }

        .filter-header {
          margin-bottom: 40px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
        }

        .filter-label {
          display: block;
          margin-bottom: 13px;
          color: #7b7770;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .filter-header h2 {
          margin: 0;
          font-size: clamp(34px, 3vw, 52px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -3px;
        }

        .active-category {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }

        .active-category span {
          color: #9a968e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .active-category strong {
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .category-filter {
          display: grid;
          grid-template-columns: repeat(
            6,
            minmax(0, 1fr)
          );
          border-top: 1px solid #c9c5bc;
          border-left: 1px solid #c9c5bc;
        }

        .category-filter button {
          position: relative;
          min-width: 0;
          min-height: 105px;
          padding: 22px;
          border: 0;
          border-right: 1px solid #c9c5bc;
          border-bottom: 1px solid #c9c5bc;
          background: transparent;
          color: #111111;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          cursor: pointer;
          overflow: hidden;
          transition:
            background 0.3s ease,
            color 0.3s ease,
            transform 0.3s ease;
        }

        .category-filter button::after {
          content: "";
          position: absolute;
          right: -30px;
          bottom: -30px;
          width: 75px;
          height: 75px;
          border: 1px solid
            rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.6);
          transition:
            opacity 0.3s ease,
            transform 0.4s ease;
        }

        .category-filter button > span {
          color: #969189;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          transition: color 0.3s ease;
        }

        .category-filter button > strong {
          position: relative;
          z-index: 1;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .category-filter button:hover {
          background: #e9e6df;
          transform: translateY(-3px);
        }

        .category-filter button.active {
          z-index: 2;
          background: #111111;
          color: #ffffff;
          transform: translateY(-5px);
        }

        .category-filter button.active > span {
          color: #777777;
        }

        .category-filter button.active::after {
          opacity: 1;
          transform: scale(1);
        }

        .products-info {
          margin: 55px 0 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid #d0ccc4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .products-info span {
          color: #77736c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }

        .products-info-category {
          color: #111111 !important;
        }

        .products-grid-animation {
          animation: productsEnter 0.5s
            cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .products-loading,
        .products-error {
          min-height: 350px;
          padding: 60px 20px;
          border: 1px solid #dedbd4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .products-loading span,
        .products-error span {
          margin-bottom: 18px;
          color: #77736c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .products-loading strong,
        .products-error strong {
          font-size: clamp(28px, 4vw, 48px);
          letter-spacing: -2px;
        }

        .products-error p {
          max-width: 500px;
          margin: 15px 0 0;
          color: #77736c;
          font-size: 14px;
          line-height: 1.7;
        }

        @keyframes productsEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1000px) {
          .products-hero-container,
          .products-container {
            width: min(760px, calc(100% - 50px));
          }

          .hero-content {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .products-hero h1 {
            font-size: clamp(85px, 15vw, 125px);
          }

          .category-filter {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }
        }

        @media (max-width: 650px) {
          .products-hero {
            padding: 60px 0 65px;
          }

          .products-hero-container,
          .products-container {
            width: calc(100% - 30px);
          }

          .hero-top {
            margin-bottom: 40px;
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .hero-content {
            gap: 38px;
          }

          .products-hero h1 {
            font-size: clamp(65px, 22vw, 95px);
            letter-spacing: -6px;
          }

          .hero-description p {
            font-size: 15px;
          }

          .products-section {
            padding: 60px 0 80px;
          }

          .filter-header {
            margin-bottom: 30px;
            align-items: flex-start;
            flex-direction: column;
            gap: 20px;
          }

          .filter-header h2 {
            font-size: 38px;
          }

          .category-filter {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .category-filter button {
            min-height: 90px;
            padding: 18px;
          }

          .products-info {
            margin-top: 40px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .category-filter button,
          .category-filter button::after,
          .products-grid-animation {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}