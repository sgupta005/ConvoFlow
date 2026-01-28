'use client';

import { useEffect, useRef } from 'react';
import { Prisma } from '@workspace/db';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { TranscriptSegment } from './transcript-segment';

export function TranscriptView({ meeting }: { meeting: Prisma.MeetingGetPayload<{ include: { transcriptSegments: true } }> }) {
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  const segments = meeting.transcriptSegments;

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
          {(meeting.startTime ? meeting.startTime : meeting.createdAt).toLocaleDateString('en-US', {
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
          {segments.filter(segment => segment.isFinal).map((segment, index) =>
            <TranscriptSegment
              key={segment.id}
              segment={segment}
              index={index}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
