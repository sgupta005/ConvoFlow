import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
import { appendTranscriptChunk } from '@workspace/redis';
import { config } from '../config';

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

      console.log(`Bot successfully joined meeting: ${meetUrl}`);
      await this.monitorCaptions(page, meetingId);
    } catch (error) {
      console.error('Error joining Google Meet:', error);
      await browser.close();
      throw error;
    }
  }

  private async monitorCaptions(page: any, meetingId: string): Promise<void> {
    let lastCaptionText = '';
    let consecutiveEmptyChecks = 0;

    console.log('Starting caption monitoring...');

    while (true) {
      try {
        const isInMeeting = await this.checkIfStillInMeeting(page);
        if (!isInMeeting) {
          console.log('Meeting ended or bot was disconnected');
          break;
        }

        const activeCaptionData = await this.findActiveCaption(page);

        if (activeCaptionData.text) {
          consecutiveEmptyChecks = 0;

          if (activeCaptionData.text !== lastCaptionText) {
            lastCaptionText = activeCaptionData.text;

            await appendTranscriptChunk({
              meetingId: meetingId,
              speaker: activeCaptionData.speaker || undefined,
              text: activeCaptionData.text,
              ts: Date.now(),
            });

            console.log(
              `[${new Date().toISOString()}] ${activeCaptionData.speaker || 'Unknown'}: ${activeCaptionData.text}`
            );
          }
        } else {
          consecutiveEmptyChecks++;
          if (consecutiveEmptyChecks >= config.maxEmptyChecks) {
            console.log(
              'No captions found for extended period, meeting may have ended'
            );
            break;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error monitoring captions:', error);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log('Caption monitoring stopped');
  }

  private async findActiveCaption(
    page: any
  ): Promise<{ text: string; speaker?: string }> {
    try {
      const captionDivs = await page.$$('div[class="ygicle VbkSUe"]');

      if (captionDivs.length === 0) {
        return { text: '' };
      }

      let bestCaption = { text: '', speaker: undefined };
      let lastNonEmptyIndex = -1;

      for (let i = 0; i < captionDivs.length; i++) {
        const captionText = await captionDivs[i].evaluate(
          (el: any) => el.textContent?.trim() || ''
        );

        if (captionText) {
          lastNonEmptyIndex = i;
          bestCaption.text = captionText;
        }
      }

      if (lastNonEmptyIndex >= 0) {
        try {
          const speakerElements = await page.$$('span[class="NWpY1d"]');
          if (speakerElements[lastNonEmptyIndex]) {
            bestCaption.speaker = await speakerElements[
              lastNonEmptyIndex
            ].evaluate((el: any) => el.textContent?.trim() || '');
          }
        } catch (speakerError) {
          console.warn('Could not find speaker for caption');
        }
      }

      return bestCaption;
    } catch (error) {
      console.error('Error finding active caption:', error);
      return { text: '' };
    }
  }

  private async checkIfStillInMeeting(page: any): Promise<boolean> {
    try {
      const meetingEndedIndicators = ['h1[class="roSPhc"]'];

      for (const indicator of meetingEndedIndicators) {
        const element = await page.$(indicator);
        if (element) {
          return false;
        }
      }

      const currentUrl = page.url();
      if (!currentUrl.includes('meet.google.com')) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking meeting status:', error);
      return true;
    }
  }
}
