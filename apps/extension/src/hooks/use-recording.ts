import { useState, useEffect, useCallback } from 'react';
import { checkMicrophonePermission, checkTabRecordable } from '@/lib/utils';

interface RecordingState {
  isRecording: boolean;
  isLoading: boolean;
  error: string | null;
  canRecord: boolean;
}

interface PopupMessage {
  target: string;
  type: string;
  error?: string;
}

export function useRecording() {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isLoading: true,
    error: null,
    canRecord: false,
  });

  // Check recording state on mount
  useEffect(function () {
    async function checkRecordingState() {
      const hasPermission = await checkMicrophonePermission();

      if (!hasPermission) {
        // Open permission page in new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('tabs/permission.html') });
        setState((prev) => ({ ...prev, isLoading: false, canRecord: false }));
        return;
      }

      const canRecord = await checkTabRecordable();

      // Check if offscreen document is recording
      const contexts = await chrome.runtime.getContexts({});
      const offscreenDocument = contexts.find(
        (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
      );

      const isRecording = Boolean(
        offscreenDocument && offscreenDocument.documentUrl?.endsWith('#recording')
      );

      setState({
        isRecording,
        isLoading: false,
        error: null,
        canRecord,
      });
    };

    checkRecordingState();
  }, [checkMicrophonePermission, checkTabRecordable]);

  // Listen for messages from offscreen document
  useEffect(function () {
    function handleMessage(message: PopupMessage) {
      if (message.target === 'popup') {
        switch (message.type) {
          case 'recording-error':
            setState((prev) => ({
              ...prev,
              isRecording: false,
              isLoading: false,
              error: message.error || 'Unknown error occurred',
            }));
            break;
          case 'recording-stopped':
            setState((prev) => ({
              ...prev,
              isRecording: false,
              isLoading: false,
            }));
            break;
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  // Start recording
  const startRecording = useCallback(async function () {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

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
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Cannot record this tab. Please open a Google Meet or Zoom meeting tab.',
        }));
        return;
      }

      // Create offscreen document if not exists
      const contexts = await chrome.runtime.getContexts({});
      const offscreenDocument = contexts.find(
        (c) => c.contextType === 'OFFSCREEN_DOCUMENT'
      );

      if (!offscreenDocument) {
        await chrome.offscreen.createDocument({
          url: chrome.runtime.getURL('assets/offscreen.html'),
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

      //create meeting in database
      const response = await fetch(`${process.env.PLASMO_PUBLIC_BACKEND_URL}/api/meeting/create`, {
        method: 'POST'
      });
      const result = await response.json();
      if (!result.success) throw new Error('Error creating meeting in backend.');

      chrome.runtime.sendMessage({
        type: 'start-recording',
        target: 'offscreen',
        data: streamId,
      });

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(function () {
    setState((prev) => ({ ...prev, isLoading: true }));

    chrome.runtime.sendMessage({
      type: 'stop-recording',
      target: 'offscreen',
    });

    // Give a small delay for visual feedback
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isRecording: false,
        isLoading: false,
      }));
    }, 500);
  }, []);

  // Clear error
  const clearError = useCallback(function () {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Refresh tab status
  const refreshTabStatus = useCallback(async function () {
    const canRecord = await checkTabRecordable();
    setState((prev) => ({ ...prev, canRecord }));
  }, [checkTabRecordable]);

  return {
    ...state,
    startRecording,
    stopRecording,
    clearError,
    refreshTabStatus,
  };
}
