'use client';

import { useEffect } from 'react';

import { Prisma } from '@workspace/db';
import { ListTodo, RefreshCw } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';

import { MeetingPageHeader } from '@/features/meetings/components/meeting-page-header';
import { MeetingLiveWarning } from '@/features/meetings/components/meeting-live-warning';
import { GeneratingState } from '@/features/meetings/components/generating-state';
import { ActionItemCard } from './action-item-card';
import { useGenerate } from '@/hooks/useGenerate';

export function ActionItemsView({ meeting }: {
  meeting: Prisma.MeetingGetPayload<{ include: { actionItems: true } }>
}) {
  const { isGenerating, triggerGenerate } = useGenerate(meeting.id);

  useEffect(() => {
    if (meeting.is_live || meeting.actionItems.length > 0) return;
    triggerGenerate();
  }, []);

  const { actionItems } = meeting;
  const displayDate = meeting.startTime ?? meeting.createdAt;

  // Show live meeting warning
  if (meeting.is_live) {
    return (
      <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
        <MeetingLiveWarning variant="action-items" />
      </div>
    );
  }

  // Show generating state
  if (isGenerating) {
    return (
      <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
        <GeneratingState variant="action-items" />
      </div>
    );
  }

  // Show empty state if no action items
  if (actionItems.length === 0) {
    return (
      <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
        <div className="flex flex-col gap-4 items-center justify-center h-[calc(100dvh-240px)]">
          <ListTodo className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No action items found</p>
          <Button variant="outline" size="sm" className="mt-2">
            <RefreshCw className="size-4 mr-2" />
            Generate Action Items
          </Button>
        </div>
      </div>
    );
  }

  // Show action items list
  return (
    <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
      <MeetingPageHeader
        title={meeting.title}
        subtitle="View your Meeting's Action Items"
        date={displayDate}
      />
      <ScrollArea className="h-[calc(100dvh-300px)] bg-card shadow-sm border rounded-lg">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ListTodo className="size-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Action Items</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {actionItems.length} items
            </span>
          </div>

          <div className="space-y-0">
            {actionItems.map((item, index) => (
              <ActionItemCard key={item.id} actionItem={item} index={index} />
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={triggerGenerate}>
          <RefreshCw className="size-4 mr-2" />
          Regenerate Action Items
        </Button>
      </div>
    </div>
  );
}
