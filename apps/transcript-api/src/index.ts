// IMPORTANT: Load env vars FIRST before any other imports otherwise prisma will throw errors
import './env.js';

import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import { ClientMessageSchema } from '@workspace/contracts';
import { WEBSOCKET_PORT, HTTP_PORT, ensureTranscriptsDir, validateEnv } from './config.js';
import { initializeDeepgram } from './deepgram.js';
import {
  handleBinaryMessage,
  handleControlMessage,
  handleSocketClose,
  handleSocketError,
} from './handlers.js';
import { streamTranscriptHandler } from './transcript-stream.js';
import { authMiddleware } from './auth-middleware.js';
ensureTranscriptsDir();
const apiKey = validateEnv();
initializeDeepgram(apiKey);

// Create Express HTTP server for SSE endpoints
const app = express();

// Middleware
// app.use(cors({
//   origin: process.env.WEB_APP_URL || 'http://localhost:3000' || 'chrome-extension://fljdicobpfhohfcpmldbaemhadngokhd',
//   credentials: true, // Allow credentials (cookies) to be sent
// }));
// app.use(express.json());

// SSE endpoint for streaming transcripts (protected with auth)
app.get('/api/meeting/:meetingId/transcript/stream', streamTranscriptHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start HTTP server
app.listen(HTTP_PORT, () => {
  console.log(`HTTP server listening on port ${HTTP_PORT}`);
  console.log(`SSE endpoint: http://localhost:${HTTP_PORT}/api/meeting/:meetingId/transcript/stream`);
});

// Create WebSocket server for audio streaming
const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

wss.on('listening', () => {
  console.log(`WebSocket server listening on port ${WEBSOCKET_PORT}`);
});

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
