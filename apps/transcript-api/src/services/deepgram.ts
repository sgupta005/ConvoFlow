import {
  createClient,
  LiveTranscriptionEvents,
  type DeepgramClient,
  type LiveClient,
} from '@deepgram/sdk';
import type { WebSocket } from 'ws';
import type { ServerMessage } from '@workspace/contracts';
import type { Session, DeepgramTranscriptData } from '../lib/types.js';
import { createTranscriptSegment } from '@workspace/db';

let deepgramClient: DeepgramClient;

export function initializeDeepgram(apiKey: string): void {
  deepgramClient = createClient(apiKey);
}

export function createDeepgramConnection(): LiveClient {
  return deepgramClient.listen.live({
    model: 'nova-3',
    language: 'en-US',
    smart_format: true,
    punctuate: true,
    interim_results: true,
    // diarize: true,
  });
}

interface DeepgramHandlerContext {
  session: Session;
  sessionId: string;
  meetingId: string;
  socket: WebSocket;
}

export function setupDeepgramHandlers(ctx: DeepgramHandlerContext): void {
  const { session, sessionId, meetingId, socket } = ctx;
  const { deepgramConnection } = session;

  deepgramConnection.on(LiveTranscriptionEvents.Open, () => {
    console.log(`Deepgram connection opened for session: ${sessionId}`);
    session.isDeepgramReady = true;

    // Send any pending chunks
    for (const chunk of session.pendingChunks) {
      deepgramConnection.send(chunk);
    }
    session.pendingChunks = [];
  });

  deepgramConnection.on(
    LiveTranscriptionEvents.Transcript,
    async (data: DeepgramTranscriptData) => {
      const transcript = data.channel?.alternatives?.[0]?.transcript;

      if (transcript && transcript.trim().length > 0) {
        const timestamp = new Date();
        const isFinal = data.is_final || false;

        // Save transcript segment to database
        try {
          console.log('SAVING TO DB')
          await createTranscriptSegment({
            meetingId,
            text: transcript,
            timestamp,
            isFinal,
          });

          console.log(`[${sessionId}] Saved transcript: ${transcript}`);

          // Send transcript to client in real-time
          const response: ServerMessage = {
            type: 'transcript',
            sessionId,
            text: transcript,
            isFinal,
          };
          socket.send(JSON.stringify(response));
        } catch (error) {
          console.error(`Error saving transcript segment:`, error);
        }
      }
    }
  );

  deepgramConnection.on(LiveTranscriptionEvents.Error, (error) => {
    console.error(`Deepgram error for session ${sessionId}:`, error);
  });

  deepgramConnection.on(LiveTranscriptionEvents.Close, () => {
    console.log(`Deepgram connection closed for session: ${sessionId}`);
  });
}

export function sendAudioToDeepgram(
  session: Session,
  audioData: ArrayBuffer
): void {
  if (session.isDeepgramReady) {
    session.deepgramConnection.send(audioData);
  } else {
    // Queue chunks until Deepgram connection is ready
    session.pendingChunks.push(audioData);
  }
}

export function closeDeepgramConnection(session: Session): void {
  try {
    session.deepgramConnection.requestClose();
  } catch (error) {
    console.error('Error closing Deepgram connection:', error);
  }
}
