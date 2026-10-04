const { Client } = require('pg');

async function setupStorage() {
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

    // 1. Insert public buckets
    await client.query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES 
        ('models', 'models', true, 52428800, NULL),
        ('reels', 'reels', true, 104857600, NULL),
        ('media', 'media', true, 104857600, NULL)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);

    // 2. Add storage policies for anonymous upload, read, update, delete
    try {
      await client.query(`
        CREATE POLICY "Allow public read on all objects" ON storage.objects FOR SELECT USING (true);
      `);
    } catch(e) { console.log('Policy SELECT already exists or noted:', e.message); }

    try {
      await client.query(`
        CREATE POLICY "Allow public insert on all objects" ON storage.objects FOR INSERT WITH CHECK (true);
      `);
    } catch(e) { console.log('Policy INSERT already exists or noted:', e.message); }

    try {
      await client.query(`
        CREATE POLICY "Allow public update on all objects" ON storage.objects FOR UPDATE USING (true);
      `);
    } catch(e) { console.log('Policy UPDATE already exists or noted:', e.message); }

    try {
      await client.query(`
        CREATE POLICY "Allow public delete on all objects" ON storage.objects FOR DELETE USING (true);
      `);
    } catch(e) { console.log('Policy DELETE already exists or noted:', e.message); }

    const buckets = await client.query('SELECT id, name, public FROM storage.buckets;');
    console.log('\nActive Storage Buckets in Supabase:');
    buckets.rows.forEach(b => console.log(` - Bucket: ${b.name} (Public: ${b.public})`));

    await client.end();
  } catch (err) {
    console.error('Storage Setup Error:', err.message);
    try { await client.end(); } catch(e) {}
  }
}

setupStorage();
