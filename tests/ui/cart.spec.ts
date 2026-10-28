import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

async function loginAsStandardUser(page: Page): Promise<ProductsPage> {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(
    process.env.SAUCE_USERNAME || 'standard_user',
    process.env.SAUCE_PASSWORD || 'secret_sauce',
  );
  return new ProductsPage(page);
}

test.describe('SauceDemo cart', () => {
  test('cart badge shows 2 after adding two products', async ({ page }) => {
    const productsPage = await loginAsStandardUser(page);

    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');

    await expect(productsPage.cartBadge).toHaveText('2');
  });
});

test.describe('SauceDemo product sorting', () => {
  test('Price (low to high) shows cheapest product first', async ({ page }) => {
    const productsPage = await loginAsStandardUser(page);

    await productsPage.sortBy('Price (low to high)');

    const prices = await productsPage.getAllPrices();
    const lowest = Math.min(...prices);

    await expect(productsPage.firstProductPrice()).toHaveText(`$${lowest}`);
    expect(prices[0]).toBe(lowest);
    // Onesie is the cheapest item on SauceDemo
    await expect(productsPage.firstProductName()).toHaveText('Sauce Labs Onesie');
  });
});
