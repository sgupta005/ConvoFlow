export const config = {
  PORT: process.env.PORT || 8080,
  WEB_APP_URL: process.env.WEB_APP_URL || 'http://localhost:3000',
  EXTENSION_URL: process.env.EXTENSION_URL || 'chrome-extension://fljdicobpfhohfcpmldbaemhadngokhd',
  DEEPGRAM_API_KEY: () => {
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramApiKey) {
      console.error('DEEPGRAM_API_KEY environment variable is required');
      process.exit(1);
    }
    return deepgramApiKey;
  }
}

