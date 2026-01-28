import { TranscriptView } from '@/features/transcript/components/transcript-view';
import { getMeetingByIdWithTranscript } from '@workspace/db';
import { notFound } from 'next/navigation';

async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = await getMeetingByIdWithTranscript(meetingId);
  if (!meeting) return notFound();
  return <TranscriptView meeting={meeting} />;
}

export default Page;
