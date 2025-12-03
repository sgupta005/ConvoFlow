/**
 * Background Service Worker
 * Handles the recording and storage of meeting sessions
 */

import { MeetingState, RecordingSession } from './types';

// Global state
let meetingState: MeetingState = {
  isActive: false,
  platform: null,
  meetingId: null,
  tabId: null,
  isRecording: false,
};

let currentSession: RecordingSession | null = null;

async function updateBadge(): Promise<void> {
  if (meetingState.isRecording) {
    await chrome.action.setBadgeText({ text: 'REC' });
    await chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
  } else if (meetingState.isActive) {
    await chrome.action.setBadgeText({ text: '●' });
    await chrome.action.setBadgeBackgroundColor({ color: '#22c55e' });
  } else {
    await chrome.action.setBadgeText({ text: '' });
  }
}

async function startRecording(
  tabId: number
): Promise<{ success: boolean; error?: string }> {
  if (meetingState.isRecording) {
    return { success: false, error: 'Already recording' };
  }

  if (!meetingState.isActive) {
    return { success: false, error: 'No active meeting detected' };
  }

  try {
    // Store session info
    currentSession = {
      tabId,
      startTime: Date.now(),
      platform: meetingState.platform || 'unknown',
      meetingId: meetingState.meetingId,
    };

    meetingState.isRecording = true;
    meetingState.tabId = tabId;

    await updateBadge();

    // Store state in chrome.storage for persistence
    await chrome.storage.local.set({
      recording: true,
      session: currentSession,
    });

    console.log('[ConvoFlow] Recording started:', currentSession);

    return { success: true };
  } catch (error) {
    console.error('[ConvoFlow] Failed to start recording:', error);
    meetingState.isRecording = false;
    currentSession = null;
    return { success: false, error: String(error) };
  }
}

async function stopRecording(): Promise<{ success: boolean; error?: string }> {
  if (!meetingState.isRecording) {
    return { success: false, error: 'Not recording' };
  }

  try {
    const duration = currentSession ? Date.now() - currentSession.startTime : 0;

    console.log(
      '[ConvoFlow] Recording stopped. Duration:',
      Math.round(duration / 1000),
      'seconds'
    );

    meetingState.isRecording = false;
    currentSession = null;

    await updateBadge();

    await chrome.storage.local.set({
      recording: false,
      session: null,
    });

    return { success: true };
  } catch (error) {
    console.error('[ConvoFlow] Failed to stop recording:', error);
    return { success: false, error: String(error) };
  }
}

function getState(): MeetingState & { session: RecordingSession | null } {
  return {
    ...meetingState,
    session: currentSession,
  };
}

//Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[ConvoFlow] Message received:', message.type);

  switch (message.type) {
    case 'MEETING_STATUS':
      // Update from content script about meeting state
      meetingState.isActive = message.payload.isActive;
      meetingState.platform = message.payload.platform;
      meetingState.meetingId = message.payload.meetingId;
      if (sender.tab?.id) {
        meetingState.tabId = sender.tab.id;
      }
      updateBadge();
      sendResponse({ received: true });
      break;

    case 'GET_STATE':
      sendResponse(getState());
      break;

    case 'START_RECORDING':
      startRecording(message.tabId).then(sendResponse);
      return true; // Keep channel open for async response

    case 'STOP_RECORDING':
      stopRecording().then(sendResponse);
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
  }

  return false;
});

//Handle tab updates - detect when user navigates away from meeting
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (meetingState.tabId === tabId && changeInfo.url) {
    // Check if still on a meeting page
    const url = changeInfo.url;
    const isStillMeeting =
      url.includes('meet.google.com') ||
      url.includes('zoom.us/j/') ||
      url.includes('zoom.us/wc/');

    if (!isStillMeeting && meetingState.isRecording) {
      console.log('[ConvoFlow] User left meeting page, stopping recording');
      stopRecording();
    }
  }
});

// Handle tab close - stop recording if meeting tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (meetingState.tabId === tabId && meetingState.isRecording) {
    console.log('[ConvoFlow] Meeting tab closed, stopping recording');
    stopRecording();
  }
});

// Initialize on service worker start
async function initialize(): Promise<void> {
  console.log('[ConvoFlow] Background service worker started');

  // Restore state from storage
  const stored = await chrome.storage.local.get(['recording', 'session']);

  if (stored.recording && stored.session) {
    // Verify the tab still exists
    try {
      const tab = await chrome.tabs.get(stored.session.tabId);
      if (tab) {
        currentSession = stored.session;
        meetingState.isRecording = true;
        meetingState.tabId = stored.session.tabId;
        console.log('[ConvoFlow] Restored recording session');
      }
    } catch {
      // Tab no longer exists, clear session
      await chrome.storage.local.set({ recording: false, session: null });
    }
  }

  await updateBadge();
}

initialize();
