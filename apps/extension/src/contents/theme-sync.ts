import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: [
    "http://localhost:3000/*",
    "https://localhost:3000/*",
    // Add production domain here when deployed
  ],
  run_at: "document_start"
};

const THEME_STORAGE_KEY = 'convoflow-theme';
const NEXT_THEMES_KEY = 'theme'; // next-themes default localStorage key

function syncThemeToExtension() {
  try {
    // Read theme from localStorage (set by next-themes)
    const webAppTheme = localStorage.getItem(NEXT_THEMES_KEY);

    if (webAppTheme) {
      // Write to chrome.storage for extension to access
      chrome.storage.local.set({ [THEME_STORAGE_KEY]: webAppTheme });
    }
  } catch (error) {
    console.error('Failed to sync theme:', error);
  }
}

// Initial sync
syncThemeToExtension();

// Watch for localStorage changes
window.addEventListener('storage', (event) => {
  if (event.key === NEXT_THEMES_KEY) {
    syncThemeToExtension();
  }
});

// Use MutationObserver to detect theme changes from class attribute
// (next-themes changes the class on <html> element)
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      // Small delay to ensure localStorage is updated
      setTimeout(syncThemeToExtension, 50);
    }
  }
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
});

export { };
