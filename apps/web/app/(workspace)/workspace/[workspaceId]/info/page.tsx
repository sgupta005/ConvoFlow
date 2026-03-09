import { Chrome, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty';
import { buttonVariants } from '@workspace/ui/components/button';

export default async function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Chrome className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>No meetings yet</EmptyTitle>
          <EmptyDescription>
            Install the Chrome extension and start recording a Google Meet or Zoom call.
            Your meetings will automatically show up in the sidebar.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href="#"
            className={buttonVariants({ variant: 'default' })}
          >
            Install Chrome extension
            <ArrowRight className="h-4 w-4" />
          </Link>
        </EmptyContent>
      </Empty>
    </div>
  );
}
