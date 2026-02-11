import Link from 'next/link';

import { Prisma } from '@workspace/db';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { ScrollArea } from '@workspace/ui/components/scroll-area';

interface RecentMeetingsProps {
  meetings: Prisma.MeetingGetPayload<{}>[];
  workspaceId: string;
}

export function RecentMeetings({ meetings, workspaceId }: RecentMeetingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Meetings</CardTitle>
      </CardHeader>
      <CardContent >
        <ScrollArea className="h-[250px]">
          {meetings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No meetings yet
            </p>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/workspace/${workspaceId}/meeting/${meeting.id}/transcript`}
                  className="block group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${meeting.is_live ? 'bg-green-500' : 'bg-muted'
                          }`} />
                        <p className="text-sm font-medium truncate group-hover:opacity-80 transition-colors">
                          {meeting.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-4">
                        <p className="text-xs text-muted-foreground">
                          started: {formatDistanceToNow(meeting.startTime ?? meeting.createdAt)}
                        </p>
                        {meeting.is_live ? (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                            <span className="relative flex h-2 w-2 mr-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            LIVE
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            ended: {formatDistanceToNow(meeting.endTime ?? meeting.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
