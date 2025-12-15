import { test, expect } from '@playwright/test';
import { BenefitDashboardPage } from './benDashboard_pom';

test.describe.serial('Benefits Dashboard', () => {
  let dashboardPage: BenefitDashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new BenefitDashboardPage(page);
    // Log in via login form before each test
    await dashboardPage.login();
  });

  test('should load the benefits dashboard page', async ({ page }) => {
    // Basic assertion to verify the dashboard loaded after login
    await expect(page).toHaveTitle(/benefits/i, { timeout: 10000 });
  });

  test('should be able to add Employee', async ({ page }) => {
    // Verify the add button exists on the dashboard page
    const addButton = dashboardPage.getAddButton();
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Fill and submit the form via page object method
    const { firstName, lastName } = dashboardPage.generateEmployeeName();
    const dependents = Math.floor(Math.random() * 9) + 1; 
    await dashboardPage.addEmployee(firstName, lastName, dependents);

    // Wait for the employee to appear in the table
    await dashboardPage.waitForEmployeeInTable(firstName);
    
    // Verify the employee row is visible in the table
    const employeeRow = dashboardPage.getEmployeeRowByFirstName(firstName);
    await expect(employeeRow).toBeVisible({ timeout: 10000 });
  });

  test('should be able to edit Employee', async ({ page }) => {
    const editButton = dashboardPage.getFirstEditButton();
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Generate new employee data for editing
    const { firstName: newFirstName, lastName: newLastName } = dashboardPage.generateEmployeeName();
    const newDependents = Math.floor(Math.random() * 9) + 1;

    // Use the editEmployee method from POM
    await dashboardPage.editEmployee(newFirstName, newLastName, newDependents);

    // Verify the employee was updated in the table
    await dashboardPage.waitForEmployeeInTable(newFirstName);
    const updatedEmployeeRow = dashboardPage.getEmployeeRowByFirstName(newFirstName);
    await expect(updatedEmployeeRow).toBeVisible({ timeout: 10000 });
  });

  test('should be able to delete Employee', async ({ page }) => {
    // Get the first employee row from the table
    const firstEmployeeRow = dashboardPage.getFirstEmployeeRow();
    
    // Get the employee name from the first row
    const employeeName = await dashboardPage.getEmployeeNameFromRow(firstEmployeeRow);

    // Delete the first employee
    await dashboardPage.deleteFirstEmployee(firstEmployeeRow);

    // Verify the employee was deleted from the table
    const deletedEmployeeRow = dashboardPage.getEmployeeRowByFirstName(employeeName || '');
    await expect(deletedEmployeeRow).not.toBeVisible({ timeout: 10000 });
  });
});
