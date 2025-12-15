# Paylocity Benefits Dashboard - Automation Tests

## Overview
This project contains comprehensive test automation for the Paylocity Benefits Dashboard using Playwright, including both UI and API tests.

### Test Coverage
- **UI Tests**: Benefits Dashboard CRUD operations (Create, Read, Update, Delete)
- **API Tests**: Employee API endpoints with comprehensive validation

---

## Prerequisites

- Node.js 16+ installed
- npm package manager
- Git (optional)

---

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Browsers
```bash
npm run install:browsers
```

Or alternatively:
```bash
npx playwright install
```

---

## Running Tests

### Run All Tests (Headless Mode)
```bash
npm test
```

### Run Tests in Headed Mode (with browser UI)
```bash
npm run test:headed
```

### Run Tests with UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Specific Test File

**UI Tests Only:**
```bash
npx playwright test test/benefitDashboardUI_test.spec.ts
```

**API Tests Only:**
```bash
npx playwright test test/benefitDashboardAPI_test.spec.ts
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Tests with Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## Viewing Test Reports

### Open HTML Report
```bash
npm run test:report
```

Or:
```bash
npx playwright show-report
```

### View Test Results
Results are stored in `playwright-report/` directory after each test run.

---

## Test Structure

### UI Tests (`test/benefitDashboardUI_test.spec.ts`)
Tests run sequentially using `test.describe.serial()`:

1. **Load Dashboard** - Verify dashboard loads after login
2. **Add Employee** - Create a new employee with random generated name
3. **Edit Employee** - Update an existing employee's information
4. **Delete Employee** - Delete an employee and verify empty dashboard

**Page Object Model (POM):** `test/benDashboard_pom.ts`
- All locators and interactions centralized
- Reusable methods for common actions
- Random name generation for test data

### API Tests (`test/benefitDashboardAPI_test.spec.ts`)
Tests cover full CRUD lifecycle:

1. **GET /api/employees** - Retrieve all employees
2. **POST /api/employees** - Create employee with validation
3. **GET /api/employees/{id}** - Retrieve specific employee
4. **PUT /api/employees** - Update employee
5. **DELETE /api/employees/{id}** - Delete employee
6. **Validation Tests** - Test invalid payloads and edge cases

---

## Authentication

Tests use Basic Authentication:
- **Header:** `Authorization: Basic VGVzdFVzZXI4NDE6SnQoUV80eW5BQis9`
- **Base URL:** `https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod`

---

## Key Features

### Sequential Test Execution
Tests run one after another (not in parallel) using `test.describe.serial()`:
- Ensures proper test isolation
- Allows dependency between tests (e.g., create before delete)

### beforeEach Hook
Each test automatically:
- Creates new page instance
- Initializes dashboard page object
- Performs login

### Dynamic Test Data
- Random employee names generated for each test
- Prevents test data conflicts
- Easier to track test execution

### Comprehensive Locators
All UI locators moved to POM for:
- Easier maintenance
- Single source of truth
- Quick updates when UI changes

---

## Troubleshooting

### Tests Failing
1. Check network connectivity to the API
2. Verify authentication credentials are correct
3. Check browser compatibility

### Browser Issues
```bash
# Clear browser cache
rm -rf ~/.cache/ms-playwright/

# Reinstall browsers
npx playwright install
```

### Timeout Issues
- Increase timeout in `playwright.config.ts`
- Check if application is responding slowly

---

## Configuration

Edit `playwright.config.ts` to customize:
- Browser types and options
- Timeouts
- Retry logic
- Screenshot/video recording
- Test parallelization (currently disabled for sequential execution)

---

## Project Structure

```
/test
  ├── benefitDashboardUI_test.spec.ts    # UI tests
  ├── benefitDashboardAPI_test.spec.ts   # API tests
  ├── benDashboard_pom.ts                # Page Object Model
  └── helpers/
      └── benefitsDashboardCommon.ts     # Common utilities
playwright.config.ts                      # Playwright configuration
package.json                              # Dependencies and scripts
README.md                                 # This file
```

---

## Quick Start Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests headless |
| `npm run test:headed` | Run tests with browser UI visible |
| `npx playwright test --ui` | Interactive UI mode |
| `npx playwright test --debug` | Debug mode with step-by-step execution |
| `npm run test:report` | View HTML test report |
| `npx playwright test test/benefitDashboardUI_test.spec.ts` | UI tests only |
| `npx playwright test test/benefitDashboardAPI_test.spec.ts` | API tests only |

---

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Use POM for all UI interactions
3. Add meaningful test descriptions
4. Keep tests independent when possible
5. Update this README with new test scenarios

---

## ⚠️ Important Notes

### Shared Test Account
This test suite uses a **single shared account** (`TestUser841`) for all tests. This means:

- **All tests execute under the same authenticated user**
- Tests may create and modify the same data
- Running tests multiple times may leave employee records in the system
- **Recommendation:** Run tests in a test/staging environment, not production

### Test Data Management
- Tests create employee records that may persist between runs
- The delete test attempts to clean up, but may not remove all created employees
- To reset test data, you may need to manually delete employees via the UI or API

### Sequential Execution
- Tests are designed to run sequentially (`test.describe.serial()`)
- Do not run tests in parallel as they may interfere with each other
- Tests depend on the order: Load → Add → Edit → Delete

### Best Practices
1. **Use a test environment** - Do not run tests against production
2. **Monitor test data** - Keep track of created employees
3. **Clean up regularly** - Consider implementing cleanup between test runs if needed
4. **Run consistently** - Always run the full suite, not individual tests out of order

---

---

## Support

For issues or questions, please check:
- `playwright.config.ts` for configuration options
- Test output in `test-results/` directory
- HTML report in `playwright-report/` directory
