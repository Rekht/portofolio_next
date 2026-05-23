const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://joybwgquarfmqmaedxfw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveWJ3Z3F1YXJmbXFtYWVkeGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTgxMjQsImV4cCI6MjA3ODM3NDEyNH0.C6HVQaClTc_TKBEDFOwLwPkB2Did0ikdCVlvX3pxs8w';

const TABLES = {
  experience: 'experience.json',
  projects: 'projects.json',
  certifications: 'certifications.json',
  achievements: 'achievements.json',
  education: 'education.json',
  organizations: 'organizations.json'
};

async function sync() {
  console.log('Starting data synchronization from Supabase...');
  
  for (const [table, fileName] of Object.entries(TABLES)) {
    try {
      const url = `${SUPABASE_URL}/rest/v1/${table}?order=id.asc`;
      const response = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const filePath = path.join(__dirname, '..', 'src', 'data', fileName);
      
      // Ensure target directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✓ Synced ${table} -> src/data/${fileName} (${data.length} items)`);
    } catch (error) {
      console.error(`✗ Failed to sync ${table}:`, error.message);
    }
  }
  
  console.log('Synchronization complete!');
}

sync();
