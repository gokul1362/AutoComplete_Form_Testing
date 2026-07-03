const { test, expect } = require('@playwright/test');
const { AutocompleteFormPage } = require('../pages/AutocompleteFormPage');
const config = require('../config/test-config');

test.describe('Autocomplete Form - UI', () => {
  let form;

  test.beforeEach(async ({ page, baseURL }) => {
    form = new AutocompleteFormPage(page);
    await form.goto(baseURL);
  });

  test.describe('Suggestion Filtering (FR-02 prefix match)', () => {
    test('typing a matching prefix keeps matching suggestions visible', async () => {
      await form.typeText('agile methodology p');
      const visible = await form.getVisibleSuggestions();
      expect(visible).toEqual([
        'agile methodology process',
        'agile methodology process testing',
      ]);
    });

    test('typing text with no matching prefix hides all suggestions', async () => {
      await form.typeText('zzz-no-match');
      const visible = await form.getVisibleSuggestions();
      expect(visible).toEqual([]);
    });

    test('clearing input restores all suggestions', async () => {
      await form.typeText('agile');
      await form.typeText('');
      const visible = await form.getVisibleSuggestions();
      expect(visible).toHaveLength(3);
    });
  });

  test.describe('Suggestion Selection', () => {
    test('clicking a suggestion populates the input field', async () => {
      await form.clickSuggestionByText('agile methodology process');
      await expect(form.input).toHaveValue('agile methodology process');
    });

    test('selecting a suggestion clears any prior error message', async () => {
      await form.typeText('not a real suggestion');
      await form.clickNext();
      expect(await form.isErrorVisible()).toBe(true);

      await form.clickSuggestionByText('agile methodology');
      expect(await form.isErrorVisible()).toBe(false);
    });
  });

  test.describe('Keyboard Interaction', () => {
    test('pressing Enter after selecting a valid suggestion submits the form', async () => {
      await form.clickSuggestionByText('agile methodology');
      await form.pressEnterInInput();
      await expect(form.successContainer).toHaveClass(/visible/);
    });

    test('pressing Escape clears the input and shows all suggestions again', async () => {
      await form.typeText('agile method');
      await form.pressEscapeInInput();
      await expect(form.input).toHaveValue('');
      const visible = await form.getVisibleSuggestions();
      expect(visible).toHaveLength(3);
    });
  });

  test.describe('Tab Navigation', () => {
    test('Tab moves focus through input, suggestions, and Next button in order', async ({ page }) => {
      await page.locator('body').click(); // ensure no residual focus
      await form.tabForward(1);
      expect(await form.getFocusedElementId()).toBe('input-field');

      await form.tabForward(1);
      const secondFocusId = await page.evaluate(() => document.activeElement.dataset.value);
      expect(secondFocusId).toBe('agile methodology');
    });
  });

  test.describe('Form Submission', () => {
    test('submitting a valid suggestion shows the success message', async () => {
      await form.clickSuggestionByText('agile methodology');
      await form.clickNext();
      expect(await form.isSuccessVisible()).toBe(true);
      expect(await form.isErrorVisible()).toBe(false);
    });

    test('submitting free-typed text that does not match any suggestion shows an error', async () => {
      await form.typeText('this is not valid');
      await form.clickNext();
      expect(await form.isErrorVisible()).toBe(true);
      expect(await form.isSuccessVisible()).toBe(false);
    });

    test('submitting an empty input shows an error', async () => {
      await form.clickNext();
      expect(await form.isErrorVisible()).toBe(true);
    });
  });
});
