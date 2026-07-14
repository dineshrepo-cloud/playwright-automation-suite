import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('SauceDemo checkout', () => {
  test('completes checkout and shows thank-you message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login(
      process.env.SAUCE_USERNAME || 'standard_user',
      process.env.SAUCE_PASSWORD || 'secret_sauce',
    );

    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Fleece Jacket');
    await productsPage.openCart();

    await checkoutPage.completeCheckout('Jane', 'Doe', '90210');

    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
