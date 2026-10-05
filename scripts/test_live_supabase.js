const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://sfnyuzemaqplpdeedsgg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnl1emVtYXFwbHBkZWVkc2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE3ODEsImV4cCI6MjEwNjYwNzc4MX0.z3YtkhMBSQnMMdCWWCRrFAYn2Yv4bAQcyZ3NGFZOlyw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabase() {
  console.log('Testing Supabase tables...\n');

  // 1. Models
  const { data: models, error: mErr } = await supabase.from('models').select('*');
  console.log('--- MODELS ---');
  if (mErr) console.error('Models error:', mErr);
  else console.log(`Models count in cloud: ${models.length}`, models.map(m => ({ id: m.id, name: m.name })));

  // 2. Reels
  const { data: reels, error: rErr } = await supabase.from('reels').select('*');
  console.log('\n--- REELS ---');
  if (rErr) console.error('Reels error:', rErr);
  else console.log(`Reels count in cloud: ${reels.length}`, reels.map(r => ({ id: r.id, title: r.title })));

  // 3. Leads
  const { data: leads, error: lErr } = await supabase.from('leads').select('*');
  console.log('\n--- LEADS ---');
  if (lErr) console.error('Leads error:', lErr);
  else console.log(`Leads count in cloud: ${leads.length}`, leads.map(l => ({ id: l.id, name: l.name })));

  // 4. Hero Slides
  const { data: slides, error: sErr } = await supabase.from('hero_slides').select('*');
  console.log('\n--- HERO SLIDES ---');
  if (sErr) console.error('Hero slides error:', sErr);
  else console.log(`Hero slides count in cloud: ${slides ? slides.length : 0}`);
}

testSupabase();
