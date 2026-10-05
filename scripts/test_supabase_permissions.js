const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://sfnyuzemaqplpdeedsgg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnl1emVtYXFwbHBkZWVkc2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE3ODEsImV4cCI6MjEwNjYwNzc4MX0.z3YtkhMBSQnMMdCWWCRrFAYn2Yv4bAQcyZ3NGFZOlyw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testPermissions() {
  console.log('--- TESTING SUPABASE PERMISSIONS (ANON KEY) ---');

  // Test 1: Insert reel
  const testReelId = 'reel-perm-test-' + Date.now();
  console.log('\n1. Testing insert into reels...');
  const { data: rData, error: rErr } = await supabase.from('reels').insert([{
    id: testReelId,
    title: 'Permission Test Reel',
    category: 'viral-reels',
    client: 'Test Client',
    tag: '4K CINEMA',
    views: '১.৫M ভিউজ',
    video_url: 'https://example.com/test.mp4',
    thumbnail_url: 'https://example.com/thumb.jpg',
    created_at: new Date().toISOString()
  }]).select();

  if (rErr) console.error('❌ Insert reel FAILED:', rErr);
  else console.log('✅ Insert reel SUCCESS:', rData);

  // Test 2: Update model
  console.log('\n2. Testing update on models...');
  const { data: mData, error: mErr } = await supabase.from('models')
    .update({ shoots: '২৫+' })
    .eq('id', 'M-1791102354967')
    .select();

  if (mErr) console.error('❌ Update model FAILED:', mErr);
  else console.log('✅ Update model SUCCESS:', mData);

  // Test 3: Delete reel
  console.log('\n3. Testing delete from reels...');
  const { data: dData, error: dErr } = await supabase.from('reels')
    .delete()
    .eq('id', testReelId)
    .select();

  if (dErr) console.error('❌ Delete reel FAILED:', dErr);
  else console.log('✅ Delete reel SUCCESS:', dData);

  // Test 4: Insert lead
  const testLeadId = 'L-perm-test-' + Date.now();
  console.log('\n4. Testing insert into leads...');
  const { data: lData, error: lErr } = await supabase.from('leads').insert([{
    id: testLeadId,
    name: 'Permission Test',
    phone: '01700000000',
    service: 'Test Service',
    budget: '৳ ২৫,০০০',
    status: 'New',
    created_at: new Date().toISOString()
  }]).select();

  if (lErr) console.error('❌ Insert lead FAILED:', lErr);
  else {
    console.log('✅ Insert lead SUCCESS:', lData);
    await supabase.from('leads').delete().eq('id', testLeadId);
  }
}

testPermissions();
