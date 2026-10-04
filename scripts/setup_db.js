const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ca-central-1',
  'sa-east-1',
  'me-central-1'
];

async function tryConnect() {
  const projectRef = 'sfnyuzemaqplpdeedsgg';
  const password = 'Aktmtbar@1mzs';

  for (const reg of regions) {
    const host = `aws-0-${reg}.pooler.supabase.com`;
    process.stdout.write(`Testing region: ${reg} (${host})... `);

    const client = new Client({
      host: host,
      port: 6543, // Session mode or 5432 transaction mode
      database: 'postgres',
      user: `postgres.${projectRef}`,
      password: password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000
    });

    try {
      await client.connect();
      console.log('SUCCESS!');
      console.log(`\n========================================`);
      console.log(`CONNECTED TO REGION: ${reg}`);
      console.log(`========================================\n`);

      const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase_setup.sql'), 'utf8');
      console.log('Executing database setup...');
      await client.query(sql);
      console.log('ALL TABLES CREATED SUCCESSFULLY!');

      const tablesRes = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
      console.log('\nVerified Public Tables in Supabase:');
      tablesRes.rows.forEach(r => console.log(' -> ' + r.table_name));

      await client.end();
      return true;
    } catch (err) {
      console.log(`FAILED (${err.message.split('\n')[0]})`);
      try { await client.end(); } catch(e) {}
    }
  }

  // Also try port 5432 for poolers
  for (const reg of regions) {
    const host = `aws-0-${reg}.pooler.supabase.com`;
    process.stdout.write(`Testing port 5432 on region: ${reg}... `);

    const client = new Client({
      host: host,
      port: 5432,
      database: 'postgres',
      user: `postgres.${projectRef}`,
      password: password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000
    });

    try {
      await client.connect();
      console.log('SUCCESS!');
      const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase_setup.sql'), 'utf8');
      await client.query(sql);
      console.log('ALL TABLES CREATED SUCCESSFULLY!');
      const tablesRes = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
      console.log('\nVerified Public Tables in Supabase:');
      tablesRes.rows.forEach(r => console.log(' -> ' + r.table_name));
      await client.end();
      return true;
    } catch (err) {
      console.log(`FAILED`);
      try { await client.end(); } catch(e) {}
    }
  }

  return false;
}

tryConnect().then(success => {
  if (success) {
    console.log('\n DATABASE SETUP IS 100% COMPLETE & VERIFIED!');
    process.exit(0);
  } else {
    console.log('\nCould not locate pooler region.');
    process.exit(1);
  }
});
