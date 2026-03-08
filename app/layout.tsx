import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A & Z Wedding",
  description: "Wedding week schedule for Anna & Zak",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
