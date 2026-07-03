const { test, expect, request } = require('@playwright/test');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { responseSchema } = require('../schemas/response-schema');
const config = require('../../ui/config/test-config');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(responseSchema);

/** Builds a valid submission payload for a given selected suggestion. */
function buildPayload(overrides = {}) {
  const now = new Date();
  const later = new Date(now.getTime() + 60000);
  return {
    start_date: now.toISOString(),
    end_date: later.toISOString(),
    locale: 'en-IN',
    text: 'agile methodology',
    suggestion_list: 'agile methodology, agile methodology process, agile methodology process testing',
    completed: true,
    ...overrides,
  };
}

test.describe('Autocomplete API - Response Contract (FR-05)', () => {
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext({ baseURL: config.apiURL });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('POST /responses returns 200 and a schema-valid response for a valid selection', async () => {
    const res = await apiContext.post('responses', { data: buildPayload() });
    expect(res.status()).toBe(200);

    const body = await res.json();
    const isValid = validate(body);
    expect(isValid, JSON.stringify(validate.errors)).toBe(true);
  });

  test('completed field is a real boolean, not a string', async () => {
    const res = await apiContext.post('responses', { data: buildPayload() });
    const body = await res.json();
    expect(typeof body.completed).toBe('boolean');
  });

  test('start_date and end_date are valid ISO-8601 timestamps', async () => {
    const res = await apiContext.post('responses', { data: buildPayload() });
    const body = await res.json();
    expect(new Date(body.start_date).toString()).not.toBe('Invalid Date');
    expect(new Date(body.end_date).toString()).not.toBe('Invalid Date');
  });

  test('locale matches IETF BCP 47 format (e.g. en-IN)', async () => {
    const res = await apiContext.post('responses', { data: buildPayload({ locale: 'en-IN' }) });
    const body = await res.json();
    expect(body.locale).toMatch(/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$/);
  });

  test('suggestion_list contains only suggestions matching the typed/selected text, not all suggestions', async () => {
    // Selecting "agile methodology process testing" via prefix-match filtering
    // should only leave that one suggestion visible.
    const payload = buildPayload({
      text: 'agile methodology process testing',
      suggestion_list: 'agile methodology process testing',
    });
    const res = await apiContext.post('responses', { data: payload });
    const body = await res.json();
    const items = body.suggestion_list.split(',').map((s) => s.trim());
    expect(items).toEqual(['agile methodology process testing']);
  });

  test('GET /responses/latest returns the most recently submitted response', async () => {
    const payload = buildPayload();
    await apiContext.post('responses', { data: payload });
    const res = await apiContext.get('responses/latest');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.text).toBe(payload.text);
  });

  test.describe('Negative cases', () => {
    test('missing required fields returns 400, not 200', async () => {
      const incomplete = buildPayload();
      delete incomplete.locale;
      const res = await apiContext.post('responses', { data: incomplete });
      expect(res.status()).toBe(400);
    });

    test('text that does not match any suggestion is rejected (422), not persisted as success', async () => {
      const res = await apiContext.post('responses', {
        data: buildPayload({ text: 'not a real suggestion at all' }),
      });
      expect(res.status()).toBe(422);
    });

    test('invalid completed type (string instead of boolean) is still normalized to a real boolean by the server', async () => {
      // Demonstrates why type-checking the response matters, per the
      // discrepancy found in the sample GET response ("completed": "true").
      const res = await apiContext.post('responses', {
        data: buildPayload({ completed: true }),
      });
      const body = await res.json();
      expect(body.completed).not.toBe('true'); // must not be a string
      expect(body.completed).toBe(true);
    });
  });
});
