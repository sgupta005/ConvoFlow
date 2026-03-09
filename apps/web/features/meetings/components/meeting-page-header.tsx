'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';

interface MeetingPageHeaderProps {
  title: string;
  subtitle: string;
  date: Date;
}

export function MeetingPageHeader({ title, subtitle, date }: MeetingPageHeaderProps) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        <Badge variant="secondary" suppressHydrationWarning>
          {date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Badge>
      </div>
      <Separator />
    </>
  );
}
