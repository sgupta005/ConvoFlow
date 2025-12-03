export type MeetingPlatform = 'google-meet' | 'zoom' | null;

export interface MeetingInfo {
  platform: MeetingPlatform;
  meetingId: string | null;
  url: string;
  title: string;
  // isActive: boolean;
}

export interface RecordingSession {
  tabId: number;
  startTime: number;
  platform: string;
  meetingId: string | null;
}

export interface MeetingState {
  isActive: boolean;
  platform: MeetingPlatform;
  meetingId: string | null;
  tabId: number | null;
  isRecording: boolean;
}

export interface ExtensionState extends MeetingState {
  session: RecordingSession | null;
}

// Message Types
export type MessageType =
  | 'MEETING_STATUS'
  | 'GET_STATE'
  | 'GET_MEETING_INFO'
  | 'START_RECORDING'
  | 'STOP_RECORDING'
  | 'PING';

export interface BaseMessage {
  type: MessageType;
}

export interface MeetingStatusMessage extends BaseMessage {
  type: 'MEETING_STATUS';
  payload: MeetingInfo & { timestamp: number };
}

export interface GetStateMessage extends BaseMessage {
  type: 'GET_STATE';
}

export interface GetMeetingInfoMessage extends BaseMessage {
  type: 'GET_MEETING_INFO';
}

export interface StartRecordingMessage extends BaseMessage {
  type: 'START_RECORDING';
  tabId: number;
}

export interface StopRecordingMessage extends BaseMessage {
  type: 'STOP_RECORDING';
}

export interface PingMessage extends BaseMessage {
  type: 'PING';
}

export type ExtensionMessage =
  | MeetingStatusMessage
  | GetStateMessage
  | GetMeetingInfoMessage
  | StartRecordingMessage
  | StopRecordingMessage
  | PingMessage;

export interface ActionResult {
  success: boolean;
  error?: string;
}
