import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StyleRing FE",
  description: "Compact chat skeleton for StyleRing frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
