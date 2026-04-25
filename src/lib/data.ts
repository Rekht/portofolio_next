import { supabase } from "./supabase";

// Generic fetch helper with error handling
async function fetchTable<T = any>(table: string, orderBy = "id"): Promise<T[] | null> {
  try {
    if (!supabase) return null;
    const { data, error } = await supabase.from(table).select("*").order(orderBy);
    if (error) throw error;
    return data as T[];
  } catch (e) {
    console.warn(`Failed to fetch ${table} from Supabase:`, e);
    return null;
  }
}

export async function fetchAbout(): Promise<{ description: string } | null> {
  try {
    if (!supabase) return null;
    const { data, error } = await supabase.from("about").select("*").single();
    if (error) throw error;
    return data as { description: string };
  } catch (e) {
    console.warn("Failed to fetch about from Supabase:", e);
    return null;
  }
}

export async function fetchProjects() {
  return fetchTable("projects");
}

export async function fetchCertifications() {
  return fetchTable("certifications");
}

export async function fetchAchievements() {
  return fetchTable("achievements");
}

export async function fetchEducation() {
  return fetchTable("education");
}

export async function fetchExperience() {
  return fetchTable("experience");
}

export async function fetchOrganizations() {
  return fetchTable("organizations");
}

export async function fetchSkills(): Promise<{ skills: Record<string, { title: string; color: string; technologies: string[] }> } | null> {
  try {
    if (!supabase) return null;
    const { data, error } = await supabase.from("skills").select("*");
    if (error) throw error;
    // Reconstruct the nested object shape that components expect
    const skillsObj: Record<string, { title: string; color: string; technologies: string[] }> = {};
    for (const row of data) {
      skillsObj[row.id] = {
        title: row.title,
        color: row.color,
        technologies: row.technologies,
      };
    }
    return { skills: skillsObj };
  } catch (e) {
    console.warn("Failed to fetch skills from Supabase:", e);
    return null;
  }
}
