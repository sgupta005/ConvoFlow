import { z } from 'zod';

// Schema for action items extracted from transcript
export const ActionItemSchema = z.object({
  text: z.string().describe('The action item text/description'),
});

// Schema for the complete AI response
export const MeetingSummaryResponseSchema = z.object({
  summary: z.string().describe('A comprehensive summary of the meeting in markdown format'),
  actionItems: z.array(ActionItemSchema).describe('List of action items extracted from the meeting'),
});

export type MeetingSummaryResponse = z.infer<typeof MeetingSummaryResponseSchema>;
export type ActionItemData = z.infer<typeof ActionItemSchema>;
