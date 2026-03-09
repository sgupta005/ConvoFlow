import { TranscriptView } from '@/features/transcript/components/transcript-view';
import { getMeetingByIdWithTranscript } from '@workspace/db';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = await getMeetingByIdWithTranscript(meetingId);
  if (!meeting) return notFound();

  const cookieStore = await cookies();
  const rawToken =
    cookieStore.get('better-auth.session_token')?.value ??
    cookieStore.get('__Secure-better-auth.session_token')?.value;
  const sessionToken = rawToken?.split('.')[0];

  return <TranscriptView meeting={meeting} sessionToken={sessionToken} />;
}

export default Page;
