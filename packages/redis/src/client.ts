import { REDIS_URL } from './config';
import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export async function getRedis(): Promise<RedisClientType> {
  const newClient = createClient({ url: REDIS_URL });
  newClient.on('error', (e) => console.error('[redis] error', e));
  await newClient.connect();
  client = newClient as RedisClientType;
  return client;
}

export async function closeRedis() {
  if (client) {
    await client.quit();
    client = null;
  }
}

// Synchronous function to get Redis connection config for BullMQ
export function getRedisConnectionConfig() {
  return { url: REDIS_URL };
}
