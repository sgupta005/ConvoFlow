import { TranscriptView } from '@/features/transcript/components/transcript-view';

// Dummy meeting data for testing - in production, this would come from the database
const dummyMeeting = {
  id: 'meeting-1',
  title: 'Q1 Product Planning',
  is_live: false, // Meeting has ended
};

function Page() {
  const meeting = dummyMeeting;

  return <TranscriptView />;
}

export default Page;
