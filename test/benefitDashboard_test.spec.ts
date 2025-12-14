import { test, expect } from '@playwright/test';
import { BenefitDashboardPage } from './benDashboard_pom';

test.describe('Benefits Dashboard', () => {
  test('should load the benefits dashboard page', async ({ page }) => {
    const dashboardPage = new BenefitDashboardPage(page);
    
    // Navigate to the benefits dashboard
    await dashboardPage.goto();
    
    // Basic assertion to verify the page loaded
    await expect(page).toHaveTitle(/benefits/i, { timeout: 10000 });
  });

  test('should have add button element', async ({ page }) => {
    const dashboardPage = new BenefitDashboardPage(page);
    
    // Navigate to the benefits dashboard
    await dashboardPage.goto();
    
    // Verify the add button exists
    const addButton = dashboardPage.getAddButton();
    await expect(addButton).toBeVisible();
  });

  test('should be able to click add button', async ({ page }) => {
    const dashboardPage = new BenefitDashboardPage(page);
    
    // Navigate to the benefits dashboard
    await dashboardPage.goto();
    
    // Click the add button
    await dashboardPage.clickAdd();
    
    // Add assertions based on what happens after clicking
  });
});
