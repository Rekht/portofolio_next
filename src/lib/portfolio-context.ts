// lib/portfolio-context.ts - Loads all portfolio data for RAG context
import fs from "fs";
import path from "path";

// Import JSON data files
import aboutData from "@/data/about.json";
import projectsData from "@/data/projects.json";
import experienceData from "@/data/experience.json";
import educationData from "@/data/education.json";
import skillsData from "@/data/skills.json";
import achievementsData from "@/data/achievements.json";
import certificationsData from "@/data/certifications.json";
import organizationsData from "@/data/organizations.json";

// Build formatted context string
export function buildPortfolioContext(): string {
  const sections: string[] = [];

  // About section
  const about = aboutData as { description: string };
  sections.push(`## ABOUT RESTU
${about.description}`);

  // Skills section
  const skills = skillsData as {
    skills: Record<string, { title: string; technologies: string[] }>;
  };
  const skillsList = Object.entries(skills.skills)
    .map(([, value]) => `- ${value.title}: ${value.technologies.join(", ")}`)
    .join("\n");
  sections.push(`## SKILLS
${skillsList}`);

  // Education section (direct array)
  const education = educationData as Array<{
    degree: string;
    institution: string;
    period: string;
    gpa?: string;
  }>;
  const eduList = education
    .map(
      (e) =>
        `- ${e.degree} at ${e.institution} (${e.period})${
          e.gpa ? ` - GPA: ${e.gpa}` : ""
        }`
    )
    .join("\n");
  sections.push(`## EDUCATION
${eduList}`);

  // Experience section (direct array)
  const experience = experienceData as Array<{
    company: string;
    position: string;
    duration: string;
    location?: string;
    description?: string[];
    technologies?: string[];
  }>;
  const expList = experience
    .map((e) => {
      const desc = e.description
        ? e.description.map((d) => `  - ${d}`).join("\n")
        : "";
      const techs = e.technologies
        ? `\n  Technologies: ${e.technologies.join(", ")}`
        : "";
      return `### ${e.position} at ${e.company} (${e.duration})
  Location: ${e.location || "Remote"}${techs}
${desc}`;
    })
    .join("\n\n");
  sections.push(`## WORK EXPERIENCE
${expList}`);

  // Projects section (direct array)
  const projects = projectsData as Array<{
    title: string;
    description: string;
    detailedDescription?: string;
    tags?: string[];
    features?: string[];
    url?: string;
  }>;
  const projectList = projects
    .map((p) => {
      const features = p.features
        ? `\n  Features: ${p.features.join("; ")}`
        : "";
      const tags = p.tags ? `\n  Technologies: ${p.tags.join(", ")}` : "";
      return `### ${p.title}
  ${p.description}
  ${p.detailedDescription || ""}${tags}${features}
  URL: ${p.url || "N/A"}`;
    })
    .join("\n\n");
  sections.push(`## PROJECTS
${projectList}`);

  // Achievements section (direct array)
  const achievements = achievementsData as Array<{
    title: string;
    organization: string;
    year: string;
    description: string;
  }>;
  const achieveList = achievements
    .map(
      (a) => `- ${a.title} by ${a.organization} (${a.year}): ${a.description}`
    )
    .join("\n");
  sections.push(`## ACHIEVEMENTS
${achieveList}`);

  // Certifications section (direct array)
  const certifications = certificationsData as Array<{
    title: string;
    issuer: string;
    date: string;
  }>;
  const certList = certifications
    .map((c) => `- ${c.title} by ${c.issuer} (${c.date})`)
    .join("\n");
  sections.push(`## CERTIFICATIONS
${certList}`);

  // Organizations section (direct array)
  const organizations = organizationsData as Array<{
    title: string;
    position: string;
    period: string;
    description: string[];
  }>;
  const orgList = organizations
    .map(
      (o) =>
        `- ${o.position} at ${o.title} (${o.period}): ${o.description.join(
          "; "
        )}`
    )
    .join("\n");
  sections.push(`## ORGANIZATIONS
${orgList}`);

  return sections.join("\n\n");
}

// Load PDF content (CV) - with robust error handling
export async function loadPDFContent(): Promise<string> {
  try {
    const pdfPath = path.join(process.cwd(), "public", "assets", "cv.pdf");

    if (!fs.existsSync(pdfPath)) {
      console.warn("CV PDF not found at:", pdfPath);
      return "";
    }

    // Dynamic import for pdf-parse with timeout
    try {
      const pdfParse = require("pdf-parse");
      const dataBuffer = fs.readFileSync(pdfPath);

      // Add timeout for PDF parsing (5 seconds max)
      const parsePromise = pdfParse(dataBuffer);
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("PDF parse timeout")), 5000)
      );

      const data = await Promise.race([parsePromise, timeoutPromise]);
      if (!data || !data.text) {
        console.warn("PDF parsed but no text found");
        return "";
      }

      console.log("PDF loaded successfully, text length:", data.text.length);
      return `## CV/RESUME CONTENT
${data.text}`;
    } catch (parseError) {
      console.error("PDF parse error:", parseError);
      return ""; // Return empty string, don't break the whole context
    }
  } catch (error) {
    console.error("Error loading PDF:", error);
    return "";
  }
}

// Get full context
export async function getFullPortfolioContext(): Promise<string> {
  const jsonContext = buildPortfolioContext();

  // Temporarily disable PDF to debug context loading
  // const pdfContext = await loadPDFContent();
  const pdfContext = ""; // Skip PDF for now

  console.log("📋 JSON context length:", jsonContext.length);

  return `${jsonContext}

${pdfContext}`;
}
