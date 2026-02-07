'use client';

import { useEffect } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, RefreshCw } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Prisma } from '@workspace/db';

import { MeetingPageHeader } from '@/features/meetings/components/meeting-page-header';
import { MeetingLiveWarning } from '@/features/meetings/components/meeting-live-warning';
import { GeneratingState } from '@/features/meetings/components/generating-state';
import { useGenerate } from '@/hooks/useGenerate';

export function SummaryView({ meeting }: {
  meeting: Prisma.MeetingGetPayload<{}>
}) {
  const { isGenerating, triggerGenerate } = useGenerate(meeting.id);

  // When there's no summary and not live, auto-start generation on mount
  useEffect(() => {
    if (meeting.is_live || meeting.summary) return;
    triggerGenerate();
  }, []);

  const displayDate = meeting.startTime ?? meeting.createdAt;

  // Show live meeting warning
  if (meeting.is_live) {
    return (
      <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
        <MeetingLiveWarning variant="summary" />
      </div>
    );
  }

  // Show generating state
  if (isGenerating) {
    return (
      <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
        <GeneratingState variant="summary" />
      </div>
    );
  }

  // Show empty state if no summary (e.g. generate failed or no transcript)
  if (!meeting.summary) {
    return (
      <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
        <div className="flex flex-col gap-4 items-center justify-center h-[calc(100dvh-240px)]">
          <FileText className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No summary available</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={triggerGenerate}>
            <RefreshCw className="size-4 mr-2" />
            Generate Summary
          </Button>
        </div>
      </div>
    );
  }

  // Show summary content
  return (
    <div className="h-full mx-auto max-w-6xl p-4 space-y-8 flex flex-col">
      <MeetingPageHeader
        title={meeting.title}
        subtitle="View your Meeting's Summary"
        date={displayDate}
      />
      <ScrollArea className="h-[calc(100dvh-300px)] bg-card shadow-sm border rounded-lg">
        <div className="p-8">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="size-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold m-0">Meeting Summary</h2>
            </div>

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-4 text-sm text-foreground/90 leading-relaxed">{children}</p>,
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-sm text-foreground/90">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              }}
            >
              {meeting.summary}
            </ReactMarkdown>
          </div>
        </div>
      </ScrollArea>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={triggerGenerate}>
          <RefreshCw className="size-4 mr-2" />
          Regenerate Summary
        </Button>
      </div>
    </div>
  );
}
