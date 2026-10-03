import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Toaster } from "react-hot-toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pondok Pesantren Al-Fatich Surabaya",
    template: "%s | PP Al-Fatich Surabaya",
  },
  description:
    "Pondok Pesantren Salafi Al-Fatich Tambak Osowilangun Surabaya — Mencetak Generasi Qur'ani, Berakhlaqul Karimah, dan Berwawasan Luas sejak tahun 1988.",
  keywords: [
    "Pondok Pesantren Al-Fatich",
    "Pesantren Surabaya",
    "Pesantren Salafi",
    "Tambak Osowilangun",
    "Madrasah Surabaya",
    "Pesantren Tahfidz",
    "PSMB Pesantren",
  ],
  authors: [{ name: "PP Al-Fatich Surabaya" }],
  creator: "PP Al-Fatich Surabaya",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://alfatich.sch.id",
    siteName: "Pondok Pesantren Al-Fatich",
    title: "Pondok Pesantren Al-Fatich Surabaya",
    description: "Mencetak Generasi Qur'ani, Berakhlaqul Karimah, dan Berwawasan Luas",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/Lambang-Alfatich.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${amiri.variable}`}>
      <body className={plusJakartaSans.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
