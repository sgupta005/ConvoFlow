'use client';

import { Badge } from "@workspace/ui/components/badge";
import { Prisma } from "@workspace/db";
import { cn } from "@workspace/ui/lib/utils";
import { formatTimestamp } from "@/lib/utils";

interface TranscriptSegmentProps {
  segment: Prisma.TranscriptSegmentGetPayload<{}>;
  index: number;
  isMeetingLive: boolean;
  isLastSegment: boolean;
}

export function TranscriptSegment({ segment, index, isMeetingLive, isLastSegment }: TranscriptSegmentProps) {
  return (
    <div className="group relative">
      {/* Connecting line */}
      <div className="absolute left-3 top-8 bottom-0 w-px bg-border group-last:hidden" />

      <div className="flex gap-4 py-3 transition-colors hover:bg-muted/30 rounded-lg px-2 -mx-2">
        {/* Timeline dot with timestamp */}
        <div className="flex flex-col items-center gap-1 pt-1">
          {isMeetingLive && isLastSegment &&
            <span className="absolute size-8 rounded-full bg-primary/20 animate-ping" />
          }
          <div className={cn("size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative z-10")}>
            <div className={cn("size-2 rounded-full bg-primary")} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-normal px-2 py-0 h-5" suppressHydrationWarning>
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
