import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://sfnyuzemaqplpdeedsgg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnl1emVtYXFwbHBkZWVkc2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE3ODEsImV4cCI6MjEwNjYwNzc4MX0.z3YtkhMBSQnMMdCWWCRrFAYn2Yv4bAQcyZ3NGFZOlyw';

export async function GET(request: Request) {
  return handleKeepAlive(request);
}

export async function POST(request: Request) {
  return handleKeepAlive(request);
}

async function handleKeepAlive(request: Request) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const report: {
    success: boolean;
    timestamp: string;
    durationMs: number;
    operations: {
      write: { table: string; status: string; error?: string };
      read: { table: string; status: string; count?: number; error?: string };
    };
    message: string;
  } = {
    success: true,
    timestamp,
    durationMs: 0,
    operations: {
      write: { table: 'keep_alive_logs', status: 'pending' },
      read: { table: 'models', status: 'pending' }
    },
    message: ''
  };

  // 1. Database WRITE Operation (Primary: keep_alive_logs, Fallback: reviews ping)
  try {
    const { error: logErr } = await supabase.from('keep_alive_logs').insert([
      {
        pinged_at: timestamp,
        source: 'vercel_cron_keep_alive',
        status: 'active',
        meta: {
          userAgent: request.headers.get('user-agent') || 'cron-bot',
          referer: request.headers.get('referer') || 'none'
        }
      }
    ]);

    if (!logErr) {
      report.operations.write = { table: 'keep_alive_logs', status: 'success' };
    } else {
      // Fallback: If table not yet migrated, write a keep-alive ping to reviews table
      const { error: fbErr } = await supabase.from('reviews').upsert(
        [
          {
            id: 'keep_alive_ping',
            name: 'keep_alive_pulse',
            brand: 'system',
            rating: 5,
            comment: `Keep-alive pulse at ${timestamp}`
          }
        ],
        { onConflict: 'id' }
      );

      if (!fbErr) {
        report.operations.write = {
          table: 'reviews (fallback)',
          status: 'success'
        };
      } else {
        report.operations.write = {
          table: 'keep_alive_logs',
          status: 'failed',
          error: logErr.message || fbErr.message
        };
      }
    }
  } catch (err: any) {
    report.operations.write = {
      table: 'keep_alive_logs',
      status: 'error',
      error: err.message
    };
  }

  // 2. Database READ Operation
  try {
    const { data: readData, error: readErr } = await supabase
      .from('models')
      .select('id, name')
      .limit(1);

    if (!readErr && readData) {
      report.operations.read = {
        table: 'models',
        status: 'success',
        count: readData.length
      };
    } else {
      report.operations.read = {
        table: 'models',
        status: 'failed',
        error: readErr?.message
      };
    }
  } catch (err: any) {
    report.operations.read = {
      table: 'models',
      status: 'error',
      error: err.message
    };
  }

  report.durationMs = Date.now() - startTime;
  report.success = report.operations.write.status === 'success' || report.operations.read.status === 'success';
  report.message = report.success
    ? 'Supabase Keep-Alive Pulse successful! Database activity refreshed.'
    : 'Keep-alive pulse encountered errors.';

  return new Response(JSON.stringify(report, null, 2), {
    status: report.success ? 200 : 500,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
