/**
 * Page Object Model for the Autocomplete Form.
 * Encapsulates all locators and interactions so test files stay readable
 * and don't repeat selectors.
 */
class AutocompleteFormPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.input = page.locator('#input-field');
    this.suggestionsList = page.locator('#suggestions-list');
    this.suggestionItems = page.locator('#suggestions-list li');
    this.nextButton = page.locator('#next-button');
    this.errorMessage = page.locator('#error-message');
    this.successContainer = page.locator('#success-container');
  }

  async goto(baseURL) {
    await this.page.goto(`${baseURL}/autocomplete-form`);
  }

  async typeText(text) {
    await this.input.fill(text);
  }

  async pressEnterInInput() {
    await this.input.press('Enter');
  }

  async pressEscapeInInput() {
    await this.input.press('Escape');
  }

  /** Returns the visible (not hidden) suggestion text values, in DOM order. */
  async getVisibleSuggestions() {
    const items = await this.suggestionItems.all();
    const visible = [];
    for (const item of items) {
      if (await item.isVisible()) {
        visible.push((await item.textContent()).trim());
      }
    }
    return visible;
  }

  async clickSuggestionByText(text) {
    await this.page.locator(`#suggestions-list li[data-value="${text}"]`).click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async isErrorVisible() {
    return this.errorMessage.evaluate((el) => el.classList.contains('visible'));
  }

  async isSuccessVisible() {
    return this.successContainer.evaluate((el) => el.classList.contains('visible'));
  }

  /** Tabs forward from document body through the form, n times. */
  async tabForward(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.page.keyboard.press('Tab');
    }
  }

  async getFocusedElementId() {
    return this.page.evaluate(() => document.activeElement.id);
  }
}

module.exports = { AutocompleteFormPage };
