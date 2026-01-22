import {
  type ClientMessage,
  type ServerMessage,
  ServerMessageSchema,
  AUDIO_STREAM_CONFIG,
} from '@workspace/contracts';

interface OffscreenMessage {
  target: string;
  type: string;
  data?: string;
}

interface ChromeTabAudioConstraints {
  audio: {
    mandatory: {
      chromeMediaSource: string;
      chromeMediaSourceId: string;
    };
  };
  video: boolean;
}

const WEBSOCKET_URL = `ws://localhost:${AUDIO_STREAM_CONFIG.WEBSOCKET_PORT}`;

let recorder: MediaRecorder | undefined;
let activeStreams: MediaStream[] = [];
let websocket: WebSocket | undefined;
let sessionId: string | undefined;

chrome.runtime.onMessage.addListener(
  async (message: OffscreenMessage): Promise<void> => {
    if (message.target === 'offscreen') {
      switch (message.type) {
        case 'start-recording':
          if (message.data) {
            await startRecording(message.data);
          }
          break;
        case 'stop-recording':
          await stopRecording();
          break;
        default:
          throw new Error(`Unrecognized message: ${message.type}`);
      }
    }
  }
);

function connectWebSocket(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = (): void => {
      console.log('WebSocket connected');
      resolve(ws);
    };

    ws.onerror = (error): void => {
      console.error('WebSocket error:', error);
      reject(new Error('Failed to connect to WebSocket server'));
    };

    ws.onmessage = (event): void => {
      try {
        const rawData = JSON.parse(event.data);
        const result = ServerMessageSchema.safeParse(rawData);

        if (result.success) {
          handleWebSocketMessage(result.data);
        } else {
          console.error('Invalid message format from server:', result.error);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = (): void => {
      console.log('WebSocket disconnected');
      websocket = undefined;
    };
  });
}

function handleWebSocketMessage(message: ServerMessage): void {
  switch (message.type) {
    case 'session-started':
      sessionId = message.sessionId;
      console.log(`Recording session started: ${sessionId}`);
      break;
    case 'session-stopped':
      console.log(
        `Recording session stopped: ${message.sessionId} | Chunks: ${message.chunkCount} | Duration: ${message.duration}s`
      );
      sessionId = undefined;
      break;
  }
}

async function startRecording(streamId: string): Promise<void> {
  if (recorder?.state === 'recording') {
    throw new Error('Called startRecording while recording is in progress.');
  }

  await stopAllStreams();

  try {
    // Connect to WebSocket server first
    websocket = await connectWebSocket();

    // Start a new recording session
    const startMessage: ClientMessage = { type: 'start-session' };
    websocket.send(JSON.stringify(startMessage));

    // Get tab audio stream
    const tabConstraints: ChromeTabAudioConstraints = {
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId,
        },
      },
      video: false,
    };
    const tabStream = await navigator.mediaDevices.getUserMedia(
      tabConstraints as unknown as MediaStreamConstraints
    );

    // Get microphone stream with noise cancellation
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });

    activeStreams.push(tabStream, micStream);

    // Create audio context
    const audioContext = new AudioContext();

    // Create sources and destination
    const tabSource = audioContext.createMediaStreamSource(tabStream);
    const micSource = audioContext.createMediaStreamSource(micStream);
    const destination = audioContext.createMediaStreamDestination();

    // Create gain nodes
    const tabGain = audioContext.createGain();
    const micGain = audioContext.createGain();

    // Set gain values
    tabGain.gain.value = 1.0; // Normal tab volume
    micGain.gain.value = 1.5; // Slightly boosted mic volume

    // Connect tab audio to both speakers and recorder
    tabSource.connect(tabGain);
    tabGain.connect(audioContext.destination);
    tabGain.connect(destination);

    // Connect mic to recorder only (prevents echo)
    micSource.connect(micGain);
    micGain.connect(destination);

    // Start recording with streaming
    recorder = new MediaRecorder(destination.stream, {
      mimeType: AUDIO_STREAM_CONFIG.MIME_TYPE,
    });

    // Send each audio chunk to WebSocket server
    recorder.ondataavailable = (event: BlobEvent): void => {
      if (event.data.size > 0 && websocket?.readyState === WebSocket.OPEN) {
        event.data.arrayBuffer().then((buffer) => {
          websocket?.send(buffer);
        });
      }
    };

    recorder.onstop = (): void => {
      // Send stop-session message
      if (websocket?.readyState === WebSocket.OPEN) {
        const stopMessage: ClientMessage = { type: 'stop-session' };
        websocket.send(JSON.stringify(stopMessage));
      }

      recorder = undefined;

      chrome.runtime.sendMessage({
        type: 'recording-stopped',
        target: 'service-worker',
      });
    };

    // Start recording with timeslice to get regular chunks
    recorder.start(AUDIO_STREAM_CONFIG.CHUNK_INTERVAL_MS);
    window.location.hash = 'recording';

    console.log(`Recording started, streaming to ${WEBSOCKET_URL}`);
  } catch (error) {
    console.error('Error starting recording:', error);

    // Close WebSocket if recording fails
    if (websocket) {
      websocket.close();
      websocket = undefined;
    }

    chrome.runtime.sendMessage({
      type: 'recording-error',
      target: 'popup',
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error while starting recording',
    });
  }
}

async function stopRecording(): Promise<void> {
  if (recorder && recorder.state === 'recording') {
    recorder.stop();
  }

  await stopAllStreams();
  window.location.hash = '';

  // Close WebSocket connection after a short delay to ensure final messages are sent
  setTimeout(() => {
    if (websocket) {
      websocket.close();
      websocket = undefined;
    }
  }, 1000);
}

async function stopAllStreams(): Promise<void> {
  activeStreams.forEach((stream: MediaStream): void => {
    stream.getTracks().forEach((track: MediaStreamTrack): void => {
      track.stop();
    });
  });

  activeStreams = [];
  await new Promise<void>((resolve) => setTimeout(resolve, 100));
}
