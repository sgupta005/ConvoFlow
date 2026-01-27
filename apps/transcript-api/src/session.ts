import type { WebSocket } from 'ws';
import type { Session } from './types.js';
import { closeDeepgramConnection } from './deepgram.js';

const sessions = new Map<WebSocket, Session>();

export function getSession(socket: WebSocket): Session | undefined {
  return sessions.get(socket);
}

export function setSession(socket: WebSocket, session: Session): void {
  sessions.set(socket, session);
}

export function deleteSession(socket: WebSocket): void {
  sessions.delete(socket);
}

export function cleanupSession(session: Session): void {
  // Close Deepgram connection
  closeDeepgramConnection(session);
}
