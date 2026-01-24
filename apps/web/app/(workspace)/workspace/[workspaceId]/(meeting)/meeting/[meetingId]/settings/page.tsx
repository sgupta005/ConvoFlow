import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { getMeetingById } from "@workspace/db";
import { RenameMeetingForm } from "@/features/meetings/components/rename-meeting-form";
import { DeleteMeetingDialog } from "@/features/meetings/components/delete-meeting-dialog";

export default async function Page({ params }: {
  params: Promise<{ meetingId: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { meetingId } = await params;

  const meeting = await getMeetingById(meetingId);
  if (!meeting || !session) return notFound();

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-2xl font-semibold tracking-tight">{meeting.title}</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your Meeting settings
        </p>
      </div>
      <Separator />
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