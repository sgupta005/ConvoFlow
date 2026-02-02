import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Chrome, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>No Meetings Yet</CardTitle>
            <CardDescription>
              Install the Chrome extension and start recording a Google Meet or
              Zoom call. Your meetings will automatically show up in the
              sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 rounded-xl bg-muted/60 p-4 text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm w-fit">
                <Chrome className="h-3.5 w-3.5" />
                ConvoFlow Chrome extension
              </div>

              <ol className="space-y-2 text-muted-foreground">
                <li>
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    1
                  </span>
                  Install the ConvoFlow Chrome extension in your browser.
                </li>
                <li>
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    2
                  </span>
                  Join a Google Meet or Zoom meeting in Chrome.
                </li>
                <li>
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    3
                  </span>
                  Click <span className="font-semibold">&quot;Start Recording&quot;</span> in the
                  ConvoFlow extension.
                </li>
                <li>
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                    4
                  </span>
                  Once the meeting starts recording, it will appear in the
                  workspace sidebar and you&apos;ll be able to open it here.
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-2 items-start">
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                Install Chrome extension
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="text-xs text-muted-foreground">
                After installing, refresh this page once you start recording a
                meeting.
              </p>
            </div>
          </CardContent>

        </Card>

      </div>
    </div>
  );
}

