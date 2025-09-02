import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
import { appendTranscriptChunk } from '@workspace/redis';

const stealthPlugin = StealthPlugin();
stealthPlugin.enabledEvasions.delete('iframe.contentWindow');
stealthPlugin.enabledEvasions.delete('media.codecs');
puppeteer.use(stealthPlugin);

export class MeetService {
  async joinGoogleMeet(
    meetingId: string,
    meetUrl: string,
    botName: string = 'ConvoFlow Bot'
  ): Promise<void> {
    console.log(`Starting to join Google Meet: ${meetUrl}`);

    const browser = await puppeteer.launch({
      executablePath: executablePath(),
      headless: true,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });

    try {
      const page = await browser.newPage();
      await page.goto(meetUrl, {
        waitUntil: 'networkidle0',
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await page.click(
        'button[class="mUIrbf-LgbsSe mUIrbf-LgbsSe-OWXEXe-dgl2Hf mUIrbf-StrnGf-YYd4I-VtOx3e"]'
      );

      const gotItButton = await page.$(
        'button[class="UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-dgl2Hf UywwFc-StrnGf-YYd4I-VtOx3e IMT1Gf"]'
      );
      if (gotItButton) {
        await gotItButton.click();
      }

      await page.type('input[class="qdOxv-fmcmS-wGMbrd"]', botName);

      await page.click(
        'button[class="UywwFc-LgbsSe UywwFc-LgbsSe-OWXEXe-SfQLQb-suEOdc UywwFc-LgbsSe-OWXEXe-dgl2Hf UywwFc-StrnGf-YYd4I-VtOx3e tusd3  IyLmn QJgqC"]'
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const captionsButton = await page.waitForSelector(
        'button[aria-label="Turn on captions"]'
      );

      const gotItButton2 = await page.$(
        'button[class="VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-dgl2Hf ksBjEc lKxP2d LQeN7"]'
      );
      if (gotItButton2) {
        await gotItButton2.click();
      }

      if (captionsButton) {
        await captionsButton.click();
        console.log('Captions enabled successfully');
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const captions = await page.$('div[class="ygicle VbkSUe"]');
      const speaker = await page.$('div[class="NWpY1d"]');
      if (captions) {
        const captionText = await captions.evaluate((el) => el.textContent);
        const speakerText = await speaker?.evaluate((el) => el.textContent);
        appendTranscriptChunk({
          meetingId: meetingId,
          speaker: speakerText ?? undefined,
          text: captionText!,
          ts: Date.now(),
        });
        console.log(
          'Captions detected: ',
          captionText,
          '/nSpeaker: ',
          speakerText
        );
      }

      await page.screenshot({
        path: `meeting-${Date.now()}.png`,
        fullPage: true,
      });

      console.log(`Bot successfully joined meeting: ${meetUrl}`);

      // Keep the browser open to maintain the meeting connection
      // In a real implementation, you might want to add more sophisticated
      // handling to monitor the meeting state and handle disconnections
    } catch (error) {
      console.error('Error joining Google Meet:', error);
      await browser.close();
      throw error;
    }
  }
}
