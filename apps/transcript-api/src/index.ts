import { WebSocketServer, WebSocket } from 'ws';
import { createWriteStream, existsSync, mkdirSync, WriteStream } from 'fs';
import { join } from 'path';
import {
  ClientMessage,
  ClientMessageSchema,
  ServerMessage,
  AUDIO_STREAM_CONFIG,
} from '@workspace/contracts';

const PORT = AUDIO_STREAM_CONFIG.WEBSOCKET_PORT;
const RECORDINGS_DIR = join(process.cwd(), 'recordings');

// Ensure recordings directory exists
if (!existsSync(RECORDINGS_DIR)) {
  mkdirSync(RECORDINGS_DIR, { recursive: true });
  console.log(`Created recordings directory: ${RECORDINGS_DIR}`);
}

interface Session {
  id: string;
  writeStream: WriteStream;
  startTime: Date;
  chunkCount: number;
}

const sessions = new Map<WebSocket, Session>();

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message, isBinary) => {
    if (isBinary) {
      // Handle binary audio chunk
      const session = sessions.get(socket);
      if (session) {
        const buffer = message as Buffer;
        session.writeStream.write(buffer);
        session.chunkCount++;

        if (session.chunkCount % 10 === 0) {
          console.log(
            `Session ${session.id}: Received ${session.chunkCount} chunks`
          );
        }
      } else {
        console.warn('Received audio chunk without active session');
      }
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

  socket.on('close', () => {
    const session = sessions.get(socket);
    if (session) {
      session.writeStream.end();
      console.log(
        `Session ${session.id} closed. Total chunks: ${session.chunkCount}`
      );
      sessions.delete(socket);
    }
    console.log('Client disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
    const session = sessions.get(socket);
    if (session) {
      session.writeStream.end();
      sessions.delete(socket);
    }
  });
});

function handleControlMessage(socket: WebSocket, message: ClientMessage) {
  switch (message.type) {
    case 'start-session': {
      const sessionId =
        message.sessionId ||
        `recording-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const filename = `${sessionId}.${AUDIO_STREAM_CONFIG.MIME_TYPE.split('/')[1]}`;
      const filepath = join(RECORDINGS_DIR, filename);

      const writeStream = createWriteStream(filepath);
      const session: Session = {
        id: sessionId,
        writeStream,
        startTime: new Date(),
        chunkCount: 0,
      };

      sessions.set(socket, session);
      console.log(`Started session: ${sessionId}`);
      console.log(`Saving to: ${filepath}`);

      const response: ServerMessage = {
        type: 'session-started',
        sessionId,
      };
      socket.send(JSON.stringify(response));
      break;
    }

    case 'stop-session': {
      const session = sessions.get(socket);
      if (session) {
        session.writeStream.end();
        const duration =
          (new Date().getTime() - session.startTime.getTime()) / 1000;
        console.log(
          `Stopped session: ${session.id} | Duration: ${duration}s | Chunks: ${session.chunkCount}`
        );

        const response: ServerMessage = {
          type: 'session-stopped',
          sessionId: session.id,
          chunkCount: session.chunkCount,
          duration,
        };
        socket.send(JSON.stringify(response));

        sessions.delete(socket);
      }
      break;
    }
  }
}

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
console.log(`Recordings will be saved to: ${RECORDINGS_DIR}`);
