/**
 * Popup Script
 * Handles UI interactions and communicates with background service worker
 */

import { ExtensionState } from '../types';

// DOM Elements
const statusDot = document.querySelector('.status-dot') as HTMLSpanElement;
const statusText = document.getElementById('status-text') as HTMLSpanElement;
const meetingInfo = document.getElementById('meeting-info') as HTMLDivElement;
const platformBadge = document.getElementById(
  'platform-badge'
) as HTMLDivElement;
const meetingIdEl = document.getElementById('meeting-id') as HTMLSpanElement;
const timerSection = document.getElementById('timer-section') as HTMLDivElement;
const timerDisplay = document.getElementById('timer-display') as HTMLDivElement;
const actionButton = document.getElementById(
  'action-button'
) as HTMLButtonElement;
const buttonText = document.getElementById('button-text') as HTMLSpanElement;
const iconRecord = document.querySelector('.icon-record') as SVGElement;
const iconStop = document.querySelector('.icon-stop') as SVGElement;
const instructions = document.getElementById('instructions') as HTMLDivElement;

let timerInterval: number | null = null;
let currentState: ExtensionState | null = null;

// Tailwind class mappings
const STATUS_DOT_BASE = 'w-2.5 h-2.5 rounded-full transition-all duration-200';
const STATUS_DOT_IDLE = 'bg-muted-foreground';
const STATUS_DOT_ACTIVE = 'bg-chart-1 shadow-[0_0_12px_rgba(34,197,94,0.5)]';
const STATUS_DOT_RECORDING = 'bg-destructive recording-pulse';

const PLATFORM_BADGE_BASE =
  'inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-full';
const PLATFORM_BADGE_MEET = 'bg-chart-1/15 text-chart-1';
const PLATFORM_BADGE_ZOOM = 'bg-chart-2/15 text-chart-2';

const BUTTON_BASE =
  'flex items-center justify-center gap-2.5 w-full py-3.5 px-5 text-[15px] font-semibold border-none rounded-xl cursor-pointer transition-all duration-200';
const BUTTON_DEFAULT =
  'text-primary-foreground bg-gradient-to-br from-primary to-chart-3 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg';
const BUTTON_RECORDING =
  'text-destructive-foreground bg-gradient-to-br from-destructive to-destructive/80 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg';
const BUTTON_DISABLED =
  'bg-muted text-muted-foreground cursor-not-allowed hover:translate-y-0 hover:shadow-none';

// Format seconds as MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer(startTime: number): void {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = formatTime(elapsed);
}

function startTimer(startTime: number): void {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  updateTimer(startTime);
  timerInterval = window.setInterval(() => {
    updateTimer(startTime);
  }, 1000);
}

function stopTimer(): void {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Update UI based on state
function updateUI(state: ExtensionState): void {
  currentState = state;

  // Update status indicator dot
  if (state.isRecording) {
    statusDot.className = `status-dot ${STATUS_DOT_BASE} ${STATUS_DOT_RECORDING}`;
    statusText.textContent = 'Recording...';
  } else if (state.isActive) {
    statusDot.className = `status-dot ${STATUS_DOT_BASE} ${STATUS_DOT_ACTIVE}`;
    statusText.textContent = 'Meeting Detected';
  } else {
    statusDot.className = `status-dot ${STATUS_DOT_BASE} ${STATUS_DOT_IDLE}`;
    statusText.textContent = 'No Meeting';
  }

  // Update meeting info visibility and content
  if (state.platform) {
    meetingInfo.classList.remove('hidden');
    meetingInfo.classList.add('flex');

    const platformClass =
      state.platform === 'google-meet'
        ? PLATFORM_BADGE_MEET
        : PLATFORM_BADGE_ZOOM;
    platformBadge.className = `${PLATFORM_BADGE_BASE} ${platformClass}`;
    platformBadge.textContent =
      state.platform === 'google-meet' ? 'Google Meet' : 'Zoom';
    meetingIdEl.textContent = state.meetingId || '';
  } else {
    meetingInfo.classList.add('hidden');
    meetingInfo.classList.remove('flex');
  }

  // Update timer section
  if (state.isRecording && state.session) {
    timerSection.classList.remove('hidden');
    timerSection.classList.add('flex');
    startTimer(state.session.startTime);
  } else {
    timerSection.classList.add('hidden');
    timerSection.classList.remove('flex');
    stopTimer();
    timerDisplay.textContent = '00:00';
  }

  // Update action button
  actionButton.disabled = !state.isActive;

  if (state.isRecording) {
    actionButton.className = `action-button ${BUTTON_BASE} ${BUTTON_RECORDING}`;
    buttonText.textContent = 'Stop Recording';
    iconRecord.classList.add('hidden');
    iconStop.classList.remove('hidden');
  } else if (state.isActive) {
    actionButton.className = `action-button ${BUTTON_BASE} ${BUTTON_DEFAULT}`;
    buttonText.textContent = 'Start Recording';
    iconRecord.classList.remove('hidden');
    iconStop.classList.add('hidden');
  } else {
    actionButton.className = `action-button ${BUTTON_BASE} ${BUTTON_DISABLED}`;
    buttonText.textContent = 'Start Recording';
    iconRecord.classList.remove('hidden');
    iconStop.classList.add('hidden');
  }

  // Update instructions visibility
  if (state.isActive) {
    instructions.classList.add('hidden');
  } else {
    instructions.classList.remove('hidden');
  }
}

async function getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Fetch state from background
async function fetchState(): Promise<void> {
  try {
    const state = await chrome.runtime.sendMessage({ type: 'GET_STATE' });

    // Also try to get meeting info from content script
    const tab = await getCurrentTab();
    if (tab?.id) {
      try {
        const meetingInfo = await chrome.tabs.sendMessage(tab.id, {
          type: 'GET_MEETING_INFO',
        });
        if (meetingInfo) {
          state.isActive = meetingInfo.isActive;
          state.platform = meetingInfo.platform;
          state.meetingId = meetingInfo.meetingId;
          state.tabId = tab.id;
        }
      } catch {
        // Content script not available on this tab
      }
    }

    updateUI(state);
  } catch (error) {
    console.error('[ConvoFlow] Failed to fetch state:', error);
  }
}

// Handle start/stop button click
async function handleActionClick(): Promise<void> {
  if (!currentState) return;

  actionButton.disabled = true;

  try {
    if (currentState.isRecording) {
      const result = await chrome.runtime.sendMessage({
        type: 'STOP_RECORDING',
      });
      if (!result.success) {
        console.error('[ConvoFlow] Failed to stop:', result.error);
      }
    } else {
      const tab = await getCurrentTab();
      if (!tab?.id) {
        console.error('[ConvoFlow] No active tab');
        return;
      }

      const result = await chrome.runtime.sendMessage({
        type: 'START_RECORDING',
        tabId: tab.id,
      });

      if (!result.success) {
        console.error('[ConvoFlow] Failed to start:', result.error);
      }
    }

    // Refresh state after action
    await fetchState();
  } finally {
    actionButton.disabled = false;
  }
}

// Initialize popup
async function init(): Promise<void> {
  // Add click handler
  actionButton.addEventListener('click', handleActionClick);

  // Fetch initial state
  await fetchState();

  // Poll for state updates
  setInterval(fetchState, 1000);
}

// Start
init();
