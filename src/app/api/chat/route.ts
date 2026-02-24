// src/app/api/chat/route.ts
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// ─── Configuration ───────────────────────────────────────────────
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL = process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct:together";
const MAX_TOKENS = Number(process.env.CHAT_MAX_TOKENS) || 1024;
const FETCH_TIMEOUT_MS = 30_000; // 30 seconds
const DEBUG = process.env.NODE_ENV !== "production";

// ─── Logging helper ──────────────────────────────────────────────
function log(...args: unknown[]) {
  if (DEBUG) console.log(...args);
}

// ─── Module-level cache ──────────────────────────────────────────
let cachedPortfolio: {
  summary: string;
  structureAnalysis: string;
} | null = null;

function getPortfolioContext(): {
  summary: string;
  structureAnalysis: string;
} {
  if (cachedPortfolio) {
    log("Using cached portfolio data ✓");
    return cachedPortfolio;
  }

  log("Building portfolio cache...");
  const srcStructure = scanSrcStructure();
  const jsonData = loadAllJSONData();

  cachedPortfolio = {
    summary: summarizePortfolioData(jsonData),
    structureAnalysis: analyzeWebsiteStructure(srcStructure, jsonData),
  };

  log("Portfolio cache built ✓");
  return cachedPortfolio;
}

// ─── Helpers ─────────────────────────────────────────────────────

/** Build a consistent JSON error response */
function errorResponse(
  message: string,
  status: number,
  details?: string,
): Response {
  return new Response(
    JSON.stringify({ error: message, ...(details ? { details } : {}) }),
    { status, headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
}

// Function to scan src directory structure
function scanSrcStructure(): string {
  try {
    const srcDir = path.join(process.cwd(), "src");
    const structure: string[] = [];

    function scanDirectory(dir: string, prefix: string = "") {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      items.forEach((item) => {
        const itemPath = path.join(dir, item.name);
        const relativePath = path.relative(srcDir, itemPath);

        if (item.isDirectory()) {
          // Skip node_modules, .next, etc
          if (!item.name.startsWith(".") && item.name !== "node_modules") {
            structure.push(`${prefix}📁 ${relativePath}/`);
            scanDirectory(itemPath, prefix + "  ");
          }
        } else {
          // Only include relevant files
          const ext = path.extname(item.name);
          if ([".tsx", ".ts", ".json", ".css", ".md"].includes(ext)) {
            structure.push(`${prefix}📄 ${relativePath}`);
          }
        }
      });
    }

    scanDirectory(srcDir);
    return structure.join("\n");
  } catch (error) {
    console.error("Error scanning src structure:", error);
    return "";
  }
}

// Function to load all JSON files from src/data (safe per-file parsing)
function loadAllJSONData(): Record<string, any> {
  try {
    const dataDir = path.join(process.cwd(), "src", "data");
    const files = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".json"));

    const allData: Record<string, any> = {};

    files.forEach((file) => {
      try {
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const fileName = file.replace(".json", "");
        allData[fileName] = JSON.parse(fileContent);
      } catch (parseError) {
        console.error(`Failed to parse ${file}:`, parseError);
        // Skip this file and continue loading others
      }
    });

    return allData;
  } catch (error) {
    console.error("Error loading JSON data:", error);
    return {};
  }
}

// Helper: Safely convert any value to string and truncate
function safeString(value: any, maxLength: number = 200): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value.substring(0, maxLength);
  }

  if (Array.isArray(value)) {
    return value.join(", ").substring(0, maxLength);
  }

  if (typeof value === "object") {
    return JSON.stringify(value).substring(0, maxLength);
  }

  return String(value).substring(0, maxLength);
}

// Categorize and label data with clear distinctions
function categorizeExperience(experience: any[]): Record<string, any[]> {
  const categorized: Record<string, any[]> = {
    fulltime: [],
    internship: [],
    freelance: [],
    volunteer: [],
    research: [],
    other: [],
  };

  experience.forEach((exp: any) => {
    const type = (exp.type || exp.category || "").toLowerCase();
    const title = (exp.title || exp.role || "").toLowerCase();
    const company = (exp.company || exp.organization || "").toLowerCase();

    // Categorize based on type or keywords
    if (type.includes("intern") || title.includes("intern") || exp.internship) {
      categorized.internship.push(exp);
    } else if (type.includes("research") || title.includes("research")) {
      categorized.research.push(exp);
    } else if (type.includes("freelance") || title.includes("freelance")) {
      categorized.freelance.push(exp);
    } else if (type.includes("volunteer") || title.includes("volunteer")) {
      categorized.volunteer.push(exp);
    } else if (type.includes("full") || type.includes("permanent")) {
      categorized.fulltime.push(exp);
    } else {
      // Default: if it's a proper company, likely full-time, else other
      if (company && !title.includes("intern")) {
        categorized.fulltime.push(exp);
      } else {
        categorized.other.push(exp);
      }
    }
  });

  return categorized;
}

// Summarize portfolio data with clear categorization
function summarizePortfolioData(data: Record<string, any>): string {
  const summary: string[] = [];

  try {
    summary.push("=== PORTFOLIO DATA BREAKDOWN ===\n");

    // About
    if (data.about) {
      summary.push("--- PERSONAL INFORMATION ---");
      summary.push(`NAME: ${data.about.name || "Restu Anggoro Kasih"}`);
      summary.push(
        `TITLE: ${data.about.title || "Data Scientist & ML Engineer"}`,
      );
      summary.push(`LOCATION: ${data.about.location || "Indonesia"}`);
      if (data.about.bio)
        summary.push(`BIO: ${safeString(data.about.bio, 250)}`);
      if (data.about.email) summary.push(`EMAIL: ${data.about.email}`);
      summary.push("");
    }

    // Skills
    if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
      summary.push("--- SKILLS & EXPERTISE ---");
      const skillNames = data.skills
        .map((s: any) => {
          if (typeof s === "string") return s;
          return s.name || s.skill || s.title || "";
        })
        .filter(Boolean)
        .slice(0, 30)
        .join(", ");
      if (skillNames) summary.push(skillNames);
      summary.push("");
    }

    // Experience (CATEGORIZED)
    if (
      data.experience &&
      Array.isArray(data.experience) &&
      data.experience.length > 0
    ) {
      const categorized = categorizeExperience(data.experience);

      if (categorized.fulltime.length > 0) {
        summary.push("--- WORK EXPERIENCE (Full-time/Professional) ---");
        categorized.fulltime.forEach((exp: any) => {
          const title = exp.title || exp.role || exp.position || "";
          const company = exp.company || exp.organization || "";
          const period = exp.period || exp.duration || exp.date || "";
          const desc = exp.description ? safeString(exp.description, 200) : "";

          summary.push(`• ${title} at ${company}`);
          summary.push(`  Period: ${period}`);
          if (desc) summary.push(`  Description: ${desc}`);
          summary.push("");
        });
      }

      if (categorized.research.length > 0) {
        summary.push("--- RESEARCH EXPERIENCE ---");
        categorized.research.forEach((exp: any) => {
          const title = exp.title || exp.role || exp.position || "";
          const company =
            exp.company || exp.organization || exp.institution || "";
          const period = exp.period || exp.duration || exp.date || "";
          const desc = exp.description ? safeString(exp.description, 200) : "";

          summary.push(`• ${title} at ${company}`);
          summary.push(`  Period: ${period}`);
          if (desc) summary.push(`  Description: ${desc}`);
          summary.push("");
        });
      }

      if (categorized.internship.length > 0) {
        summary.push("--- INTERNSHIP EXPERIENCE ---");
        categorized.internship.forEach((exp: any) => {
          const title = exp.title || exp.role || exp.position || "";
          const company = exp.company || exp.organization || "";
          const period = exp.period || exp.duration || exp.date || "";
          const desc = exp.description ? safeString(exp.description, 200) : "";

          summary.push(`• ${title} at ${company}`);
          summary.push(`  Period: ${period}`);
          if (desc) summary.push(`  Description: ${desc}`);
          summary.push("");
        });
      }

      if (categorized.freelance.length > 0) {
        summary.push("--- FREELANCE/CONTRACT WORK ---");
        categorized.freelance.forEach((exp: any) => {
          const title = exp.title || exp.role || exp.position || "";
          const company = exp.company || exp.organization || exp.client || "";
          const period = exp.period || exp.duration || exp.date || "";
          const desc = exp.description ? safeString(exp.description, 200) : "";

          summary.push(`• ${title}${company ? ` for ${company}` : ""}`);
          summary.push(`  Period: ${period}`);
          if (desc) summary.push(`  Description: ${desc}`);
          summary.push("");
        });
      }
    }

    // Education
    if (
      data.education &&
      Array.isArray(data.education) &&
      data.education.length > 0
    ) {
      summary.push("--- EDUCATION ---");
      data.education.forEach((edu: any) => {
        const degree = edu.degree || edu.school || edu.institution || "";
        const field = edu.field || edu.major || edu.program || "";
        const institution =
          edu.institution || edu.university || edu.school || "";
        const year = edu.year || edu.period || edu.graduation || "";
        const gpa = edu.gpa || edu.grade || "";

        summary.push(`• ${degree}${field ? ` in ${field}` : ""}`);
        if (institution) summary.push(`  Institution: ${institution}`);
        summary.push(`  Period: ${year}`);
        if (gpa) summary.push(`  GPA: ${gpa}`);
        summary.push("");
      });
    }

    // Organizations (SEPARATE from Experience)
    if (
      data.organizations &&
      Array.isArray(data.organizations) &&
      data.organizations.length > 0
    ) {
      summary.push(
        "--- ORGANIZATIONAL EXPERIENCE (Student Organizations, Committees, etc.) ---",
      );
      data.organizations.forEach((org: any) => {
        const name = org.name || org.organization || "";
        const role = org.role || org.position || "";
        const period = org.period || org.duration || org.date || "";
        const desc = org.description ? safeString(org.description, 200) : "";

        summary.push(`• ${role || "Member"} at ${name}`);
        if (period) summary.push(`  Period: ${period}`);
        if (desc) summary.push(`  Description: ${desc}`);
        summary.push("");
      });
    }

    // Projects
    if (
      data.projects &&
      Array.isArray(data.projects) &&
      data.projects.length > 0
    ) {
      summary.push("--- PROJECTS ---");
      data.projects.slice(0, 8).forEach((proj: any) => {
        const name = proj.name || proj.title || "";
        const tech = proj.technologies || proj.tech || proj.stack || "";
        const desc = safeString(proj.description, 150);
        const link = proj.link || proj.url || proj.github || "";

        summary.push(`• ${name}`);
        if (tech)
          summary.push(
            `  Technologies: ${Array.isArray(tech) ? tech.join(", ") : tech}`,
          );
        if (desc) summary.push(`  Description: ${desc}`);
        if (link) summary.push(`  Link: ${link}`);
        summary.push("");
      });
    }

    // Certifications
    if (
      data.certifications &&
      Array.isArray(data.certifications) &&
      data.certifications.length > 0
    ) {
      summary.push("--- CERTIFICATIONS ---");
      data.certifications.forEach((cert: any) => {
        if (typeof cert === "string") {
          summary.push(`• ${cert}`);
        } else {
          const name = cert.name || cert.title || cert.certification || "";
          const issuer =
            cert.issuer || cert.organization || cert.provider || "";
          const date = cert.date || cert.year || cert.issued || "";
          const id = cert.id || cert.credential || "";

          summary.push(`• ${name}`);
          if (issuer) summary.push(`  Issued by: ${issuer}`);
          if (date) summary.push(`  Date: ${date}`);
          if (id) summary.push(`  Credential ID: ${id}`);
          summary.push("");
        }
      });
    }

    // Achievements
    if (
      data.achievements &&
      Array.isArray(data.achievements) &&
      data.achievements.length > 0
    ) {
      summary.push("--- ACHIEVEMENTS & AWARDS ---");
      data.achievements.forEach((achievement: any) => {
        if (typeof achievement === "string") {
          summary.push(`• ${achievement}`);
        } else {
          const title =
            achievement.title ||
            achievement.achievement ||
            achievement.name ||
            "";
          const date = achievement.date || achievement.year || "";
          const issuer = achievement.issuer || achievement.organization || "";
          const desc = achievement.description
            ? safeString(achievement.description, 150)
            : "";

          summary.push(`• ${title}`);
          if (issuer) summary.push(`  From: ${issuer}`);
          if (date) summary.push(`  Date: ${date}`);
          if (desc) summary.push(`  Description: ${desc}`);
          summary.push("");
        }
      });
    }
  } catch (error) {
    console.error("Error in summarizePortfolioData:", error);
  }

  return summary.join("\n");
}

// Analyze structure to find pages/sections
function analyzeWebsiteStructure(
  structure: string,
  data: Record<string, any>,
): string {
  const analysis: string[] = ["\n--- WEBSITE STRUCTURE ANALYSIS ---"];

  // Extract page/section info from structure
  const pages = new Set<string>();
  structure.split("\n").forEach((line) => {
    // Look for page files in app directory
    if (
      line.includes("app/") &&
      (line.includes("page.tsx") || line.includes("page.ts"))
    ) {
      const match = line.match(/app\/([^/]+)\//);
      if (match && match[1] !== "api") {
        pages.add(match[1]);
      }
    }
  });

  // Map data to pages with sections
  const pageMapping: Record<string, string[]> = {};

  Object.keys(data).forEach((dataKey) => {
    const hasData = Array.isArray(data[dataKey])
      ? data[dataKey].length > 0
      : true;
    if (!hasData) return;

    // Try to find matching page or group related data
    const normalizedKey = dataKey.toLowerCase();
    let targetPage = normalizedKey;

    // Check if there's an exact match page
    const exactMatch = Array.from(pages).find(
      (p) => p.toLowerCase() === normalizedKey,
    );
    if (exactMatch) {
      targetPage = exactMatch;
    } else {
      // Group related data (e.g., certifications might be in education page)
      if (
        normalizedKey === "certifications" ||
        normalizedKey === "achievements"
      ) {
        targetPage = "education"; // Assume these are in education page
      }
    }

    if (!pageMapping[targetPage]) {
      pageMapping[targetPage] = [];
    }
    pageMapping[targetPage].push(dataKey);
  });

  analysis.push("\nWebsite Structure and Content Location:");

  Object.keys(pageMapping)
    .sort()
    .forEach((page) => {
      const sections = pageMapping[page];
      const pageName = page.charAt(0).toUpperCase() + page.slice(1);

      if (
        sections.length === 1 &&
        sections[0].toLowerCase() === page.toLowerCase()
      ) {
        analysis.push(`\n📄 PAGE: ${pageName}`);
        analysis.push(`   Contains: ${pageName} information`);
      } else {
        analysis.push(`\n📄 PAGE: ${pageName}`);
        analysis.push(`   Sections available:`);
        sections.forEach((section) => {
          const sectionName =
            section.charAt(0).toUpperCase() + section.slice(1);
          analysis.push(`   - ${sectionName}`);
        });
      }
    });

  analysis.push("\n⚠️ CRITICAL INSTRUCTIONS for answering 'WHERE' questions:");
  analysis.push(
    "\nWhen users ask 'where can I see/find [something]', you MUST answer in this format:",
  );
  analysis.push(
    "1. Start with: 'Kamu bisa lihat [item] di halaman [PAGE NAME]' (Indonesian) or 'You can see [item] on the [PAGE NAME] page' (English)",
  );
  analysis.push(
    "2. If the page has multiple sections, add: 'di bagian [SECTION NAME]' (Indonesian) or 'in the [SECTION NAME] section' (English)",
  );
  analysis.push("\nEXAMPLES:");
  analysis.push(
    "❌ BAD: 'Anda bisa melihat daftar sertifikat Restu di bagian Certifications'",
  );
  analysis.push(
    "✅ GOOD: 'Kamu bisa lihat sertifikat saya di halaman Education, di bagian Certifications'",
  );
  analysis.push(
    "✅ GOOD: 'You can see my certifications on the Education page, in the Certifications section'",
  );
  analysis.push("\n❌ BAD: 'Check out the Projects section'");
  analysis.push("✅ GOOD: 'Kamu bisa lihat projects saya di halaman Projects'");
  analysis.push("✅ GOOD: 'You can see my projects on the Projects page'");
  analysis.push(
    "\nALWAYS mention the PAGE first, then the SECTION (if applicable). Be specific and clear!",
  );

  return analysis.join("\n");
}

// ─── Sanitize & validate incoming messages ───────────────────────
function sanitizeMessages(
  raw: any[],
): { role: "user" | "assistant"; content: string }[] {
  const MAX_CONTENT_LENGTH = 2000;
  const MAX_MESSAGES = 20; // keep conversation history reasonable

  return raw
    .filter(
      (m: any) =>
        m &&
        typeof m.content === "string" &&
        m.content.trim() !== "" &&
        ["user", "assistant"].includes(m.role),
    )
    .slice(-MAX_MESSAGES) // keep only the most recent messages
    .map((m: any) => ({
      role: m.role as "user" | "assistant",
      content: m.content.substring(0, MAX_CONTENT_LENGTH),
    }));
}

// ─── Main handler ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  log("=== Chat API Called (HF Router) ===");

  try {
    const body = await req.json();
    const { messages } = body;

    log("Received messages:", messages?.length || 0);

    if (!messages || !Array.isArray(messages)) {
      return errorResponse("Messages array required", 400);
    }

    // Sanitize input
    const sanitizedMessages = sanitizeMessages(messages);
    if (sanitizedMessages.length === 0) {
      return errorResponse("At least one valid user message is required", 400);
    }

    const apiKey =
      process.env.HUGGINGFACE_TOKEN ||
      process.env.HUGGINGFACE_API_KEY ||
      process.env.HF_TOKEN;

    if (!apiKey) {
      console.error("HF_TOKEN not found");
      return errorResponse("HuggingFace token not configured", 500);
    }

    log("API token found ✓");

    // Use cached portfolio data
    const { summary: portfolioSummary, structureAnalysis } =
      getPortfolioContext();

    log("Portfolio summary length:", portfolioSummary.length);

    // Get current date for temporal reasoning
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });
    const currentMonthNum = currentDate.getMonth() + 1; // 1-12

    // Build system message
    const systemMessage = `You are Zizi, Restu Anggoro Kasih's personal assistant on his portfolio website.

CURRENT DATE: ${currentMonth} ${currentYear} (Month: ${currentMonthNum}, Year: ${currentYear})

=== CRITICAL INSTRUCTIONS - READ CAREFULLY ===

1. LANGUAGE MATCHING (HIGHEST PRIORITY):
   - If user writes in English → respond in English
   - If user writes in Indonesian → respond in Indonesian  
   - If user writes in French → respond in French
   - If user writes in any other language → respond in that same language
   - ALWAYS match the user's language exactly

2. TEMPORAL REASONING & DATE ANALYSIS (EXTREMELY IMPORTANT):
   Before answering ANY question about time, status, or current state, you MUST:
   
   a) ANALYZE DATE RANGES CAREFULLY:
      - "2021 - 2025" means it ENDED in 2025 (past tense)
      - "2021 - Present" means it is ONGOING (present tense)
      - "2021 - January 2025" means it ended in January 2025 (past tense if current date is after Jan 2025)
      - If end date is in the past compared to current date, use PAST TENSE
      - If end date says "Present", "Now", "Current", use PRESENT TENSE
   
   b) COMPARE DATES WITH CURRENT DATE:
      Current date is: ${currentMonth} ${currentYear}
      
      Examples of correct reasoning:
      - Education: "2021 - 2025" → Since current year is ${currentYear}, this ended in 2025 → "Restu GRADUATED in 2025" (past tense)
      - Education: "2021 - January 2025" and current month is ${currentMonth} ${currentYear} → "Restu GRADUATED in January 2025" (past tense)
      - Work: "2023 - Present" → This is ONGOING → "Restu is CURRENTLY working" (present tense)
      - Work: "2023 - 2024" → This ENDED in 2024 → "Restu WORKED there until 2024" (past tense)
   
   c) KEYWORDS TO WATCH:
      - "still", "currently", "now", "sedang" (Indonesian) = asking about PRESENT status
      - "was", "did", "had", "dulu" (Indonesian) = asking about PAST
      - Always check if the time period is in the past or present before answering!

3. UNDERSTANDING DATA CATEGORIES & SEGMENTS:
   
   The portfolio data is organized into DISTINCT categories. You MUST understand and respect these boundaries:
   
   a) WORK EXPERIENCE (Professional Full-time Jobs):
      - These are formal employment positions
      - Usually long-term (months to years)
      - Full-time or part-time professional roles
      - Example: "Data Scientist at Company X"
   
   b) RESEARCH EXPERIENCE (Academic/Research Positions):
      - Research Assistant, Research Intern, Lab positions
      - Usually at universities or research institutions
      - Example: "Research Assistant at Department of Mathematics Education, Universitas Negeri Yogyakarta (May 2024 - July 2024)"
   
   c) INTERNSHIP EXPERIENCE:
      - Temporary learning positions
      - Usually labeled as "Intern" or "Magang"
      - Short-term (weeks to a few months)
      - Example: "Media Staff (Intern) at Desa Grogol as part of PPK Ormawa (July 2023 - August 2023)"
   
   d) ORGANIZATIONAL EXPERIENCE (Student Organizations, Campus Activities):
      - Student body positions, club memberships
      - Campus committees, volunteer groups
      - Community service programs
      - These are NOT the same as work experience or internships!
      - Example: "Member of Student Council", "PPK Ormawa participant"
   
   e) CERTIFICATIONS:
      - Official certificates from courses, training, exams
      - Example: "TOEFL Score", "Google Data Analytics Certificate"
      - These are credentials, NOT work experience
   
   f) ACHIEVEMENTS & AWARDS:
      - Competition wins, scholarships, honors
      - Recognition for accomplishments
      - Example: "1st Place in Data Science Competition"
   
   g) PROJECTS:
      - Personal or academic projects
      - Portfolio pieces, capstone projects
      - Example: "Machine Learning Predictive Model"
   
   h) EDUCATION:
      - Formal degrees (S1, S2, S3, Bachelor's, Master's, PhD)
      - University/school enrollment
      - Example: "S1 Mathematics, Universitas Negeri Yogyakarta (2021-2025)"
   
   ⚠️ CRITICAL: When user asks about one category, ONLY mention that category:
   
   - "Pengalaman organisasi apa?" → ONLY list from ORGANIZATIONAL EXPERIENCE section
   - "Internship apa aja?" → ONLY list from INTERNSHIP EXPERIENCE section  
   - "Pengalaman kerja?" → ONLY list from WORK EXPERIENCE section
   - "Sertifikat apa aja?" → ONLY list from CERTIFICATIONS section
   
   DO NOT mix categories! Research positions ≠ Organizations. Internships ≠ Full-time work.

4. CONTEXTUAL UNDERSTANDING & REASONING:
   
   a) READ THE ENTIRE CONTEXT before answering:
      - Don't just pattern match keywords
      - Understand what the user is REALLY asking
      - Look at related information (e.g., if asking about education, check graduation date, degree status, etc.)
      - Check which DATA CATEGORY the question is about
   
   b) CROSS-REFERENCE INFORMATION:
      - If data seems contradictory, use the most recent or most specific information
      - Education years + current date = graduation status
      - Job dates + current date = employment status
      - Project dates + description = project completion status
      - Look at the correct section (don't confuse internship with organization)
   
   c) LOGICAL INFERENCE:
      - If someone graduated in 2025 and it's now ${currentYear}, they are NOT currently a student
      - If end date is specified (not "Present"), the activity has ENDED
      - If degree is "S1" (Bachelor's) with end date 2025, they COMPLETED their bachelor's in 2025
      - Research Assistant position = Research Experience, NOT organizational experience
      - PPK Ormawa internship = Internship Experience, NOT organizational experience (unless specifically listed in organizations)

5. ACCURACY REQUIREMENTS:
   
   a) NEVER assume or guess:
      - If you don't have information, say "Saya tidak memiliki informasi tentang itu" (ID) or "I don't have that information" (EN)
      - Don't make up dates, names, or details
   
   b) VERIFY before stating facts:
      - Check if the date range is complete or ongoing
      - Check if the status is past or present
      - Double-check your temporal reasoning
   
   c) BE PRECISE with language:
      - Use past tense for completed activities: "graduated", "worked", "completed", "lulus", "bekerja" (past)
      - Use present tense for ongoing activities: "is studying", "works", "currently", "sedang kuliah", "bekerja"
      - Use future tense appropriately: "will graduate", "planning to", "akan"

6. RESPONSE STRUCTURE:
   
   a) For "WHERE" questions:
      Format: "Kamu bisa lihat [item] di halaman [PAGE], di bagian [SECTION]"
      Example: "Kamu bisa lihat pendidikan Restu di halaman Education, di bagian Achievements dan Certifications"
   
   b) For factual questions:
      - State the fact clearly
      - Include relevant dates/context
      - Use correct tense based on temporal analysis
   
   c) For current status questions:
      - Analyze dates first
      - Compare with current date (${currentMonth} ${currentYear})
      - Answer with correct tense

7. COMMON PITFALLS TO AVOID:
   
   TEMPORAL ERRORS:
   ❌ "Restu sedang kuliah" when graduation date shows 2025 and it's ${currentYear}
   ✅ "Restu sudah lulus dari Universitas Negeri Yogyakarta pada tahun 2025"
   
   ❌ "Restu is currently studying" when degree shows "2021-2025"
   ✅ "Restu graduated in 2025 with a degree in Mathematics"
   
   CATEGORY CONFUSION ERRORS:
   ❌ User asks "pengalaman organisasi?" → You answer with internship experience
   ✅ User asks "pengalaman organisasi?" → You answer ONLY with organizational experience
   
   ❌ Mentioning "Research Assistant" when asked about organizations
   ✅ Research Assistant is RESEARCH EXPERIENCE, not organizational experience
   
   ❌ Mentioning "Media Staff Intern at Desa Grogol" when asked about organizations
   ✅ This is INTERNSHIP EXPERIENCE (even if part of PPK Ormawa program), not organizational experience
   
   ❌ Listing certifications when asked about achievements
   ✅ Certifications and achievements are separate categories
   
   ❌ Mixing full-time work with internships
   ✅ These are completely different categories - keep them separate!
   
   IGNORING DATE/CONTEXT ERRORS:
   ❌ Ignoring the end date and assuming it's ongoing
   ✅ Always check if end date exists and compare with current date

${structureAnalysis}

PORTFOLIO DATA:
${portfolioSummary}

=== FINAL REMINDERS ===
- ALWAYS analyze dates and compare with current date (${currentMonth} ${currentYear})
- Use PAST TENSE if the period has ended
- Use PRESENT TENSE only if it says "Present", "Current", or end date is in the future
- Be precise, accurate, and contextually aware
- Match user's language
- Be natural, helpful, and conversational

Now, process each question carefully following ALL the instructions above.`;

    // Prepare API messages
    const apiMessages = [
      { role: "system", content: systemMessage },
      ...sanitizedMessages,
    ];

    log("Total messages:", apiMessages.length);
    log("Calling HF Router API...");

    // Fetch with timeout via AbortController
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: apiMessages,
          max_tokens: MAX_TOKENS,
          temperature: 0.7,
          top_p: 0.9,
          stream: false,
        }),
        signal: controller.signal,
      });
    } catch (fetchError: any) {
      clearTimeout(timeout);
      if (fetchError.name === "AbortError") {
        console.error("HF API request timed out");
        return errorResponse(
          "Request timed out. Model mungkin sedang sibuk, coba lagi nanti.",
          504,
        );
      }
      throw fetchError; // re-throw for the outer catch
    } finally {
      clearTimeout(timeout);
    }

    log("HF response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF Error:", errorText);

      if (response.status === 503) {
        return errorResponse(
          "Model sedang loading, tunggu 20 detik lalu coba lagi... (Model is loading, wait 20 seconds and try again...)",
          503,
        );
      }

      if (response.status === 401) {
        return errorResponse(
          "Token tidak valid. Cek HF_TOKEN di .env.local (Invalid token. Check HF_TOKEN in .env.local)",
          401,
        );
      }

      return errorResponse(`API error: ${response.status}`, 500, errorText);
    }

    const data = await response.json();
    log("Response received from HF Router ✓");

    // Validate response structure
    if (
      !data.choices ||
      !Array.isArray(data.choices) ||
      data.choices.length === 0
    ) {
      console.error(
        "Unexpected HF response format:",
        JSON.stringify(data).substring(0, 500),
      );
      return errorResponse(
        "Format respons dari model tidak dikenali. Coba lagi.",
        502,
      );
    }

    const content = data.choices[0]?.message?.content || "";

    if (!content || content.trim() === "") {
      console.error("Empty response from HF");
      log("Full response:", JSON.stringify(data).substring(0, 500));
      return errorResponse(
        "Maaf, tidak ada respons dari model. Coba lagi! (Sorry, no response. Try again!)",
        502,
      );
    }

    log("✓ Success! Response length:", content.length);

    return new Response(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("=== UNHANDLED ERROR ===");
    console.error("Error:", error);

    return errorResponse(
      "Internal server error",
      500,
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}
