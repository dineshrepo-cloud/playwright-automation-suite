import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('SauceDemo login', () => {
  test('standard user can log in and lands on products', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.open();
    await loginPage.login(
      process.env.SAUCE_USERNAME || 'standard_user',
      process.env.SAUCE_PASSWORD || 'secret_sauce',
    );

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(productsPage.title).toHaveText('Products');
  });

  test('locked-out user sees error and stays logged out', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(
      'locked_out_user',
      process.env.SAUCE_PASSWORD || 'secret_sauce',
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});
