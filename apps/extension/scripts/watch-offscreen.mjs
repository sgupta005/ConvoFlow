import { context } from 'esbuild';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

async function watchOffscreen() {
  try {
    const ctx = await context({
      entryPoints: [resolve(rootDir, 'src/offscreen/index.ts')],
      bundle: true,
      outfile: resolve(rootDir, 'assets/offscreen.js'),
      format: 'iife',
      target: 'chrome116',
      platform: 'browser',
      sourcemap: true,
    });

    await ctx.watch();
    console.log('👀 Watching offscreen script for changes...');
  } catch (error) {
    console.error('❌ Failed to start offscreen watcher:', error);
    process.exit(1);
  }
}

watchOffscreen();
