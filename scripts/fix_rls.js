const { Client } = require('pg');

async function fixAllTableRLSPolicies() {
  const client = new Client({
    host: 'aws-0-ap-southeast-2.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.sfnyuzemaqplpdeedsgg',
    password: 'Aktmtbar@1mzs',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL...');

    const tables = ['models', 'reels', 'leads', 'hero_slides'];

    for (const t of tables) {
      // Check if table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = '${t}'
        );
      `);

      if (tableCheck.rows[0].exists) {
        console.log(`\nConfiguring table: public.${t}`);
        // Enable RLS
        await client.query(`ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY;`);

        // Drop any old blocking policies
        await client.query(`DROP POLICY IF EXISTS "Public select on ${t}" ON public.${t};`);
        await client.query(`DROP POLICY IF EXISTS "Public insert on ${t}" ON public.${t};`);
        await client.query(`DROP POLICY IF EXISTS "Public update on ${t}" ON public.${t};`);
        await client.query(`DROP POLICY IF EXISTS "Public delete on ${t}" ON public.${t};`);

        // Create permissive policies so anon client can SELECT, INSERT, UPDATE, DELETE freely
        await client.query(`CREATE POLICY "Public select on ${t}" ON public.${t} FOR SELECT USING (true);`);
        await client.query(`CREATE POLICY "Public insert on ${t}" ON public.${t} FOR INSERT WITH CHECK (true);`);
        await client.query(`CREATE POLICY "Public update on ${t}" ON public.${t} FOR UPDATE USING (true);`);
        await client.query(`CREATE POLICY "Public delete on ${t}" ON public.${t} FOR DELETE USING (true);`);

        // Grant permissions to anon and authenticated roles
        await client.query(`GRANT ALL ON public.${t} TO anon, authenticated, service_role;`);
        console.log(`✅ Granted full public permissions & policies on ${t}`);
      } else {
        console.log(`Table public.${t} does not exist yet.`);
      }
    }

    // Now update Taspia's model with the real uploaded video URL!
    const videoUrl = 'https://sfnyuzemaqplpdeedsgg.supabase.co/storage/v1/object/public/reels/taspia_reel_1791116816832.mp4';
    const taspiaGallery = [
      {
        type: 'video',
        url: videoUrl,
        thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      }
    ];

    // Find Taspia's id in models
    const taspiaRes = await client.query("SELECT id, name FROM public.models WHERE name ILIKE '%Taspia%';");
    if (taspiaRes.rows.length > 0) {
      const tId = taspiaRes.rows[0].id;
      await client.query("UPDATE public.models SET gallery = $1 WHERE id = $2;", [JSON.stringify(taspiaGallery), tId]);
      console.log(`\n✅ Updated Taspia (${tId}) video in PG with real URL: ${videoUrl}`);
    }

    await client.end();
    console.log('\nAll Supabase database permissions and data successfully synchronized!');
  } catch(e) {
    console.error('RLS setup error:', e);
    try { await client.end(); } catch(err) {}
  }
}

fixAllTableRLSPolicies();
