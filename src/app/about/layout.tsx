import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Learn more about Restu Anggoro Kasih - A Data Analyst & ML Engineer with expertise in Machine Learning, LLM, Python, Streamlit, and data visualization. Discover my journey in data science.",
  keywords: [
    "About Restu Anggoro Kasih",
    "Data Scientist Background",
    "ML Engineer Skills",
    "Data Analyst Indonesia",
    "Python Developer",
  ],
  openGraph: {
    title: "About Restu Anggoro Kasih - Data Scientist & ML Engineer",
    description:
      "Learn more about Restu Anggoro Kasih - A Data Analyst & ML Engineer with expertise in Machine Learning, LLM, and Python.",
    url: "https://restuanggorokasih-portofolio.vercel.app/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
