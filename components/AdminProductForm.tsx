"use client";

import { useEffect, useState } from "react";
import {
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Button from "@/components/Button";
import type { Product } from "@/types/product";
import { supabase } from "@/lib/supabase";

type AdminProductFormProps = {
  editingProduct: Product | null;
  onSaveProduct: (product: Product) => Promise<boolean>;
  onCancelEdit: () => void;
};

const categories = [
  "Jean",
  "T-Shirt",
  "Ceket",
  "Ayakkabı",
  "Aksesuar",
];

export default function AdminProductForm({
  editingProduct,
  onSaveProduct,
  onCancelEdit,
}: AdminProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState("");
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!editingProduct) {
      resetForm();
      return;
    }

    setName(editingProduct.name);
    setDescription(editingProduct.description);
    setPrice(String(editingProduct.price));

    setDiscountPrice(
      editingProduct.discountPrice !== null &&
        editingProduct.discountPrice !== undefined
        ? String(editingProduct.discountPrice)
        : ""
    );

    setCategory(editingProduct.category);
    setImage(editingProduct.image);

    const currentImages =
      editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : editingProduct.image
          ? [editingProduct.image]
          : [];

    setImages(currentImages);
    setSizes(editingProduct.sizes.join(", "));
    setStock(String(editingProduct.stock));
    setFeatured(editingProduct.featured);
    setActive(editingProduct.active);
  }, [editingProduct]);

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setCategory(categories[0]);
    setImage("");
    setImages([]);
    setSizes("");
    setStock("");
    setFeatured(false);
    setActive(true);
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const remainingSlots = 6 - images.length;

    if (remainingSlots <= 0) {
      alert("En fazla 6 ürün fotoğrafı yükleyebilirsiniz.");
      event.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      alert("Sadece fotoğraf dosyası seçebilirsiniz.");
      event.target.value = "";
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > 8 * 1024 * 1024
    );

    if (oversizedFile) {
      alert("Her fotoğraf en fazla 8 MB olabilir.");
      event.target.value = "";
      return;
    }

    setUploadingImage(true);

    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `products/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Fotoğraf yüklenemedi:", uploadError);

        alert(
          `Fotoğraf yüklenemedi: ${uploadError.message}`
        );

        setUploadingImage(false);
        event.target.value = "";

        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    const nextImages = [...images, ...uploadedUrls];

    setImages(nextImages);
    setImage(nextImages[0] ?? "");

    setUploadingImage(false);
    event.target.value = "";
  }

  function handleRemoveImage(imageUrl: string) {
    const nextImages = images.filter(
      (item) => item !== imageUrl
    );

    setImages(nextImages);
    setImage(nextImages[0] ?? "");
  }

  function handleMakeMainImage(imageUrl: string) {
    const nextImages = [
      imageUrl,
      ...images.filter((item) => item !== imageUrl),
    ];

    setImages(nextImages);
    setImage(imageUrl);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim() || !price || stock === "") {
      alert("Ürün adı, fiyat ve stok alanlarını doldurun.");
      return;
    }

    if (images.length === 0) {
      alert("En az 1 ürün fotoğrafı seçin.");
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    const parsedDiscountPrice = discountPrice
      ? Number(discountPrice)
      : null;

    if (
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0 ||
      Number.isNaN(parsedStock) ||
      parsedStock < 0
    ) {
      alert("Fiyat ve stok bilgilerini kontrol edin.");
      return;
    }

    if (
      parsedDiscountPrice !== null &&
      (Number.isNaN(parsedDiscountPrice) ||
        parsedDiscountPrice < 0)
    ) {
      alert("İndirimli fiyatı kontrol edin.");
      return;
    }

    const product: Product = {
      id: editingProduct?.id ?? crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      discountPrice: parsedDiscountPrice,
      category,
      image: image.trim(),
      images,
      sizes: sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean),
      stock: parsedStock,
      featured,
      active,
      createdAt:
        editingProduct?.createdAt ?? new Date().toISOString(),
    };

    setSaving(true);

    const saved = await onSaveProduct(product);

    setSaving(false);

    if (!saved) {
      return;
    }

    resetForm();
  }

  function handleCancel() {
    resetForm();
    onCancelEdit();
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <div>
          <span>
            {editingProduct ? "ÜRÜN DÜZENLE" : "YENİ ÜRÜN"}
          </span>

          <h2>
            {editingProduct
              ? "Ürünü Güncelle"
              : "Ürün Ekle"}
          </h2>
        </div>

        <div className="title-actions">
          {editingProduct && (
            <button
              type="button"
              className="cancel-icon"
              onClick={handleCancel}
              aria-label="Düzenlemeyi iptal et"
            >
              <X size={20} strokeWidth={1.7} />
            </button>
          )}

          {editingProduct ? (
            <Pencil size={30} strokeWidth={1.5} />
          ) : (
            <Plus size={30} strokeWidth={1.5} />
          )}
        </div>
      </div>

      {editingProduct && (
        <div className="editing-info">
          <Pencil size={17} strokeWidth={1.6} />

          <div>
            <span>ŞU AN DÜZENLENİYOR</span>
            <strong>{editingProduct.name}</strong>
          </div>
        </div>
      )}

      <div className="form-grid">
        <div className="field field-full">
          <label>Ürün Adı</label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Örn. Siyah Oversize T-Shirt"
          />
        </div>

        <div className="field">
          <label>Kategori</label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Stok</label>

          <input
            type="number"
            min="0"
            value={stock}
            onChange={(event) =>
              setStock(event.target.value)
            }
            placeholder="10"
          />
        </div>

        <div className="field">
          <label>Fiyat</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            placeholder="600"
          />
        </div>

        <div className="field">
          <label>İndirimli Fiyat</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={discountPrice}
            onChange={(event) =>
              setDiscountPrice(event.target.value)
            }
            placeholder="Opsiyonel"
          />
        </div>

        <div className="field field-full">
          <label>Ürün Fotoğrafları</label>

          <label className="image-upload-box">
            <input
              className="image-file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={
                uploadingImage || images.length >= 6
              }
            />

            {uploadingImage ? (
              <LoaderCircle
                className="upload-spinner"
                size={30}
                strokeWidth={1.5}
              />
            ) : (
              <ImagePlus size={30} strokeWidth={1.5} />
            )}

            <strong>
              {uploadingImage
                ? "FOTOĞRAFLAR YÜKLENİYOR"
                : images.length >= 6
                  ? "FOTOĞRAF LİMİTİ DOLDU"
                  : "FOTOĞRAF SEÇ"}
            </strong>

            <span>
              Bilgisayardan dosya veya telefondan galeri seç.
            </span>

            <small>
              JPG, PNG veya WEBP · En fazla 6 fotoğraf ·
              Fotoğraf başına 8 MB
            </small>
          </label>

          {images.length > 0 && (
            <div className="image-preview-grid">
              {images.map((imageUrl, index) => (
                <div
                  className={
                    index === 0
                      ? "image-preview main-image"
                      : "image-preview"
                  }
                  key={imageUrl}
                >
                  <img
                    src={imageUrl}
                    alt={`Ürün görseli ${index + 1}`}
                  />

                  {index === 0 && (
                    <span className="main-image-label">
                      ANA FOTOĞRAF
                    </span>
                  )}

                  <div className="image-actions">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMakeMainImage(imageUrl)
                        }
                      >
                        ANA YAP
                      </button>
                    )}

                    <button
                      type="button"
                      className="delete-image"
                      onClick={() =>
                        handleRemoveImage(imageUrl)
                      }
                      aria-label="Fotoğrafı kaldır"
                    >
                      <Trash2
                        size={15}
                        strokeWidth={1.7}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <small>
            İlk fotoğraf ürünün ana görselidir. Başka bir
            fotoğrafı ANA YAP seçeneğiyle öne alabilirsin.
          </small>
        </div>

        <div className="field field-full">
          <label>Bedenler</label>

          <input
            type="text"
            value={sizes}
            onChange={(event) =>
              setSizes(event.target.value)
            }
            placeholder="S, M, L, XL"
          />

          <small>Bedenleri virgül ile ayır.</small>
        </div>

        <div className="field field-full">
          <label>Açıklama</label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Ürün açıklamasını yaz..."
            rows={5}
          />
        </div>

        <label className="checkbox-field field-full">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) =>
              setFeatured(event.target.checked)
            }
          />

          <span>Bu ürünü ana sayfada öne çıkar</span>
        </label>

        <label className="checkbox-field field-full">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) =>
              setActive(event.target.checked)
            }
          />

          <span>
            Ürün sitede aktif olarak yayınlansın
          </span>
        </label>
      </div>

      <Button
        type="submit"
        fullWidth
        disabled={saving || uploadingImage}
      >
        {saving
          ? "Kaydediliyor..."
          : uploadingImage
            ? "Fotoğraf Yükleniyor..."
            : editingProduct
              ? "Ürünü Güncelle"
              : "Ürünü Kaydet"}
      </Button>

      {editingProduct && (
        <button
          type="button"
          className="cancel-button"
          onClick={handleCancel}
        >
          DÜZENLEMEYİ İPTAL ET
        </button>
      )}

      <style jsx>{`
        .product-form {
          padding: 35px;
          background: #ffffff;
          border: 1px solid #dedbd4;
        }

        .form-title {
          margin-bottom: 35px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .form-title span {
          display: block;
          margin-bottom: 9px;
          color: #777777;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .form-title h2 {
          margin: 0;
          font-size: 34px;
          letter-spacing: -2px;
        }

        .title-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .cancel-icon {
          width: 40px;
          height: 40px;
          border: 1px solid #d6d2ca;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .editing-info {
          margin-bottom: 30px;
          padding: 18px;
          border: 1px solid #111111;
          background: #111111;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .editing-info span {
          display: block;
          margin-bottom: 4px;
          color: #888888;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .editing-info strong {
          font-size: 13px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          margin-bottom: 28px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .field-full {
          grid-column: 1 / -1;
        }

        .field label {
          font-size: 11px;
          font-weight: 700;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          border: 1px solid #d6d2ca;
          outline: none;
          background: #f8f7f3;
          color: #111111;
          transition: border-color 0.2s ease;
        }

        .field input,
        .field select {
          height: 50px;
          padding: 0 15px;
        }

        .field textarea {
          padding: 15px;
          resize: vertical;
          line-height: 1.6;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #111111;
        }

        .field small {
          color: #888888;
          font-size: 11px;
          line-height: 1.6;
        }

        .image-upload-box {
          min-height: 180px;
          padding: 30px;
          border: 1px dashed #bdb8ae;
          background: #f8f7f3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .image-upload-box:hover {
          border-color: #111111;
          background: #f1eee7;
        }

        .image-file-input {
          display: none;
        }

        .image-upload-box strong {
          margin-top: 15px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .image-upload-box span {
          margin-top: 8px;
          color: #66615a;
          font-size: 12px;
        }

        .image-upload-box small {
          margin-top: 8px;
        }

        .upload-spinner {
          animation: upload-spin 0.8s linear infinite;
        }

        @keyframes upload-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 12px;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 0.82;
          overflow: hidden;
          border: 1px solid #d6d2ca;
          background: #ece9e2;
        }

        .image-preview.main-image {
          border: 2px solid #111111;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-image-label {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 7px 9px;
          background: #111111;
          color: #ffffff;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .image-actions {
          position: absolute;
          right: 8px;
          bottom: 8px;
          left: 8px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .image-actions button {
          min-height: 34px;
          padding: 0 10px;
          border: 0;
          background: #ffffff;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .image-actions .delete-image {
          width: 34px;
          padding: 0;
          background: #111111;
          color: #ffffff;
        }

        .checkbox-field {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        }

        .checkbox-field input {
          width: 18px;
          height: 18px;
          accent-color: #111111;
        }

        .cancel-button {
          width: 100%;
          min-height: 48px;
          margin-top: 12px;
          border: 1px solid #c8c4bc;
          background: transparent;
          color: #77736c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          cursor: pointer;
        }

        .cancel-button:hover {
          border-color: #111111;
          color: #111111;
        }

        @media (max-width: 600px) {
          .product-form {
            padding: 25px 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field-full {
            grid-column: auto;
          }

          .image-preview-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }
        }
      `}</style>
    </form>
  );
}