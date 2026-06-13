import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — ConvoFlow',
  description:
    'How the ConvoFlow extension and web app handle your meeting audio, transcripts, and account data.',
};

const LAST_UPDATED = '14 June 2026';
const CONTACT_EMAIL = 'shivamgupta02005@gmail.com';

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-foreground">
      <h1 className="text-3xl font-bold">ConvoFlow Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {LAST_UPDATED}
      </p>

      <p className="mt-6 leading-relaxed text-muted-foreground">
        ConvoFlow (&quot;we&quot;, &quot;us&quot;) provides a Chrome extension and web app
        that record and transcribe your Google Meet and Zoom meetings. This policy explains
        what data we handle, why, and how it is stored. It is written to satisfy the Chrome
        Web Store User Data and Limited Use policies.
      </p>

      <Section title="What the extension does">
        The ConvoFlow extension captures audio <strong>only while you are signed in and only
        after you explicitly press the record button</strong> in a Google Meet or Zoom tab.
        It does not record in the background, and it does not capture audio from any other
        site.
      </Section>

      <Section title="Data we collect and process">
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>
            <strong>Meeting audio.</strong> When you start a recording, the extension captures
            the audio of the active meeting tab and your microphone, mixes them, and streams
            the audio to our transcription server over an encrypted (WSS) connection to produce
            a transcript.
          </li>
          <li>
            <strong>Account information.</strong> When you sign in, we process your
            authentication details (email, name, and profile image as provided by your sign-in
            method) to identify your account and associate meetings with you.
          </li>
          <li>
            <strong>Meeting metadata.</strong> Identifiers, start/end times, and live status of
            each recording, plus the generated transcript text.
          </li>
          <li>
            <strong>Theme preference.</strong> A local UI theme setting, stored only in the
            browser.
          </li>
        </ul>
        <p className="mt-3">
          We do <strong>not</strong> collect browsing history, and we do not access the content
          of any tabs other than the meeting tab you choose to record.
        </p>
      </Section>

      <Section title="How we use the data">
        Data is used solely to provide the core feature of the product: recording,
        transcribing, and displaying your meetings in your account. We do <strong>not</strong>{' '}
        sell your data, and we do <strong>not</strong> use it for advertising or any purpose
        unrelated to ConvoFlow&apos;s single purpose.
      </Section>

      <Section title="Storage and retention">
        Audio is streamed for transcription, and the resulting transcripts and meeting metadata
        are stored in your ConvoFlow account so you can review them later. You can delete your
        meetings from the dashboard. Account deletion removes your associated meeting data.
      </Section>

      <Section title="Permissions">
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li><strong>tabCapture</strong> — to capture the audio of the meeting tab you choose to record.</li>
          <li><strong>Microphone</strong> — to capture your voice during a recording (requested explicitly).</li>
          <li><strong>offscreen</strong> — to run audio recording and the transcription connection.</li>
          <li><strong>activeTab / access to meet.google.com and zoom.us</strong> — to detect and record supported meeting tabs.</li>
          <li><strong>storage</strong> — to remember your UI theme.</li>
          <li><strong>Access to convoflow.shivamg.dev / api.convoflow.shivamg.dev</strong> — to authenticate and send audio and metadata to your account.</li>
        </ul>
      </Section>

      <Section title="Third parties">
        Audio is processed by our speech-to-text provider to generate transcripts. We share
        only what is necessary to perform transcription and do not sell data to third parties.
      </Section>

      <Section title="Contact">
        Questions about this policy or your data:{' '}
        <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-2 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
