import { WebSocketServer } from 'ws';
import { ClientMessageSchema } from '@workspace/contracts';
import { PORT, ensureTranscriptsDir, validateEnv } from './config.js';
import { initializeDeepgram } from './deepgram.js';
import {
  handleBinaryMessage,
  handleControlMessage,
  handleSocketClose,
  handleSocketError,
} from './handlers.js';
import dotenv from 'dotenv';

dotenv.config();
ensureTranscriptsDir();
const apiKey = validateEnv();
initializeDeepgram(apiKey);

const wss = new WebSocketServer({ port: PORT });

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
