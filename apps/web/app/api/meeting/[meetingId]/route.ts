import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Prisma, checkUserCanUpdateMeeting, updateMeeting } from "@workspace/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ meetingId: string }> }) {
  try {
    // Verify Session
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) throw new Error('Unauthenticated')

    // Check user has access to meeting
    const { meetingId } = await params;
    const canUpdateMeeting = await checkUserCanUpdateMeeting(meetingId, session.user.id);
    if (!canUpdateMeeting) throw new Error('Unauthorized')

    // Get Payload from Request
    const body = await req.json();
    const { payload }: { payload: Prisma.MeetingUpdateInput } = body;

    // Update Meeting
    const meeting = await updateMeeting(meetingId, payload);
    if (!meeting) throw new Error('Meeting not found')

    return NextResponse.json({
      success: true,
      data: meeting,
      message: 'Meeting updated successfully.'
    },
      {
        headers: {
          'Access-Control-Allow-Origin': process.env.NEXT_EXTENSION_URL!,
          'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'An error occurred while trying to update the meeting.' })
  }
}
