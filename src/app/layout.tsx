import { Metadata } from "next";
// Import Montserrat dari next/font/google
import { Montserrat } from "next/font/google";
import "./globals.css";
import VisitorLogger from "./about/components/VisitorLogger";
import { TransitionProvider } from "@/components/PageTransition";
import SmoothScroll from "@/components/SmoothScroll";

// Konfigurasi Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  // Tambahkan bobot font yang ingin Anda gunakan, termasuk yang tebal untuk judul
  weight: ["400", "700", "800", "900"], // '400' untuk regular, '700' untuk bold, '800' untuk ExtraBold, '900' untuk Black
  display: "swap", // Penting untuk performa loading font
});

const baseUrl = "https://restuanggorokasih-portofolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Restu Anggoro Kasih - Data Scientist & ML Engineer Portfolio",
    template: "%s | Restu Anggoro Kasih",
  },
  description:
    "Portfolio of Restu Anggoro Kasih - Data Analyst & ML Engineer specializing in Machine Learning, LLM, Python, Streamlit, Looker Studio, and Data Analytics. View my projects, dashboards, and experience.",
  keywords: [
    "Restu Anggoro Kasih",
    "Data Scientist",
    "ML Engineer",
    "Machine Learning Engineer",
    "Data Analyst",
    "Python Developer",
    "LLM",
    "Large Language Model",
    "Streamlit",
    "Looker Studio",
    "Redash",
    "Google Apps Script",
    "HR Analytics",
    "Data Visualization",
    "Dashboard Developer",
    "SQL",
    "Supabase",
    "Indonesia Data Scientist",
    "AI Engineer",
  ],
  authors: [{ name: "Restu Anggoro Kasih" }],
  creator: "Restu Anggoro Kasih",
  publisher: "Restu Anggoro Kasih",
  icons: {
    icon: "/assets/icon_google_bar.png",
  },
  verification: {
    google: "T6Fqd0UxL66HiQRVJlFiZ0I4t8ax01Ai3RdsKJBuevs",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Restu Anggoro Kasih Portfolio",
    title: "Restu Anggoro Kasih - Data Scientist & ML Engineer Portfolio",
    description:
      "Data Analyst & ML Engineer specializing in Machine Learning, LLM, Python, Streamlit, and Data Analytics. View my projects and dashboards.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Restu Anggoro Kasih - Data Scientist & ML Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restu Anggoro Kasih - Data Scientist & ML Engineer Portfolio",
    description:
      "Data Analyst & ML Engineer specializing in Machine Learning, LLM, Python, Streamlit, and Data Analytics. View my projects and dashboards.",
    images: ["/assets/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      <body className={`${montserrat.className} bg-black min-h-screen`}>
        <VisitorLogger />
        <SmoothScroll>
          <TransitionProvider>{children}</TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
