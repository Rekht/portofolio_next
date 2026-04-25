const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

function esc(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}
function jsonb(val) {
  if (val === null || val === undefined) return 'NULL';
  return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
}
function bool(val) {
  if (val === true) return 'true';
  if (val === false) return 'false';
  return 'NULL';
}

const lines = [];
function emit(s) { lines.push(s); }

// ========== CREATE TABLES ==========
emit(`-- =============================================`);
emit(`-- Portfolio Supabase Migration`);
emit(`-- Run this entire script in Supabase SQL Editor`);
emit(`-- =============================================\n`);

// about
emit(`CREATE TABLE IF NOT EXISTS about (
  id int PRIMARY KEY DEFAULT 1,
  description text NOT NULL
);\n`);

// projects
emit(`CREATE TABLE IF NOT EXISTS projects (
  id int PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  "detailedDescription" text,
  image text,
  image_thumb text,
  url text,
  tags jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb
);\n`);

// certifications
emit(`CREATE TABLE IF NOT EXISTS certifications (
  id int PRIMARY KEY,
  title text NOT NULL,
  title_en text,
  issuer text NOT NULL,
  date text,
  created_at text,
  image text,
  url text,
  "isEnglish" boolean DEFAULT false
);\n`);

// achievements
emit(`CREATE TABLE IF NOT EXISTS achievements (
  id int PRIMARY KEY,
  title text NOT NULL,
  organization text,
  year text,
  description text,
  certificate text,
  "hasImage" boolean DEFAULT false,
  "certificateImage" text,
  "documentationImage" text
);\n`);

// education
emit(`CREATE TABLE IF NOT EXISTS education (
  id int PRIMARY KEY,
  degree text NOT NULL,
  institution text,
  period text,
  description text,
  gpa text
);\n`);

// experience
emit(`CREATE TABLE IF NOT EXISTS experience (
  id int PRIMARY KEY,
  company text NOT NULL,
  position text,
  duration text,
  location text,
  description jsonb DEFAULT '[]'::jsonb,
  technologies jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb
);\n`);

// organizations
emit(`CREATE TABLE IF NOT EXISTS organizations (
  id int PRIMARY KEY,
  title text NOT NULL,
  position text,
  period text,
  description jsonb DEFAULT '[]'::jsonb,
  image jsonb DEFAULT '[]'::jsonb
);\n`);

// skills
emit(`CREATE TABLE IF NOT EXISTS skills (
  id text PRIMARY KEY,
  title text NOT NULL,
  color text,
  technologies jsonb DEFAULT '[]'::jsonb
);\n`);

// ========== INSERT DATA ==========
emit(`-- =============================================`);
emit(`-- INSERT DATA`);
emit(`-- =============================================\n`);

// about
const about = JSON.parse(fs.readFileSync(path.join(dataDir, 'about.json'), 'utf-8'));
emit(`INSERT INTO about (id, description) VALUES (1, ${esc(about.description)}) ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description;\n`);

// projects
const projects = JSON.parse(fs.readFileSync(path.join(dataDir, 'projects.json'), 'utf-8'));
for (const p of projects) {
  emit(`INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (${p.id}, ${esc(p.title)}, ${esc(p.description)}, ${esc(p.detailedDescription)}, ${esc(p.image)}, ${esc(p.image_thumb)}, ${esc(p.url)}, ${jsonb(p.tags)}, ${jsonb(p.features)})
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;`);
}
emit('');

// certifications
const certs = JSON.parse(fs.readFileSync(path.join(dataDir, 'certifications.json'), 'utf-8'));
for (const c of certs) {
  emit(`INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (${c.id}, ${esc(c.title)}, ${esc(c.title_en)}, ${esc(c.issuer)}, ${esc(c.date)}, ${esc(c.created_at)}, ${esc(c.image)}, ${esc(c.url)}, ${bool(c.isEnglish)})
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";`);
}
emit('');

// achievements
const achv = JSON.parse(fs.readFileSync(path.join(dataDir, 'achievements.json'), 'utf-8'));
for (const a of achv) {
  emit(`INSERT INTO achievements (id, title, organization, year, description, certificate, "hasImage", "certificateImage", "documentationImage")
VALUES (${a.id}, ${esc(a.title)}, ${esc(a.organization)}, ${esc(a.year)}, ${esc(a.description)}, ${esc(a.certificate)}, ${bool(a.hasImage)}, ${esc(a.certificateImage)}, ${esc(a.documentationImage)})
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, organization=EXCLUDED.organization, year=EXCLUDED.year, description=EXCLUDED.description, certificate=EXCLUDED.certificate, "hasImage"=EXCLUDED."hasImage", "certificateImage"=EXCLUDED."certificateImage", "documentationImage"=EXCLUDED."documentationImage";`);
}
emit('');

// education
const edu = JSON.parse(fs.readFileSync(path.join(dataDir, 'education.json'), 'utf-8'));
for (const e of edu) {
  emit(`INSERT INTO education (id, degree, institution, period, description, gpa)
VALUES (${e.id}, ${esc(e.degree)}, ${esc(e.institution)}, ${esc(e.period)}, ${esc(e.description)}, ${esc(e.gpa)})
ON CONFLICT (id) DO UPDATE SET degree=EXCLUDED.degree, institution=EXCLUDED.institution, period=EXCLUDED.period, description=EXCLUDED.description, gpa=EXCLUDED.gpa;`);
}
emit('');

// experience
const exp = JSON.parse(fs.readFileSync(path.join(dataDir, 'experience.json'), 'utf-8'));
for (const e of exp) {
  emit(`INSERT INTO experience (id, company, position, duration, location, description, technologies, images)
VALUES (${e.id}, ${esc(e.company)}, ${esc(e.position)}, ${esc(e.duration)}, ${esc(e.location)}, ${jsonb(e.description)}, ${jsonb(e.technologies)}, ${jsonb(e.images)})
ON CONFLICT (id) DO UPDATE SET company=EXCLUDED.company, position=EXCLUDED.position, duration=EXCLUDED.duration, location=EXCLUDED.location, description=EXCLUDED.description, technologies=EXCLUDED.technologies, images=EXCLUDED.images;`);
}
emit('');

// organizations
const orgs = JSON.parse(fs.readFileSync(path.join(dataDir, 'organizations.json'), 'utf-8'));
for (const o of orgs) {
  emit(`INSERT INTO organizations (id, title, position, period, description, image)
VALUES (${o.id}, ${esc(o.title)}, ${esc(o.position)}, ${esc(o.period)}, ${jsonb(o.description)}, ${jsonb(o.image)})
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, position=EXCLUDED.position, period=EXCLUDED.period, description=EXCLUDED.description, image=EXCLUDED.image;`);
}
emit('');

// skills
const skillsRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'skills.json'), 'utf-8'));
for (const [key, val] of Object.entries(skillsRaw.skills)) {
  emit(`INSERT INTO skills (id, title, color, technologies)
VALUES (${esc(key)}, ${esc(val.title)}, ${esc(val.color)}, ${jsonb(val.technologies)})
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, color=EXCLUDED.color, technologies=EXCLUDED.technologies;`);
}
emit('');

// ========== RLS ==========
emit(`-- =============================================`);
emit(`-- ROW LEVEL SECURITY`);
emit(`-- =============================================\n`);

const tables = ['about','projects','certifications','achievements','education','experience','organizations','skills'];
for (const t of tables) {
  emit(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`);
  emit(`CREATE POLICY "Public read ${t}" ON ${t} FOR SELECT USING (true);`);
  emit(`CREATE POLICY "Auth insert ${t}" ON ${t} FOR INSERT TO authenticated WITH CHECK (true);`);
  emit(`CREATE POLICY "Auth update ${t}" ON ${t} FOR UPDATE TO authenticated USING (true) WITH CHECK (true);`);
  emit(`CREATE POLICY "Auth delete ${t}" ON ${t} FOR DELETE TO authenticated USING (true);`);
  emit('');
}

// Output
const sql = lines.join('\n');
const outPath = path.join(__dirname, '..', 'supabase-migration.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log(`Migration SQL written to: ${outPath}`);
console.log(`Total lines: ${lines.length}`);
