"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

type AdminProductTableProps = {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => Promise<void>;
};

export default function AdminProductTable({
  products,
  onEditProduct,
  onDeleteProduct,
}: AdminProductTableProps) {
  return (
    <div className="product-table-container">
      <div className="table-header">
        <div>
          <span>ÜRÜN YÖNETİMİ</span>
          <h2>Tüm Ürünler</h2>
        </div>

        <strong>{products.length} ÜRÜN</strong>
      </div>

      {products.length === 0 ? (
        <div className="empty-table">
          <p>Henüz ürün eklenmedi.</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ÜRÜN</th>
                <th>KATEGORİ</th>
                <th>FİYAT</th>
                <th>STOK</th>
                <th>DURUM</th>
                <th>İŞLEM</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const hasDiscount =
                  product.discountPrice !== null &&
                  product.discountPrice !== undefined &&
                  product.discountPrice < product.price;

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-image">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            <span>GJ</span>
                          )}
                        </div>

                        <div className="product-name">
                          <strong>{product.name}</strong>

                          <div className="product-badges">
                            {product.featured && (
                              <small>Öne Çıkan</small>
                            )}

                            {product.stock <= 0 && (
                              <small className="stock-badge">
                                Tükendi
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>{product.category}</td>

                    <td>
                      <div className="price-cell">
                        {hasDiscount ? (
                          <>
                            <span>
                              {formatPrice(product.price)}
                            </span>

                            <strong>
                              {formatPrice(
                                product.discountPrice as number
                              )}
                            </strong>
                          </>
                        ) : (
                          <strong>
                            {formatPrice(product.price)}
                          </strong>
                        )}
                      </div>
                    </td>

                    <td>
                      <strong>{product.stock}</strong>
                    </td>

                    <td>
                      <span
                        className={`status ${
                          product.active ? "active" : "passive"
                        }`}
                      >
                        {product.active ? "Aktif" : "Pasif"}
                      </span>
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => onEditProduct(product)}
                          aria-label={`${product.name} ürününü düzenle`}
                          title="Ürünü düzenle"
                        >
                          <Pencil
                            size={17}
                            strokeWidth={1.7}
                          />
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={async () => {
                            const approved = window.confirm(
                              `${product.name} ürününü kalıcı olarak silmek istediğine emin misin?`
                            );

                            if (!approved) {
                              return;
                            }

                            await onDeleteProduct(product.id);
                          }}
                          aria-label={`${product.name} ürününü sil`}
                          title="Ürünü sil"
                        >
                          <Trash2
                            size={17}
                            strokeWidth={1.7}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .product-table-container {
          background: #ffffff;
          border: 1px solid #dedbd4;
        }

        .table-header {
          min-height: 120px;
          padding: 30px 35px;
          border-bottom: 1px solid #dedbd4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .table-header span {
          display: block;
          margin-bottom: 9px;
          color: #777777;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .table-header h2 {
          margin: 0;
          font-size: 34px;
          letter-spacing: -2px;
        }

        .table-header > strong {
          font-size: 10px;
          letter-spacing: 2px;
        }

        .table-scroll {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 800px;
          border-collapse: collapse;
        }

        th {
          padding: 17px 20px;
          background: #f8f7f3;
          color: #777777;
          text-align: left;
          font-size: 9px;
          letter-spacing: 2px;
        }

        td {
          padding: 18px 20px;
          border-top: 1px solid #ece9e2;
          font-size: 13px;
        }

        tbody tr {
          transition: background 0.2s ease;
        }

        tbody tr:hover {
          background: #faf9f6;
        }

        .product-cell {
          min-width: 220px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .product-image {
          width: 55px;
          height: 65px;
          flex-shrink: 0;
          background: #dedbd4;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-image span {
          font-size: 12px;
          font-weight: 900;
        }

        .product-name > strong {
          display: block;
          max-width: 220px;
          font-size: 13px;
          line-height: 1.5;
        }

        .product-badges {
          margin-top: 7px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .product-badges small {
          min-height: 22px;
          padding: 0 7px;
          background: #eeeeee;
          color: #666666;
          display: inline-flex;
          align-items: center;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .product-badges .stock-badge {
          background: #f2dfdf;
          color: #8c2424;
        }

        .price-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .price-cell span {
          color: #999999;
          font-size: 11px;
          text-decoration: line-through;
        }

        .price-cell strong {
          font-size: 13px;
        }

        .status {
          display: inline-flex;
          min-height: 28px;
          padding: 0 10px;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .status.active {
          background: #e8eee8;
          color: #315a35;
        }

        .status.passive {
          background: #eeeeee;
          color: #777777;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .actions button {
          width: 38px;
          height: 38px;
          border: 1px solid #d6d2ca;
          background: transparent;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .actions button:hover {
          transform: translateY(-2px);
        }

        .edit-button:hover {
          border-color: #111111;
          background: #111111;
          color: #ffffff;
        }

        .delete-button:hover {
          border-color: #a52424;
          background: #a52424;
          color: #ffffff;
        }

        .empty-table {
          min-height: 220px;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777777;
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .table-header {
            padding: 25px 20px;
          }

          .table-header h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}