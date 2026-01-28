// IMPORTANT: Load env vars FIRST before any other imports otherwise prisma will throw errors
import './env.js';

import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { config } from './config.js';
import { ClientMessageSchema } from '@workspace/contracts';
import { initializeDeepgram } from './deepgram.js';
import {
  handleBinaryMessage,
  handleControlMessage,
  handleSocketClose,
  handleSocketError,
} from './handlers.js';
import { streamTranscriptHandler } from './transcript-stream.js';
import { authMiddleware } from './auth-middleware.js';

const deepgramApiKey = config.DEEPGRAM_API_KEY();
initializeDeepgram(deepgramApiKey);

// Create Express HTTP server for SSE endpoint
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: config.WEB_APP_URL || config.EXTENSION_URL,
  credentials: true, // Allow credentials (cookies) to be sent
}));
app.use(express.json());

// SSE endpoint for streaming transcripts (protected with auth)
app.get('/api/meeting/:meetingId/transcript/stream', streamTranscriptHandler);

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
