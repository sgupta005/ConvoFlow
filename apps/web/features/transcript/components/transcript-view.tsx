'use client';

import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Badge } from '@workspace/ui/components/badge';
import { formatTimestamp } from '@/lib/utils';
import { Separator } from '@workspace/ui/components/separator';
import { useEffect, useRef } from 'react';

// Types matching the TranscriptSegment schema
interface TranscriptSegment {
  id: string;
  meetingId: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
  speaker: string | null;
  createdAt: Date;
}

interface MeetingInfo {
  title: string;
  startTime: Date | null;
  endTime: Date | null;
}

// Dummy data for testing - NO SPEAKER DATA (typical case without diarization)
const dummyMeetingInfo: MeetingInfo = {
  title: 'Q1 Product Planning',
  startTime: new Date('2026-01-27T09:00:00'),
  endTime: new Date('2026-01-27T10:30:00'),
};

const dummyTranscriptSegments: TranscriptSegment[] = [
  {
    id: '1',
    meetingId: 'meeting-1',
    text: "Good morning everyone! Let's get started with our Q1 planning session. I hope you all had a chance to review the agenda I sent out earlier.",
    timestamp: new Date('2026-01-27T09:00:00'),
    isFinal: true,
    speaker: null,
    createdAt: new Date('2026-01-27T09:00:00'),
  },
  {
    id: '2',
    meetingId: 'meeting-1',
    text: "Yes, I've gone through it. I think we should prioritize the new dashboard features that our enterprise customers have been requesting.",
    timestamp: new Date('2026-01-27T09:01:30'),
    isFinal: true,
    speaker: null,
    createdAt: new Date('2026-01-27T09:01:30'),
  },
  {
    id: '3',
    meetingId: 'meeting-1',
    text: "Agreed. The analytics dashboard redesign has been on our backlog for two quarters now. We should definitely tackle that this time.",
    timestamp: new Date('2026-01-27T09:03:00'),
    isFinal: true,
    speaker: null,
    createdAt: new Date('2026-01-27T09:03:00'),
  },
  {
    id: '4',
    meetingId: 'meeting-1',
    text: "Before we dive into features, I'd like to discuss our technical debt. We have some infrastructure updates that could improve our deployment speed significantly.",
    timestamp: new Date('2026-01-27T09:05:15'),
    isFinal: true,
    speaker: null,
    createdAt: new Date('2026-01-27T09:05:15'),
  },
  {
    id: '5',
    meetingId: 'meeting-1',
    text: "That's a good point. Can you give us an estimate on how much time the infrastructure work would require?",
    timestamp: new Date('2026-01-27T09:07:00'),
    isFinal: true,
    speaker: null,
    createdAt: new Date('2026-01-27T09:07:00'),
  },
  {
    id: '6',
    meetingId: 'meeting-1',
    text: "Based on my assessment, we're looking at about three weeks for the migration to the new CI/CD pipeline, plus another week for testing and rollout.",
    timestamp: new Date('2026-01-27T09:08:30'),
    isFinal: true,
    speaker: null,
    createdAt: new Date('2026-01-27T09:08:30'),
  },
  {
    id: '7',
    meetingId: 'meeting-1',
    text: "That seems reasonable. We should factor that into our sprint planning. I suggest we allocate the first month to infrastructure and then move to feature development.",
    timestamp: new Date('2026-01-27T09:10:00'),
    isFinal: true,
    speaker: null,
    createdAt: new Date('2026-01-27T09:10:00'),
  },
  {
    id: '8',
    meetingId: 'meeting-1',
    text: "I've also prepared some mockups for the new dashboard. Should I share my screen to walk everyone through the designs?",
    timestamp: new Date('2026-01-27T09:12:45'),
    isFinal: true,
    speaker: 'Shivam Gupta',
    createdAt: new Date('2026-01-27T09:12:45'),
  },
  {
    id: '9',
    meetingId: 'meeting-1',
    text: "Yes please! I'm excited to see what you've come up with. The current dashboard has been getting a lot of feedback from users.",
    timestamp: new Date('2026-01-27T09:14:00'),
    isFinal: true,
    speaker: 'null',
    createdAt: new Date('2026-01-27T09:14:00'),
  },
  {
    id: '10',
    meetingId: 'meeting-1',
    text: "Perfect. So as you can see here, I've completely reimagined the layout. We now have a modular widget system that users can customize based on their needs.",
    timestamp: new Date('2026-01-27T09:15:30'),
    isFinal: true,
    speaker: null,
    createdAt: new Date('2026-01-27T09:15:30'),
  },
];

// Simple segment item for transcripts without speaker data
interface SimpleSegmentItemProps {
  segment: TranscriptSegment;
  index: number;
}

function SimpleSegmentItem({ segment, index }: SimpleSegmentItemProps) {
  return (
    <div className="group relative">
      {/* Connecting line */}
      <div className="absolute left-3 top-8 bottom-0 w-px bg-border group-last:hidden" />

      <div className="flex gap-4 py-3 transition-colors hover:bg-muted/30 rounded-lg px-2 -mx-2">
        {/* Timeline dot with timestamp */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <div className="size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative z-10">
            <div className="size-2 rounded-full bg-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5">
              {formatTimestamp(segment.timestamp)}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              #{index + 1}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {segment.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TranscriptView() {
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  const meeting = dummyMeetingInfo;
  const segments = dummyTranscriptSegments;

  function scrollToBottom() {
    if (transcriptContainerRef.current)
      transcriptContainerRef.current.scrollIntoView(false);
  }

  useEffect(() => scrollToBottom(), [])

  return (
    <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
      {/* Transcript Content */}
      <div className="flex items-start justify-between">
        <div className='flex flex-col gap-2'>
          <h1 className="text-2xl font-semibold tracking-tight">{meeting.title}</h1>
          <p className='text-muted-foreground text-sm'>View your Meeting's Transcript</p>
        </div>
        <Badge variant="secondary">
          {meeting.startTime?.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </Badge>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-240px)] bg-card shadow-sm border rounded-lg">
        <div className="space-y-0 p-8" ref={transcriptContainerRef}>
          {segments.map((segment, index) => (
            <SimpleSegmentItem
              key={segment.id}
              segment={segment}
              index={index}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
