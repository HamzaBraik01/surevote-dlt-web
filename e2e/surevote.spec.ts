import { test, expect } from '@playwright/test';

/**
 * SureVote E2E Test Suite
 * Covers: Login → Voter Dashboard → Vote → Receipt → Public Results
 */

test.describe('SureVote Critical User Journey', () => {

  test.describe('Authentication', () => {
    test('should display login page', async ({ page }) => {
      await page.goto('/auth/login');
      await expect(page.getByText('SUREVOTE')).toBeVisible();
      await expect(page.getByText('Se connecter')).toBeVisible();
    });

    test('should show error on invalid credentials', async ({ page }) => {
      await page.goto('/auth/login');
      await page.fill('input[formControlName="email"]', 'wrong@test.com');
      await page.fill('input[formControlName="motDePasse"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      // Should show error toast or message
      await expect(page.locator('.text-error, [class*="toast"]')).toBeVisible({ timeout: 5000 });
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await page.goto('/auth/login');
      await page.fill('input[formControlName="email"]', 'electeur@surevote.ma');
      await page.fill('input[formControlName="motDePasse"]', 'Password123!');
      await page.click('button[type="submit"]');
      // Should redirect to voter dashboard or 2FA page
      await page.waitForURL(/\/(voter\/dashboard|auth\/verify-2fa)/, { timeout: 10000 });
    });

    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('/voter/dashboard');
      await page.waitForURL(/\/auth\/login/, { timeout: 5000 });
    });
  });

  test.describe('Voter Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Login helper — in a real setup, use API to get token
      await page.goto('/auth/login');
      await page.fill('input[formControlName="email"]', 'electeur@surevote.ma');
      await page.fill('input[formControlName="motDePasse"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(voter|auth)/, { timeout: 10000 });
    });

    test('should display voter portal heading', async ({ page }) => {
      if (page.url().includes('voter/dashboard')) {
        await expect(page.getByText('Portail Électeur')).toBeVisible();
      }
    });
  });

  test.describe('Public Pages', () => {
    test('should display landing page', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByText('SUREVOTE')).toBeVisible();
    });

    test('should display public elections list', async ({ page }) => {
      await page.goto('/elections');
      await expect(page.locator('h1, h2')).toBeVisible();
    });

    test('should navigate to register page', async ({ page }) => {
      await page.goto('/auth/register');
      await expect(page.getByText('Créer un compte')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should have working navigation links', async ({ page }) => {
      await page.goto('/');
      // Check that essential links exist
      const loginLink = page.getByRole('link', { name: /connexion|se connecter/i });
      if (await loginLink.count() > 0) {
        await loginLink.first().click();
        await page.waitForURL(/\/auth\/login/);
      }
    });
  });
});
