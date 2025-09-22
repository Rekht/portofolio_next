import { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/10 via-transparent to-transparent"></div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
