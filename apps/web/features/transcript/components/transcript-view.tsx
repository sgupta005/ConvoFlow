'use client';

import { useEffect, useRef, useState } from 'react';
import { Prisma } from '@workspace/db';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { TranscriptSegment } from './transcript-segment';
import { FileText } from 'lucide-react';

export function TranscriptView({ meeting }: { meeting: Prisma.MeetingGetPayload<{ include: { transcriptSegments: true } }> }) {
  const [segments, setSegments] = useState(meeting.transcriptSegments);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(function () {
    // Only connect to SSE endpoint if meeting is live
    if (!meeting.is_live) {
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meeting/${meeting.id}/transcript/stream`;
    const es = new EventSource(url, { withCredentials: true });

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSegments((prev) => {
        const lastSegment = prev.at(-1);
        if (lastSegment?.isFinal) {
          return [...prev, data]
        }
        return [...prev.slice(0, -1), data]
      })
    };

    es.onerror = (err) => {
      console.error("SSE error", err);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [meeting])

  useEffect(() => scrollToBottom(), [segments.length])

  function scrollToBottom() {
    if (transcriptContainerRef.current)
      transcriptContainerRef.current.scrollIntoView(false);
  }

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
      {segments.length === 0 ? (
        <div className="flex flex-col gap-4 items-center justify-center h-[calc(100vh-240px)] bg-card shadow-sm border rounded-lg">
          <FileText className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No transcript found</p>
        </div>
      ) :
        <ScrollArea className="h-[calc(100vh-240px)] bg-card shadow-sm border rounded-lg">
          <div className="space-y-0 p-8" ref={transcriptContainerRef}>
            {segments.filter((segment, index) => segment.isFinal || index === segments.length - 1).map((segment, index) =>
              <TranscriptSegment
                isMeetingLive={meeting.is_live}
                isLastSegment={segment.id === segments.at(-1)?.id}
                key={segment.id}
                segment={segment}
                index={index}
              />
            )}
          </div>
        </ScrollArea>
      }
    </div>
  );
}
