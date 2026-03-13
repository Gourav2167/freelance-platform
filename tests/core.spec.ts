import { test, expect } from '@playwright/test';

test.describe('Vasudha Platform Missions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Homepage Identity Verification', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('VASUDHA');
    await expect(page.locator('text=INBOUND ACCESS')).toBeVisible();
  });

  test('Critical 404 Recovery Journey', async ({ page }) => {
    await page.goto('http://localhost:3000/invalid-sector');
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=SECTOR NOT FOUND')).toBeVisible();
    
    // Test the recovery button
    await page.click('text=RETURN TO COMMAND');
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('Auth Flow - Sonner Toast Validation', async ({ page }) => {
    await page.click('text=INBOUND ACCESS');
    
    // Choose Freelancer role
    await page.click('text=Freelancer');
    
    // Trigger intentional failure
    await page.fill('input[type="email"]', 'wrong@user.com');
    await page.fill('input[type="password"]', 'wrongpass');
    
    // Click AUTHENTICATE - use text selector and wait for response
    await page.click('button:has-text("AUTHENTICATE")');
    
    // Take a screenshot to see the state if it fails
    try {
      // Wait for any network load or internal logic
      await page.waitForTimeout(2000);
      await expect(page.locator('text=PROTOCOL FAILURE')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('ol[data-sonner-toaster]')).toBeVisible();
    } catch (e) {
      await page.screenshot({ path: 'test-failure-auth-v2.png' });
      throw e;
    }
  });
});
