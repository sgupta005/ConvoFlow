# ConvoFlow Meet Bot

A worker application that consumes bot spawn jobs from the Redis queue and joins Google Meet meetings using Puppeteer.

## Features

- 🤖 Automated Google Meet bot that joins meetings
- 📝 Captions support for meeting transcription
- 🔄 Redis queue-based job processing
- 🎯 Headless browser automation with stealth mode

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the application:

```bash
npm run build
```

3. Run in development mode:

```bash
npm run dev
```

4. Run in production:

```bash
npm start
```

## How it works

1. The bot worker listens for `SpawnBotPayload` jobs from the Redis queue
2. When a job is received, it extracts the `meetUrl` from the payload
3. The bot uses Puppeteer to join the Google Meet session
4. It automatically enables captions and can capture meeting content
5. The bot maintains the connection throughout the meeting

## Job Payload Structure

```typescript
interface SpawnBotPayload {
  meetingId: string;
  meetUrl: string;
  requestedByUserId: string;
}
```

## Architecture

- `src/index.ts` - Main entry point that starts the worker
- `src/worker/botWorker.ts` - Worker that processes queue jobs
- `src/services/meetService.ts` - Google Meet automation logic

## Dependencies

- **puppeteer-extra**: Enhanced Puppeteer with plugin support
- **puppeteer-extra-plugin-stealth**: Stealth mode to avoid detection
- **@workspace/redis**: Redis queue integration
- **@workspace/contracts**: Shared type definitions
