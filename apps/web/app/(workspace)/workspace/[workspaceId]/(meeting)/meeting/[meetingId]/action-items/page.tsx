import { ActionItemsView } from '@/features/action-items/components/action-items-view';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@workspace/db';

// Dummy action items for demonstration
const DUMMY_ACTION_ITEMS = [
  {
    id: '1',
    text: 'Prepare launch press release and distribute to media outlets by end of week',
    isCompleted: false,
  },
  {
    id: '2',
    text: 'Complete final QA testing for payment module and document any issues',
    isCompleted: false,
  },
  {
    id: '3',
    text: 'Submit updated budget proposal with influencer partnership costs',
    isCompleted: true,
  },
  {
    id: '4',
    text: 'Schedule customer support training sessions for new product features',
    isCompleted: false,
  },
  {
    id: '5',
    text: 'Review and approve final marketing creative assets for social media campaign',
    isCompleted: false,
  },
  {
    id: '6',
    text: 'Set up monitoring dashboards for launch day metrics and alerts',
    isCompleted: false,
  },
];

async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = await getMeetingById(meetingId);
  if (!meeting) return notFound();

  return <ActionItemsView meeting={meeting} actionItems={DUMMY_ACTION_ITEMS} />;
}

export default Page;
