import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  private readonly page: Page;
  private readonly sortDropdown: Locator;
  private readonly cartLink: Locator;

  public readonly title: Locator;
  public readonly cartBadge: Locator;
  public readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.inventoryItems = page.getByTestId('inventory-item');
  }

  async addProductToCart(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({
      has: this.page.getByRole('link', { name: productName }),
    });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  firstProductName(): Locator {
    return this.inventoryItems.first().getByTestId('inventory-item-name');
  }

  firstProductPrice(): Locator {
    return this.inventoryItems.first().getByTestId('inventory-item-price');
  }

  async getAllPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItems
      .getByTestId('inventory-item-price')
      .allTextContents();

    return priceTexts.map((text) => Number(text.replace('$', '')));
  }
}
