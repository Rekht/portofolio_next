import { Metadata } from "next";
// Import Montserrat dari next/font/google
import { Montserrat } from "next/font/google";
import "./globals.css";

// Konfigurasi Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  // Tambahkan bobot font yang ingin Anda gunakan, termasuk yang tebal untuk judul
  weight: ["400", "700", "800", "900"], // '400' untuk regular, '700' untuk bold, '800' untuk ExtraBold, '900' untuk Black
  display: "swap", // Penting untuk performa loading font
});

export const metadata: Metadata = {
  title: "Portfolio - Restu Anggoro Kasih",
  description: "Portfolio website dari Restu Anggoro Kasih",
  icons: {
    icon: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Gunakan className dari Montserrat */}
      <body
        className={`${montserrat.className} bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/10 via-transparent to-transparent"></div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
