import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'convoflow-theme';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    // Load initial theme from storage
    chrome.storage.local.get([THEME_STORAGE_KEY], (result) => {
      const savedTheme = result[THEME_STORAGE_KEY] as Theme | undefined;
      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Fallback to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? 'dark' : 'light';
        setTheme(defaultTheme);
        applyTheme(defaultTheme);
      }
      setIsLoading(false);
    });

    // Listen for theme changes from web app
    function handleStorageChange(
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) {
      if (areaName === 'local' && changes[THEME_STORAGE_KEY]) {
        const newTheme = changes[THEME_STORAGE_KEY].newValue as Theme;
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    // Listen for system theme changes as fallback
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    function handleSystemThemeChange(e: MediaQueryListEvent) {
      // Only update if no theme is explicitly set
      chrome.storage.local.get([THEME_STORAGE_KEY], (result) => {
        if (!result[THEME_STORAGE_KEY]) {
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme);
          applyTheme(newTheme);
        }
      });
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return { theme, isLoading };
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
