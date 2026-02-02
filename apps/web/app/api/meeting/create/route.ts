import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createMeeting, getUserDefaultWorkspace, prisma } from "@workspace/db";

export async function POST() {
  try {
    //get userid from session
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) throw new Error('Unauthenticated')

    //get user's default workspace
    const defaultWorkspace = await getUserDefaultWorkspace(session.user.id);
    if (!defaultWorkspace) throw new Error('Could not find default Workspace.')

    //get existing "Meeting N" titles in this workspace to determine next index
    const existingMeetings = await prisma.meeting.findMany({
      where: {
        workspaceId: defaultWorkspace.id,
        title: {
          startsWith: "Meeting",
        },
      },
      select: {
        title: true,
      },
    });

    //determine the highest numeric suffix used so far
    let maxSuffix = 0;
    for (const { title } of existingMeetings) {
      const match = title.match(/^Meeting\s(\d+)$/);
      if (match) {
        const num = Number.parseInt(match[1] || '0', 10);
        if (num === 0) {
          maxSuffix = existingMeetings.length;
          break;
        }
        if (!Number.isNaN(num) && num > maxSuffix) {
          maxSuffix = num;
        }
      }
    }

    //set meeting name to 'Meeting {maxSuffix+1}'
    const meetingName = `Meeting ${maxSuffix + 1}`;

    //add a meeting to the default workspace
    const meeting = await createMeeting({
      title: meetingName,
      is_live: true,
      workspace: {
        connect: { id: defaultWorkspace.id }
      }
    })

    return NextResponse.json({
      success: true,
      data: { meetingId: meeting.id },
      message: `${meetingName} created successfully.`
    },
      {
        headers: {
          'Access-Control-Allow-Origin': process.env.NEXT_EXTENSION_URL!,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'An error occurred while trying to create the meeting. ' })
  }
}