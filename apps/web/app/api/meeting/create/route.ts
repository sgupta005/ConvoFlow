import { NextRequest, NextResponse } from 'next/server';
import { createMeetingSchema } from '@workspace/contracts';
import { createMeeting } from '@workspace/db';
import { enqueueSpawnBot } from '@workspace/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMeetingSchema.parse(body);

    const meeting = await createMeeting(validatedData);

    await enqueueSpawnBot({
      meetingId: meeting.id,
      meetUrl: validatedData.meetUrl,
      requestedByUserId: validatedData.requestedByUserId,
    });

    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        name: meeting.name,
        workspaceId: meeting.workspaceId,
        createdAt: meeting.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
