'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Prisma } from '@workspace/db';
import { TranscriptSegment } from './transcript-segment';
import { MeetingPageHeader } from '@/features/meetings/components/meeting-page-header';

export function TranscriptView({ meeting, sessionToken }: {
  meeting: Prisma.MeetingGetPayload<{ include: { transcriptSegments: true } }>;
  sessionToken?: string;
}) {
  const [segments, setSegments] = useState(meeting.transcriptSegments);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(function () {
    if (!meeting.is_live || !sessionToken) {
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meeting/${meeting.id}/transcript/stream?token=${sessionToken}`;
    const es = new EventSource(url);

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
  }, [meeting, sessionToken])

  useEffect(() => scrollToBottom(), [segments.length])

  function scrollToBottom() {
    if (transcriptContainerRef.current)
      transcriptContainerRef.current.scrollIntoView(false);
  }

  return (
    <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
      <MeetingPageHeader
        title={meeting.title}
        subtitle="View your Meeting's Transcript"
        date={meeting.startTime ?? meeting.createdAt}
      />
      {segments.length === 0 ? (
        <div className="flex flex-col gap-4 items-center justify-center h-[calc(100dvh-240px)] bg-card shadow-sm border rounded-lg">
          <FileText className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No transcript found</p>
        </div>
      ) :
        <ScrollArea className="h-[calc(100dvh-240px)] bg-card shadow-sm border rounded-lg">
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
