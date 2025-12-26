import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Me",
  description:
    "Get in touch with Restu Anggoro Kasih for data analytics projects, ML/AI solutions, dashboard development, or job opportunities. Connect via email, LinkedIn, or GitHub.",
  keywords: [
    "Contact Restu Anggoro Kasih",
    "Hire Data Analyst",
    "Hire ML Engineer",
    "Data Science Freelancer Indonesia",
    "Dashboard Development Services",
  ],
  openGraph: {
    title: "Contact Restu Anggoro Kasih",
    description:
      "Get in touch for data analytics projects, ML/AI solutions, or dashboard development.",
    url: "https://restuanggorokasih-portofolio.vercel.app/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
