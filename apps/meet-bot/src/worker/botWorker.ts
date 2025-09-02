import { makeBotWorker } from '@workspace/redis';
import { SpawnBotPayload } from '@workspace/contracts';
import { MeetService } from '../services/meetService';

export class BotWorker {
  private meetService: MeetService;

  constructor() {
    this.meetService = new MeetService();
  }

  async processSpawnBot(payload: SpawnBotPayload): Promise<void> {
    console.log(`Processing bot spawn for meeting: ${payload.meetingId}`);

    try {
      await this.meetService.joinGoogleMeet(payload.meetUrl, 'ConvoFlow Bot');

      console.log(`Bot successfully spawned for meeting: ${payload.meetingId}`);
    } catch (error) {
      console.error(
        `Failed to spawn bot for meeting ${payload.meetingId}:`,
        error
      );
      throw error;
    }
  }

  start(): void {
    const worker = makeBotWorker(this.processSpawnBot.bind(this));

    worker.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err.message);
    });

    worker.on('error', (err) => {
      console.error('Worker error:', err);
    });

    console.log('🤖 Bot worker started, waiting for jobs...');
  }
}
