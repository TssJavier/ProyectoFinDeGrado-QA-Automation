import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // El titulo debe contener un substring
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Pulsamos el enlace "Get started"
  await page.getByRole('link', { name: 'Get started' }).click();

  // Verificamos que la nueva URL es la esperada
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
