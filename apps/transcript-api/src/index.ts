import { WebSocketServer, WebSocket } from 'ws';
import { createWriteStream, existsSync, mkdirSync, WriteStream } from 'fs';
import { join } from 'path';

const PORT = 8080;
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
        const data = JSON.parse(message.toString());
        handleControlMessage(socket, data);
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

function handleControlMessage(
  socket: WebSocket,
  data: { type: string; sessionId?: string }
) {
  switch (data.type) {
    case 'start-session': {
      const sessionId =
        data.sessionId ||
        `recording-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const filename = `${sessionId}.webm`;
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

      socket.send(JSON.stringify({ type: 'session-started', sessionId }));
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

        socket.send(
          JSON.stringify({
            type: 'session-stopped',
            sessionId: session.id,
            chunkCount: session.chunkCount,
            duration,
          })
        );

        sessions.delete(socket);
      }
      break;
    }

    default:
      console.log('Unknown control message:', data);
  }
}

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
console.log(`Recordings will be saved to: ${RECORDINGS_DIR}`);
