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

  test('should be able to add Employee', async ({ page }) => {
    const dashboardPage = new BenefitDashboardPage(page);
    
    // Navigate to the benefits dashboard
    await dashboardPage.goto();
    
    // Click the add button
    await dashboardPage.clickAdd();

     // Fill in form fields
    const firstName = 'John';
    const lastName = 'Doe';
    const dependents = Math.floor(Math.random() * 9); // Random number 0-10

    await page.fill('#firstName', firstName);
    await page.fill('#lastName', lastName);
    await page.fill('#dependants', String(dependents));
    
    // Click the Add button in modal-footer (ensure we click the correct one)
    await page.click('.modal-footer #addEmployee');
    
    // Wait for the employee to appear in the table
    await page.waitForSelector(`table tbody tr:has-text("${firstName}")`, { timeout: 10000 });
    
    // Verify the employee row is visible in the table
    const employeeRow = page.locator(`table tbody tr:has-text("${firstName}")`);
    await expect(employeeRow).toBeVisible({ timeout: 10000 });
  });
});
