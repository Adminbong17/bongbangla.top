const { Client } = require('pg');

async function checkModelsTable() {
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
    const res = await client.query('SELECT id, name, image_url, gallery FROM public.models;');
    console.log('Total models in PG table:', res.rows.length);
    res.rows.forEach(r => {
      console.log('Model:', r.id, r.name);
      console.log(' - Image:', (r.image_url || '').substring(0, 80));
      console.log(' - Gallery:', JSON.stringify(r.gallery));
    });

    const policies = await client.query("SELECT * FROM pg_policies WHERE tablename = 'models';");
    console.log('\nModels Policies:', policies.rows.map(p => ({ policyname: p.policyname, cmd: p.cmd })));

    await client.end();
  } catch(e) {
    console.error('Error:', e);
    try { await client.end(); } catch(err) {}
  }
}

checkModelsTable();
