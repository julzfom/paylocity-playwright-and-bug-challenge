const { chromium } = require('playwright');

/**
 * Global setup to authenticate and save storage state for tests.
 *
 * Behavior:
 * - Navigates to `BASE_URL` (from env or config baseURL)
 * - Fills login form using selectors from env vars or sensible defaults
 * - Submits and waits for network idle
 * - Saves storage state to `storageState.json`
 *
 * NOTE: Update selectors via environment variables if your app uses different names.
 */
module.exports = async (config) => {
  const baseURL = process.env.BASE_URL || (config && config.use && config.use.baseURL) || 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login';
  const username = process.env.TEST_USERNAME || 'TestUser841';
  const password = process.env.TEST_PASSWORD || 'Jt(Q_4ynAB+=';

  const usernameSelector = process.env.LOGIN_USERNAME_SELECTOR || 'input[name="username"]';
  const passwordSelector = process.env.LOGIN_PASSWORD_SELECTOR || 'input[name="password"]';
  const submitSelector = process.env.LOGIN_SUBMIT_SELECTOR || 'button[type="submit"]';

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(baseURL, { waitUntil: 'networkidle' });

    // Try filling username/password; if selectors don't exist, skip silently.
    try {
      await page.fill(usernameSelector, username);
    } catch (e) {}
    try {
      await page.fill(passwordSelector, password);
    } catch (e) {}
    try {
      await page.click(submitSelector);
    } catch (e) {}

    // Wait for potential navigation / network to settle
    await page.waitForLoadState('networkidle');

    // Save storage state for use in tests
    await page.context().storageState({ path: 'storageState.json' });
  } finally {
    await browser.close();
  }

  return 'storageState.json';
};
