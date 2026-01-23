//check microphone permission
export async function checkMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    console.error('Error checking microphone permission:', error);
    return false;
  }
}

//check if current tab is recordable
export async function checkTabRecordable() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return Boolean(
      tab?.url?.includes('meet.google') || tab?.url?.includes('zoom')
    );
  } catch {
    return false;
  }
}
