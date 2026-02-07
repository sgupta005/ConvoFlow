import { NextRequest, NextResponse } from 'next/server';
import { getMeetingByIdWithTranscript, prisma } from '@workspace/db';
import { generateSummaryAndActionItems } from '@/lib/generate-summary-and-action-items';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;

    // Fetch meeting with transcript
    const meeting = await getMeetingByIdWithTranscript(meetingId);

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Check if meeting is still live
    if (meeting.is_live) {
      return NextResponse.json(
        { error: 'Cannot generate summary for a live meeting' },
        { status: 400 }
      );
    }

    // Check if transcript exists
    if (!meeting.transcriptSegments || meeting.transcriptSegments.length === 0) {
      return NextResponse.json(
        { error: 'No transcript available for this meeting' },
        { status: 400 }
      );
    }

    // Delete old action items
    await prisma.actionItem.deleteMany({
      where: { meetingId },
    });

    // Run generation 
    await generateAndSave(meetingId, meeting.title, meeting.transcriptSegments);

    return NextResponse.json(
      { message: 'Summary and action items generated', meetingId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Background function that handles the actual generation and database update
async function generateAndSave(
  meetingId: string,
  meetingTitle: string,
  transcriptSegments: Array<{ text: string; timestamp: Date; speaker: string | null }>
) {
  try {
    // Generate summary and action items using Gemini
    const result = await generateSummaryAndActionItems(meetingTitle, transcriptSegments);

    // Update meeting with summary and action items in a transaction
    await prisma.$transaction(async (tx) => {
      // Update summary
      await tx.meeting.update({
        where: { id: meetingId },
        data: { summary: result.summary },
      });

      // Create action items
      if (result.actionItems.length > 0) {
        await tx.actionItem.createMany({
          data: result.actionItems.map((item) => ({
            meetingId,
            text: item.text,
          })),
        });
      }
    });

    console.log(`Successfully generated summary and ${result.actionItems.length} action items for meeting ${meetingId}`);
  } catch (error) {
    console.error(`Error in generateAndSave for meeting ${meetingId}:`, error);
    throw error;
  }
}
