// IMPORTANT: Load env vars FIRST before any other imports otherwise prisma will throw errors
import './lib/env.js';

import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { config } from './lib/config.js';
import { ClientMessageSchema } from '@workspace/contracts';
import { initializeDeepgram } from './services/deepgram.js';
import {
  handleBinaryMessage,
  handleControlMessage,
  handleSocketClose,
  handleSocketError,
} from './handlers.js';
import { connectPgListener } from './lib/connect-pg-listener.js';
import { streamTranscriptController } from './controllers/stream-transcript.js';

const deepgramApiKey = config.DEEPGRAM_API_KEY();
initializeDeepgram(deepgramApiKey);

// Create Express HTTP server for SSE endpoint
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  credentials: true, // Allow credentials (cookies) to be sent
}));
app.use(express.json());

// Postgres notification listener for real-time transcript updates
const clients = new Map<string, Set<any>>(); // meetingId → responses
await connectPgListener(clients);

// SSE endpoint for streaming transcripts (unauthenticated)
app.get('/api/meeting/:meetingId/transcript/stream', streamTranscriptController(clients));

// Create WebSocket server for audio streaming
const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message, isBinary) => {
    if (isBinary) {
      handleBinaryMessage(socket, message as Buffer);
    } else {
      // Handle text message (control messages)
      try {
        const rawData = JSON.parse(message.toString());
        const result = ClientMessageSchema.safeParse(rawData);

        if (result.success) {
          handleControlMessage(socket, result.data);
        } else {
          console.error('Invalid message format:', result.error);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    }
  });

  socket.on('close', () => handleSocketClose(socket));
  socket.on('error', (error) => handleSocketError(socket, error));
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

server.listen(config.PORT, () => {
  console.log(`Transcript API Server running on port ${config.PORT}`);
})
