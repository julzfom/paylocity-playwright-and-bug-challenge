import { Page } from '@playwright/test';

export class BenefitDashboardPage {
  private readonly authHeader = 'Basic VGVzdFVzZXI4NDE6SnQoUV80eW5BQis9';
  private readonly username = 'TestUser841';
  private readonly password = 'Jt(Q_4ynAB+=';

  constructor(private page: Page) {}

  async goto(url?: string) {
    // Set authentication header
    await this.page.setExtraHTTPHeaders({
      'Authorization': this.authHeader
    });

    // Replace with your actual URL or use environment variable
    const baseUrl = url || process.env.BASE_URL || 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Benefits';
    await this.page.goto(baseUrl);
  }

  // Get the add button element
  getAddButton() {
    return this.page.locator('#add');
  }

  // Click the add button
  async clickAdd() {
    await this.getAddButton().click();
  }

}

