import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Experience & Projects",
  description:
    "Explore the professional experience and data projects of Restu Anggoro Kasih. Data Analyst at PT Rakamin - working on LLM job matching, HR Analytics dashboards, Streamlit apps, Looker Studio, and Redash dashboards.",
  keywords: [
    "Restu Anggoro Kasih Experience",
    "Data Analyst Projects",
    "LLM Job Matching",
    "HR Analytics Dashboard",
    "Streamlit Dashboard",
    "Looker Studio",
    "Redash Dashboard",
    "Google Apps Script Automation",
    "PT Rakamin Kolektif Madani",
  ],
  openGraph: {
    title: "Work Experience & Projects - Restu Anggoro Kasih",
    description:
      "Data Analyst experience: LLM job matching, HR Analytics dashboards, Streamlit, Looker Studio, and Redash projects.",
    url: "https://restuanggorokasih-portofolio.vercel.app/experience",
  },
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
