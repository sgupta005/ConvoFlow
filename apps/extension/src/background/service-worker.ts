chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === 'service-worker') {
    switch (message.type) {
      case 'request-recording':
        try {
          const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
          });

          // Check if we can record this tab
          const isGoogleMeet = tab?.url?.includes('meet.google');
          const isZoom = tab?.url?.includes('zoom');

          if (!tab || (!isGoogleMeet && !isZoom)) {
            chrome.runtime.sendMessage({
              type: 'recording-error',
              target: 'offscreen',
              error:
                'Cannot record this tab. Please open a Google Meet or Zoom meeting tab.',
            });
            return;
          }

          // Ensure we have access to the tab
          if (tab.id) {
            await chrome.tabs.update(tab.id, {});

            // Get a MediaStream for the active tab
            const streamId = chrome.tabCapture.getMediaStreamId(
              {
                targetTabId: tab.id,
              },
              () => {}
            );

            // Send the stream ID to the offscreen document to start recording
            chrome.runtime.sendMessage({
              type: 'start-recording',
              target: 'offscreen',
              data: streamId,
            });
          }

          // chrome.action.setIcon({ path: '/icons/recording.png' });
        } catch (error) {
          chrome.runtime.sendMessage({
            type: 'recording-error',
            target: 'offscreen',
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error while requesting recording',
          });
        }
        break;

      case 'recording-stopped':
        chrome.action.setIcon({ path: 'icons/not-recording.png' });
        break;

      case 'update-icon':
        chrome.action.setIcon({
          path: message.recording
            ? 'icons/recording.png'
            : 'icons/not-recording.png',
        });
        break;
    }
  }
});
