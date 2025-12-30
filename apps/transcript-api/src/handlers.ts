import type { WebSocket } from 'ws';
import { createWriteStream } from 'fs';
import { join } from 'path';
import type { ClientMessage, ServerMessage } from '@workspace/contracts';
import { TRANSCRIPTS_DIR } from './config.js';
import type { Session } from './types.js';
import {
  createDeepgramConnection,
  setupDeepgramHandlers,
  sendAudioToDeepgram,
} from './deepgram.js';
import {
  getSession,
  setSession,
  deleteSession,
  cleanupSession,
} from './session.js';

export function handleBinaryMessage(socket: WebSocket, data: Buffer): void {
  const session = getSession(socket);
  if (session) {
    session.chunkCount++;

    // Convert Buffer to ArrayBuffer for Deepgram
    const arrayBuffer = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    );
    sendAudioToDeepgram(session, arrayBuffer as ArrayBuffer);

  } else {
    console.warn('Received audio chunk without active session');
  }
}

export function handleControlMessage(
  socket: WebSocket,
  message: ClientMessage
): void {
  switch (message.type) {
    case 'start-session':
      handleStartSession(socket, message.sessionId);
      break;
    case 'stop-session':
      handleStopSession(socket);
      break;
  }
}

function handleStartSession(
  socket: WebSocket,
  providedSessionId?: string
): void {
  const sessionId =
    providedSessionId ||
    `transcript-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const filename = `${sessionId}.txt`;
  const filepath = join(TRANSCRIPTS_DIR, filename);

  // Create transcript file stream
  const transcriptStream = createWriteStream(filepath);

  // Write header to transcript file
  const startTime = new Date();
  transcriptStream.write(`Transcript Session: ${sessionId}\n`);
  transcriptStream.write(`Started: ${startTime.toISOString()}\n`);
  transcriptStream.write(`---\n\n`);

  // Create Deepgram connection
  const deepgramConnection = createDeepgramConnection();

  const session: Session = {
    id: sessionId,
    transcriptStream,
    deepgramConnection,
    startTime,
    chunkCount: 0,
    isDeepgramReady: false,
    pendingChunks: [],
  };

  // Set up Deepgram event handlers
  setupDeepgramHandlers({
    session,
    sessionId,
    transcriptStream,
    socket,
  });

  setSession(socket, session);
  console.log(`Started session: ${sessionId}`);
  console.log(`Saving transcript to: ${filepath}`);

  const response: ServerMessage = {
    type: 'session-started',
    sessionId,
  };
  socket.send(JSON.stringify(response));
}

function handleStopSession(socket: WebSocket): void {
  const session = getSession(socket);
  if (session) {
    const duration =
      (new Date().getTime() - session.startTime.getTime()) / 1000;

    // Write footer to transcript file
    session.transcriptStream.write(`\n---\n`);
    session.transcriptStream.write(`Ended: ${new Date().toISOString()}\n`);
    session.transcriptStream.write(`Duration: ${duration}s\n`);
    session.transcriptStream.write(
      `Total audio chunks: ${session.chunkCount}\n`
    );

    cleanupSession(session);

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

    deleteSession(socket);
  }
}

export function handleSocketClose(socket: WebSocket): void {
  const session = getSession(socket);
  if (session) {
    cleanupSession(session);
    console.log(
      `Session ${session.id} closed. Total chunks: ${session.chunkCount}`
    );
    deleteSession(socket);
  }
  console.log('Client disconnected');
}

export function handleSocketError(socket: WebSocket, error: Error): void {
  console.error('Socket error:', error);
  const session = getSession(socket);
  if (session) {
    cleanupSession(session);
    deleteSession(socket);
  }
}
