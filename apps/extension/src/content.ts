/**
 * Content Script
 * Notifies the background service worker of the meeting state
 */

import { MeetingInfo, MeetingPlatform } from './types';

function detectPlatform(): MeetingPlatform {
  const url = window.location.href;

  if (url.includes('meet.google.com')) {
    return 'google-meet';
  }

  if (url.includes('zoom.us/j/') || url.includes('zoom.us/wc/')) {
    return 'zoom';
  }

  return null;
}

function extractMeetingId(platform: MeetingPlatform): string | null {
  const url = window.location.href;

  if (platform === 'google-meet') {
    // Google Meet URLs: https://meet.google.com/xxx-yyyy-zzz
    const match = url.match(/meet\.google\.com\/([a-z]{3}-[a-z]{4}-[a-z]{3})/i);
    return match ? (match[1] ?? null) : null;
  }

  if (platform === 'zoom') {
    // Zoom URLs: https://zoom.us/j/1234567890 or https://zoom.us/wc/1234567890
    const match = url.match(/zoom\.us\/(?:j|wc)\/(\d+)/);
    return match ? (match[1] ?? null) : null;
  }

  return null;
}

// Check if we're in an active meeting (not just the landing page)
function isInActiveMeeting(platform: MeetingPlatform): boolean {
  if (platform === 'google-meet') {
    // Check if the meeting has started by looking for specific UI elements
    // The "Leave call" button or video elements indicate an active meeting
    const leaveButton = document.querySelector('[aria-label*="Leave"]');
    const videoElements = document.querySelectorAll('video');
    return !!(leaveButton || videoElements.length > 0);
  }

  if (platform === 'zoom') {
    // Check for Zoom meeting UI elements
    const meetingContainer = document.querySelector('.meeting-client');
    const videoContainer = document.querySelector('[class*="video-container"]');
    return !!(meetingContainer || videoContainer);
  }

  return false;
}

function getMeetingInfo(): MeetingInfo {
  const platform = detectPlatform();

  return {
    platform,
    meetingId: extractMeetingId(platform),
    url: window.location.href,
    title: document.title,
  };
}

// Send meeting status to background script
function notifyMeetingStatus(info: MeetingInfo, isActive: boolean): void {
  chrome.runtime
    .sendMessage({
      type: 'MEETING_STATUS',
      payload: {
        ...info,
        isActive,
        timestamp: Date.now(),
      },
    })
    .catch(() => {
      // Extension context may be invalidated, ignore
    });
}

// Observe DOM changes to detect when meeting becomes active
function observeMeetingState(): void {
  const platform = detectPlatform();
  let wasActive = false;

  const checkMeetingStatus = (): void => {
    const isActive = isInActiveMeeting(platform);
    const meetingInfo = getMeetingInfo();

    // Only notify on state changes
    if (isActive !== wasActive) {
      wasActive = isActive;
      notifyMeetingStatus(meetingInfo, isActive);
      console.log(
        `[ConvoFlow] Meeting ${isActive ? 'started' : 'ended'}:`,
        meetingInfo
      );
    }
  };

  // Initial check
  checkMeetingStatus();

  // Observe DOM changes
  const observer = new MutationObserver(() => {
    checkMeetingStatus();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also check periodically as a fallback
  setInterval(checkMeetingStatus, 2000);
}

//Handle messages from popup or background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_MEETING_INFO') {
    const info = getMeetingInfo();
    const isActive = isInActiveMeeting(info.platform);
    sendResponse({ ...info, isActive });
    return true;
  }

  if (message.type === 'PING') {
    sendResponse({ pong: true, timestamp: Date.now() });
    return true;
  }

  return false;
});

// Initialize when content script loads
console.log('[ConvoFlow] Content script loaded on:', window.location.href);
observeMeetingState();
