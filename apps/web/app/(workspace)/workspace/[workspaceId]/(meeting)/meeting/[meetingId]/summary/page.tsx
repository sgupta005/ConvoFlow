import { SummaryView } from '@/features/summary/components/summary-view';
import { notFound } from 'next/navigation';
import { getMeetingById } from '@workspace/db';

// Dummy summary for demonstration
const DUMMY_SUMMARY = `The team convened for a productive weekly standup meeting to discuss the upcoming product launch scheduled for February 15th. Several key topics were addressed during the session.

**Marketing Strategy Alignment**
The marketing team presented their Q1 campaign strategy, focusing on social media outreach and influencer partnerships. They requested an additional budget allocation of $15,000 for promotional activities, which was approved pending final review by the finance team.

**Technical Readiness Assessment**
Engineering confirmed that all critical features are on track for the launch date. The payment module has passed initial QA testing, with final regression tests scheduled for next week. Minor UI polish items remain but are not blocking the release.

**Customer Support Preparation**
HR outlined the training timeline for customer support representatives. Training materials are being finalized, with sessions planned for February 12-14th to ensure the team is ready to handle launch-day inquiries.

**Key Decisions Made**
- Approved the extended marketing budget for influencer partnerships
- Confirmed February 15th as the official launch date
- Agreed to daily syncs during the final week before launch
- Designated Sarah as the launch day coordinator

The meeting concluded with action items assigned to respective team members, with a follow-up sync scheduled for Friday to review final preparations.`;

async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = await getMeetingById(meetingId);
  if (!meeting) return notFound();

  // For now, use dummy summary data for UI demonstration
  const meetingWithSummary = {
    ...meeting,
    summary: DUMMY_SUMMARY,
  };

  return <SummaryView meeting={meetingWithSummary} />;
}

export default Page;
