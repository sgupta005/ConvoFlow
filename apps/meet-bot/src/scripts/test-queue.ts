import { MeetService } from '../services/meetService';
import { enqueueSpawnBot } from '@workspace/redis';

// Test script to add a job to the queue
async function testQueue() {
  console.log('Adding test job to bot queue...');

  const testPayload = {
    meetingId: 'test-meeting-' + Date.now(),
    meetUrl: 'https://meet.google.com/ibt-qffp-hwt', // Replace with a real meeting URL for testing
    requestedByUserId: 'test-user-123',
  };

  try {
    const job = await enqueueSpawnBot(testPayload);
    console.log('✅ Job added successfully:', job.id);
  } catch (error) {
    console.error('❌ Failed to add job:', error);
  }
}

// async function testQueue() {
//   const meetingService = new MeetService();
//   meetingService.joinGoogleMeet('https://meet.google.com/oes-mkxx-oax');
// }

testQueue();
