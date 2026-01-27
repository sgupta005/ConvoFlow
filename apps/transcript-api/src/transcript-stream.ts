import type { Request, Response } from 'express';
import { getMeetingById, getTranscriptSegmentsByMeeting, prisma } from '@workspace/db';

/**
 * SSE endpoint for streaming transcript segments in real-time
 * GET /api/meeting/:meetingId/transcript/stream
 */
export async function streamTranscriptHandler(req: Request, res: Response) {
  try {
    const { meetingId } = req.params;
    const userId = req.headers['x-user-id'];
    const authToken = req.headers.authorization;

    // Basic authentication check
    if (!userId || typeof userId !== 'string' || !authToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!meetingId || typeof meetingId !== 'string') {
      return res.status(400).json({ error: 'Invalid meeting ID' });
    }

    // Get meeting and check access
    const meeting = await getMeetingById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Check if user has access to the meeting's workspace
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: meeting.workspaceId,
        userId: userId,
      },
    });

    if (!workspaceMember) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Track last timestamp for polling
    let lastTimestamp = new Date(0); // Start from beginning

    // Send initial segments
    const initialSegments = await getTranscriptSegmentsByMeeting(meetingId);
    if (initialSegments && initialSegments.length > 0) {
      res.write(`data: ${JSON.stringify({ segments: initialSegments })}\n\n`);
      const lastSegment = initialSegments[initialSegments.length - 1];
      if (lastSegment) {
        lastTimestamp = lastSegment.createdAt;
      }
    }

    // Poll for new segments
    const intervalId = setInterval(async () => {
      try {
        const newSegments = await getTranscriptSegmentsByMeeting(meetingId, lastTimestamp);

        if (newSegments && newSegments.length > 0) {
          res.write(`data: ${JSON.stringify({ segments: newSegments })}\n\n`);
          const lastSegment = newSegments[newSegments.length - 1];
          if (lastSegment) {
            lastTimestamp = lastSegment.createdAt;
          }
        }

        // Send keepalive
        res.write(`: keepalive\n\n`);
      } catch (error) {
        console.error('Error polling for transcript segments:', error);
      }
    }, 500);

    // Cleanup on close
    req.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });

  } catch (error) {
    console.error('SSE endpoint error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
