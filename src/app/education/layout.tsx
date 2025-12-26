import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education & Certifications",
  description:
    "View the educational background, certifications, and achievements of Restu Anggoro Kasih in Data Science, Machine Learning, and Analytics.",
  keywords: [
    "Restu Anggoro Kasih Education",
    "Data Science Certifications",
    "Machine Learning Certificates",
    "Academic Background",
    "Data Analytics Training",
  ],
  openGraph: {
    title: "Education & Certifications - Restu Anggoro Kasih",
    description:
      "Educational background and certifications in Data Science, Machine Learning, and Analytics.",
    url: "https://restuanggorokasih-portofolio.vercel.app/education",
  },
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
