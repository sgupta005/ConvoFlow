interface PopupMessage {
  target: string;
  type: string;
  error?: string;
}

// Get button elements
const startButton = document.getElementById('startRecord') as HTMLButtonElement;
const stopButton = document.getElementById('stopRecord') as HTMLButtonElement;

if (!startButton || !stopButton) {
  throw new Error('Start or stop button not found');
}

const permissionStatus = document.getElementById(
  'permissionStatus'
) as HTMLDivElement;

if (!permissionStatus) {
  throw new Error('Permission status element not found');
}

function showError(message: string): void {
  permissionStatus.textContent = message;
  permissionStatus.style.display = 'block';
}

function hideError(): void {
  permissionStatus.style.display = 'none';
}

async function checkMicrophonePermission(): Promise<boolean> {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (error) {
    return false;
  }
}

// Check recording state when popup opens
async function checkRecordingState(): Promise<void> {
  hideError();
  const hasPermission = await checkMicrophonePermission();
  if (!hasPermission) {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/permission.html') });
    return;
  }

  const contexts = await chrome.runtime.getContexts({});
  const offscreenDocument = contexts.find(
    (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
  );

  if (
    offscreenDocument &&
    offscreenDocument.documentUrl?.endsWith('#recording')
  ) {
    stopButton.style.display = 'block';
    setTimeout((): void => {
      stopButton.classList.add('visible');
    }, 10);
  } else {
    startButton.style.display = 'block';
    setTimeout((): void => {
      startButton.classList.add('visible');
    }, 10);
  }
}

// Call checkRecordingState when popup opens
document.addEventListener('DOMContentLoaded', checkRecordingState);

// Add button click listeners
startButton.addEventListener('click', async (): Promise<void> => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (
      !tab ||
      !tab.id ||
      (!tab.url?.includes('meet.google') && !tab.url?.includes('zoom'))
    ) {
      showError(
        'Cannot record this tab. Please open a Google Meet or Zoom meeting tab.'
      );
      return;
    }

    // Create offscreen document if not exists
    const contexts = await chrome.runtime.getContexts({});
    const offscreenDocument = contexts.find(
      (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
    );

    if (!offscreenDocument) {
      await chrome.offscreen.createDocument({
        url: chrome.runtime.getURL('src/offscreen.html'),
        reasons: [chrome.offscreen.Reason.USER_MEDIA],
        justification: 'Recording from chrome.tabCapture API',
      });
    }

    // Get stream ID and start recording
    const streamId = await new Promise<string>((resolve, reject) => {
      chrome.tabCapture.getMediaStreamId(
        {
          targetTabId: tab.id,
        },
        (streamId: string) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(streamId);
          }
        }
      );
    });

    chrome.runtime.sendMessage({
      type: 'start-recording',
      target: 'offscreen',
      data: streamId,
    });

    startButton.classList.remove('visible');
    setTimeout((): void => {
      startButton.style.display = 'none';
      stopButton.style.display = 'block';
      setTimeout((): void => {
        stopButton.classList.add('visible');
      }, 10);
    }, 300);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    alert('Failed to start recording: ' + errorMessage);
  }
});

stopButton.addEventListener('click', (): void => {
  setTimeout((): void => {
    chrome.runtime.sendMessage({
      type: 'stop-recording',
      target: 'offscreen',
    });
  }, 500);

  stopButton.classList.remove('visible');
  setTimeout((): void => {
    stopButton.style.display = 'none';
    startButton.style.display = 'block';
    setTimeout((): void => {
      startButton.classList.add('visible');
    }, 10);
  }, 300);
});

// Listen for messages from offscreen document and service worker
chrome.runtime.onMessage.addListener((message: PopupMessage): void => {
  if (message.target === 'popup') {
    switch (message.type) {
      case 'recording-error':
        if (message.error) {
          alert(message.error);
        }
        startButton.style.display = 'block';
        stopButton.style.display = 'none';
        break;
      case 'recording-stopped':
        startButton.style.display = 'block';
        stopButton.style.display = 'none';
        break;
    }
  }
});
