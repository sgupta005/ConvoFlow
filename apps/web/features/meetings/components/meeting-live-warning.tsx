'use client';

import { AlertTriangle, Radio } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert';

interface MeetingLiveWarningProps {
  variant?: 'summary' | 'action-items';
}

export function MeetingLiveWarning({ variant = 'summary' }: MeetingLiveWarningProps) {
  const content = variant === 'summary'
    ? {
      title: 'Meeting in Progress',
      description: 'This meeting is still ongoing. The summary will be available once the meeting ends.',
    }
    : {
      title: 'Meeting in Progress',
      description: 'This meeting is still ongoing. Action items will be available once the meeting ends.',
    };

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-[calc(100dvh-240px)] p-8">
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
        <div className="relative size-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
          <Radio className="size-7 text-amber-500" />
        </div>
      </div>

      <Alert variant="default" className="max-w-md border-amber-500/30 bg-amber-500/5">
        <AlertTriangle className="size-4 text-amber-500" />
        <AlertTitle className="text-amber-600 dark:text-amber-400">{content.title}</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          {content.description}
        </AlertDescription>
      </Alert>

      <p className="text-xs text-muted-foreground mt-2">
        You can view the live transcript while the meeting is in progress.
      </p>
    </div>
  );
}
