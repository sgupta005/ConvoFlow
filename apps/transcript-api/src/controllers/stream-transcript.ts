import { getCatchUpTranscriptSegments } from "@workspace/db";
import { Request, Response } from "express";

export function streamTranscriptController(clients: Map<string, Set<any>>) {
  return async (req: Request, res: Response) => {
    const meetingId = req.params.meetingId as string;
    const afterId = req.query.afterId as string | undefined;
    const afterTimestamp = req.query.afterTimestamp as string | undefined;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send catch-up segments
    if (afterId || afterTimestamp) {
      const catchUpSegments = await getCatchUpTranscriptSegments(meetingId, afterId, afterTimestamp);
      for (const segment of catchUpSegments) {
        res.write(`data: ${JSON.stringify(segment)}\n\n`);
      }
    }

    // Then subscribe to live updates
    if (!clients.has(meetingId)) {
      clients.set(meetingId, new Set());
    }
    clients.get(meetingId)!.add(res);

    console.log(`SSE client subscribed to meeting: ${meetingId}`);

    // Remove from subscribers when client disconnects
    req.on('close', () => {
      const subs = clients.get(meetingId);
      if (subs) {
        subs.delete(res);
        if (subs.size === 0) {
          clients.delete(meetingId);
        }
      }
      console.log(`SSE client disconnected from meeting: ${meetingId}`);
    });
  }
}