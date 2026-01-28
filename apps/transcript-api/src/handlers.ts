import type { WebSocket } from 'ws';
import type { ClientMessage, ServerMessage } from '@workspace/contracts';
import type { Session } from './lib/types.js';
import {
  createDeepgramConnection,
  setupDeepgramHandlers,
  sendAudioToDeepgram,
} from './services/deepgram.js';
import {
  getSession,
  setSession,
  deleteSession,
  cleanupSession,
} from './lib/session.js';

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
      handleStartSession(socket, message.meetingId);
      break;
    case 'stop-session':
      handleStopSession(socket);
      break;
  }
}

function handleStartSession(
  socket: WebSocket,
  meetingId: string
): void {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const startTime = new Date();

  // Create Deepgram connection
  const deepgramConnection = createDeepgramConnection();

  const session: Session = {
    id: sessionId,
    meetingId,
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
    meetingId,
    socket,
  });

  setSession(socket, session);
  console.log(`Started session: ${sessionId} for meeting: ${meetingId}`);

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

    cleanupSession(session);

    console.log(
      `Stopped session: ${session.id} | Meeting: ${session.meetingId} | Duration: ${duration}s | Chunks: ${session.chunkCount}`
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
