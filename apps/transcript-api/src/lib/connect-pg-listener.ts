import { Client } from 'pg';

let keepaliveInterval: NodeJS.Timeout | null = null;

export async function connectPgListener(clients: Map<string, Set<any>>) {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });

  pg.on("error", async (err) => {
    console.error('Postgres listener error:', err.message);
    // Clean up keepalive interval
    if (keepaliveInterval) {
      clearInterval(keepaliveInterval);
      keepaliveInterval = null;
    }
    // Attempt to reconnect after a delay
    console.log('Reconnecting to Postgres in 1 second...');
    setTimeout(connectPgListener, 1000);
  });

  pg.on("notification", msg => {
    console.log('Notification received:', msg.payload);
    const payload = JSON.parse(msg.payload!);

    const subs = clients.get(payload.meetingId);
    if (!subs) return;

    for (const res of subs) {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }
  });

  try {
    await pg.connect();
    await pg.query("LISTEN transcript_insert");
    console.log('Postgres LISTEN connection established');

    // Send keepalive query every 30 seconds to prevent Neon from closing the connection
    keepaliveInterval = setInterval(async () => {
      try {
        await pg.query('SELECT 1');
      } catch (err) {
        console.error('Keepalive query failed:', err);
      }
    }, 30000);
  } catch (err) {
    console.error('Failed to connect Postgres listener:', err);
    // Retry connection
    setTimeout(connectPgListener, 3000);
  }
}
