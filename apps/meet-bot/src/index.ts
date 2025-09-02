import { BotWorker } from './worker/botWorker';

async function main() {
  console.log('🚀 Starting ConvoFlow Meet Bot...');

  const botWorker = new BotWorker();
  botWorker.start();
}

main().catch((error) => {
  console.error('❌ Failed to start Meet Bot:', error);
});
