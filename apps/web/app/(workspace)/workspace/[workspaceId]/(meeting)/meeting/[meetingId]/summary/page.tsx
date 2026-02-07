import { SummaryView } from '@/features/summary/components/summary-view';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@workspace/db';

async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = await getMeetingById(meetingId);
  if (!meeting) return notFound();

  return <SummaryView meeting={meeting} />;
}

export default Page;
