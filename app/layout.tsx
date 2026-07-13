import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "Garaj Jeans | Erkek Giyim",
  description:
    "2017 yılından beri Erzurum'da kaliteli ve modern erkek giyim. Garaj Jeans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}