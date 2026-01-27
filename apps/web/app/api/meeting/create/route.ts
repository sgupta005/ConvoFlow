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

    //get count of meetings in this workspace
    const meetingCount = await prisma.meeting.count();

    //set meetings name to 'Meeting count+1'
    const meetingName = `Meeting ${meetingCount + 1}`;

    //add a meeting to the default workspace
    const meeting = await createMeeting({
      title: meetingName,
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
          'Access-Control-Allow-Origin': 'chrome-extension://fljdicobpfhohfcpmldbaemhadngokhd',
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