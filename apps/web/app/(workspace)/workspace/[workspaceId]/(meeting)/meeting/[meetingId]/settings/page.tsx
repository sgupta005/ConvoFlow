import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { getMeetingById } from "@workspace/db";
import { RenameMeetingForm } from "@/features/meetings/components/rename-meeting-form";
import { DeleteMeetingDialog } from "@/features/meetings/components/delete-meeting-dialog";
import { MeetingPageHeader } from "@/features/meetings/components/meeting-page-header";

export default async function Page({ params }: {
  params: Promise<{ meetingId: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { meetingId } = await params;

  const meeting = await getMeetingById(meetingId);
  if (!meeting || !session) return notFound();

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <MeetingPageHeader
        title={meeting.title}
        subtitle="Manage your Meeting's Settings"
        date={meeting.startTime ?? meeting.createdAt}
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
            <CardDescription>
              Update your meeting name and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RenameMeetingForm
              meetingId={meeting.id}
              currentTitle={meeting.title}
              userId={session.session.userId}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that affect this workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteMeetingDialog
              meetingId={meeting.id}
              userId={session.session.userId}
              meetingTitle={meeting.title}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}