import { Page } from '@playwright/test';

/**
 * Common helper functions for benefits dashboard tests
 */
export class BenefitsDashboardCommon {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot (useful for debugging)
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}