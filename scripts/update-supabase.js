const SUPABASE_URL = 'https://joybwgquarfmqmaedxfw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveWJ3Z3F1YXJmbXFtYWVkeGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTgxMjQsImV4cCI6MjA3ODM3NDEyNH0.C6HVQaClTc_TKBEDFOwLwPkB2Did0ikdCVlvX3pxs8w';

async function updateProjects() {
  // Update LULC
  let response = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.2`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      title: "LULC"
    })
  });
  console.log("Update LULC:", response.status, await response.text());

  // Update Bank Fraud
  response = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.3`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      title: "Bank Transaction Fraud Detection"
    })
  });
  console.log("Update Bank Fraud:", response.status, await response.text());
}

updateProjects();
