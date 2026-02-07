import { GoogleGenAI } from '@google/genai';
import { MeetingSummaryResponseSchema, type MeetingSummaryResponse } from '@workspace/contracts';
import { Prisma } from '@workspace/db';
import zodToJsonSchema from 'zod-to-json-schema';

const ai = new GoogleGenAI({});

export async function generateSummaryAndActionItems(
  meetingTitle: string,
  transcriptSegments: Prisma.TranscriptSegmentGetPayload<{
    select: {
      text: true;
      timestamp: true;
      speaker: true;
    }
  }>[]
): Promise<MeetingSummaryResponse> {
  // Format transcript for the prompt
  const formattedTranscript = transcriptSegments
    .map((segment) => {
      const time = segment.timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const speaker = segment.speaker ? `${segment.speaker}: ` : '';
      return `[${time}] ${speaker}${segment.text}`;
    })
    .join('\n');

  const prompt = `You are an expert meeting assistant that analyzes meeting transcripts and creates comprehensive summaries and extracts actionable items.

Meeting Title: ${meetingTitle}

Transcript:
${formattedTranscript}

Please analyze this meeting transcript and provide a JSON response with the following structure:
{
  "summary": "A well-structured, comprehensive summary in markdown format",
  "actionItems": [
    {
      "text": "Action item description"
    }
  ]
}

For the summary, include:
- Brief overview of the meeting's main purpose
- Key topics discussed (use bullet points or subheadings)
- Important decisions made
- Main takeaways
- Next steps or follow-up items mentioned

Format the summary using markdown with proper headings, bullet points, and emphasis where appropriate.

For action items, extract all tasks or to-dos mentioned. Each should:
- Be clear and specific
- Start with an action verb when possible
- Include any mentioned deadlines or assignees in the description
- Be concise but informative

Return only valid JSON, nothing else.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        // maxOutputTokens: 10000,
        responseMimeType: 'application/json',
        responseJsonSchema: (zodToJsonSchema as (schema: unknown) => object)(MeetingSummaryResponseSchema),
      },
    });

    const text = response?.text;
    if (typeof text !== 'string') {
      throw new Error('No response text from model');
    }
    const finalResponse = MeetingSummaryResponseSchema.parse(JSON.parse(text));

    console.log(finalResponse);

    return finalResponse;
  } catch (error) {
    console.error('Error generating summary and action items:', error);
    throw new Error(
      `Failed to generate summary and action items: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}