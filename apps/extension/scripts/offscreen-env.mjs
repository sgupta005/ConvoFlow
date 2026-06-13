import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

/**
 * Minimal dotenv parser: KEY=value, KEY='value', KEY="value".
 */
function parseEnvFile(filePath) {
  const env = {};
  if (!existsSync(filePath)) return env;

  for (const rawLine of readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eq = line.indexOf('=');
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

/**
 * Builds an esbuild `define` map for PLASMO_PUBLIC_* vars so the offscreen
 * bundle (built outside Plasmo) sees the same env as the Plasmo build.
 *
 * Precedence (low -> high): .env, .env.<mode>, real process.env.
 */
export function buildOffscreenDefine(mode = process.env.NODE_ENV || 'production') {
  const merged = {
    ...parseEnvFile(resolve(rootDir, '.env')),
    ...parseEnvFile(resolve(rootDir, `.env.${mode}`)),
  };

  // Real environment variables win over the files.
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('PLASMO_PUBLIC_') && value !== undefined) {
      merged[key] = value;
    }
  }

  const define = {};
  for (const [key, value] of Object.entries(merged)) {
    if (key.startsWith('PLASMO_PUBLIC_')) {
      define[`process.env.${key}`] = JSON.stringify(value);
    }
  }
  return define;
}
