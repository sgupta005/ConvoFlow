import { ActionItemsView } from '@/features/action-items/components/action-items-view';
import { notFound } from 'next/navigation';
import { getMeetingByIdWithActionItems } from '@workspace/db';

async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = await getMeetingByIdWithActionItems(meetingId);
  if (!meeting) return notFound();

  return <ActionItemsView meeting={meeting} />;
}

export default Page;
