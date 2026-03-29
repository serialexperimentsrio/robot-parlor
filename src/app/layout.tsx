import type { Metadata } from "next";
import { Quantico } from "next/font/google";
import "./globals.css";

const quantico = Quantico({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-quantico",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Robot Parlor",
  description:
    "Replacement parts and accessories for your companion and helper robots. Paws, eyes, shells, batteries, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quantico.variable}>
      <body>{children}</body>
    </html>
  );
}
