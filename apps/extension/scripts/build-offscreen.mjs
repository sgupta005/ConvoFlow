import { build } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { buildOffscreenDefine } from './offscreen-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

async function buildOffscreen() {
  try {
    await build({
      entryPoints: [resolve(rootDir, 'src/offscreen/index.ts')],
      bundle: true,
      outfile: resolve(rootDir, 'assets/offscreen.js'),
      format: 'iife',
      target: 'chrome116',
      platform: 'browser',
      minify: true,
      sourcemap: false,
      define: buildOffscreenDefine('production'),
    });
    console.log('✅ Offscreen script built successfully');
  } catch (error) {
    console.error('❌ Failed to build offscreen script:', error);
    process.exit(1);
  }
}

buildOffscreen();
