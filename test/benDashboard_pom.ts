import { Page } from '@playwright/test';

export class BenefitDashboardPage {
  private readonly authHeader = 'Basic VGVzdFVzZXI4NDE6SnQoUV80eW5BQis9';
  private readonly username = 'TestUser841';
  private readonly password = 'Jt(Q_4ynAB+=';

  private readonly firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
    'James', 'Amanda', 'William', 'Lisa', 'Richard', 'Karen', 'Joseph', 'Nancy'
  ];

  private readonly lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'
  ];

  constructor(private page: Page) {}

  // Navigate to the login page and log in with username/password
  async login(username: string = this.username, password: string = this.password) {
    const loginUrl = 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Account/Login';

    // Go to login page
    await this.page.goto(loginUrl);

    // Fill credentials (based on fields on the login page)
    await this.page.fill('#Username', username);
    await this.page.fill('#Password', password);

    // Wait for navigation after clicking submit - this ensures cookies are set
    await Promise.all([
      // Wait for navigation away from login page (redirect to Benefits page)
      this.page.waitForURL('**/Benefits', { timeout: 10000 }),
      // Click the Log In button
      this.page.click('button[type="submit"]')
    ]);

    // Wait for page to fully load and ensure cookies are set
    await this.page.waitForLoadState('networkidle');
    
    // Verify we're logged in by checking if we have cookies
    const cookies = await this.page.context().cookies();
    if (cookies.length === 0) {
      throw new Error('Login failed: No cookies were set after login');
    }
  }

  async goto(url?: string) {
    // Replace with your actual URL or use environment variable
    const baseUrl = url || process.env.BASE_URL || 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Benefits';

    // Navigate and wait for the employees API GET call to complete
    // This will fail if not authenticated (cookies not set)
    await Promise.all([
      this.page.waitForResponse(response =>
        response.request().method() === 'GET' &&
        response.url().includes('/Prod/api/employees') &&
        response.status() === 200
      ),
      this.page.goto(baseUrl)
    ]);
  }

  // Get the add button element
  getAddButton() {
    return this.page.locator('#add');
  }

  // Click the add button
  async clickAdd() {
    await this.getAddButton().click();
  }

  // Fill and submit the Add Employee form
  async addEmployee(firstName: string, lastName: string, dependents: number) {
    // Ensure the employee modal is visible before interacting
    await this.page.locator('#employeeModal').waitFor({ state: 'visible' });

    await this.page.locator('#firstName').fill(firstName);
    await this.page.locator('#lastName').fill(lastName);
    await this.page.locator('#dependants').fill(dependents.toString());
    await this.page.locator('#addEmployee').dispatchEvent('click');
    await this.page.locator('#employeeModal').waitFor({ state: 'hidden' });
  }

  // Fill and submit the Edit Employee form
  async editEmployee(firstName: string, lastName: string, dependents: number) {
    // Ensure the employee modal is visible before interacting
    await this.page.locator('#employeeModal').waitFor({ state: 'visible' });

    // Clear and fill the form fields
    await this.page.locator('#firstName').clear();
    await this.page.locator('#firstName').fill(firstName);
    await this.page.locator('#lastName').clear();
    await this.page.locator('#lastName').fill(lastName);
    await this.page.locator('#dependants').clear();
    await this.page.locator('#dependants').fill(dependents.toString());

    // Click the update button
    await this.page.locator('#updateEmployee').click();
    await this.page.locator('#employeeModal').waitFor({ state: 'hidden' });
  }

  // Generate random first name
  generateFirstName(): string {
    return this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
  }

  // Generate random last name
  generateLastName(): string {
    return this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
  }

  // Generate random employee name
  generateEmployeeName(): { firstName: string; lastName: string } {
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName()
    };
  }

  // Get employee modal locator
  getEmployeeModal() {
    return this.page.locator('#employeeModal');
  }

  // Get edit button for first employee
  getFirstEditButton() {
    return this.page.locator('[class*="fa-edit"]').first();
  }

  // Get edit button within a specific employee row
  getEditButtonForRow(employeeRow: any) {
    return employeeRow.locator('button[class*="fa-edit"]');
  }

  // Get delete button within a specific employee row
  getFirstDeleteButton() {
    return this.page.locator('[class*="fas fa-times"]').first();
  }

  // Get confirmation button
  getConfirmationButton() {
    return this.page.locator('button:has-text("Confirm"), button:has-text("Delete"), button:has-text("OK")').first();
  }

  // Get employee row by first name
  getEmployeeRowByFirstName(firstName: string) {
    return this.page.locator(`table tbody tr:has-text("${firstName}")`);
  }

  // Wait for employee row to appear in table
  async waitForEmployeeInTable(firstName: string, timeout: number = 10000) {
    await this.page.waitForSelector(`table tbody tr:has-text("${firstName}")`, { timeout });
  }

  // Delete employee by clicking delete button and confirming
  async deleteFirstEmployee(employeeRow: any) {
    const deleteButton = this.getFirstDeleteButton();
    
    // Try to click with multiple attempts
    try {
      await deleteButton.click({ force: true, timeout: 5000 });
    } catch (error) {
      // If click fails, try scrolling into view first
      await employeeRow.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      await deleteButton.click({ force: true });
    }
    
    // Wait a moment for potential confirmation dialog to appear
    await this.page.waitForTimeout(500);

    // Handle deletion confirmation if present
    const confirmButton = this.getConfirmationButton();
    try {
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }
    } catch (e) {
      // Confirmation button not found, that's okay
    }
  }

  // Click edit button on employee row
  async clickEditButtonForRow(employeeRow: any) {
    const editButton = this.getEditButtonForRow(employeeRow);
    await editButton.click();
  }

  // Get the first employee row from the table
  getFirstEmployeeRow() {
    return this.page.locator('table tbody tr').first();
  }

  // Get all table rows
  getAllEmployeeRows() {
    return this.page.locator('table tbody tr');
  }

  // Get employee name from a row (Last Name + First Name)
  async getEmployeeNameFromRow(employeeRow: any) {
    // Table columns: Id, Last Name, First Name, Dependents, Salary, Gross Pay, Benefit Cost
    // So: td[0] = Id, td[1] = Last Name, td[2] = First Name
    const lastNameCell = employeeRow.locator('td').nth(1);
    const firstNameCell = employeeRow.locator('td').nth(2);
    
    const lastName = await lastNameCell.textContent();
    const firstName = await firstNameCell.textContent();
    
    return firstName?.trim() || '';
  }

}

