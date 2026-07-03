/**
 * Mock server for the Autocomplete Form assignment.
 *
 * Why this exists:
 * The assignment references a fictional URL (https://test.com/autocomplete-form)
 * with no real backend. To make the Playwright/API tests in this repo ACTUALLY
 * runnable (not just theoretical), this mock server implements:
 *   - The HTML form described in the assignment (served at /autocomplete-form)
 *   - The REST API described in FR-04/FR-05 (POST/GET /api/responses)
 *   - A toggle for FR-02 (prefix match) vs FR-03 (match-anywhere), to mirror
 *     the "configurable by an Admin" behavior.
 *
 * Run with: npm run mock-server
 */
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;

// In-memory "backend config" - mirrors the Admin-configurable matching mode.
let config = {
  matchMode: 'prefix', // 'prefix' (FR-02, default) | 'anywhere' (FR-03)
};

// In-memory store of submitted responses, keyed by an incrementing id.
const responses = [];

// Fixed "logged in" user, per the assignment's Test Environment Details.
const TEST_USER = {
  account_id: '98765',
  account_email: 'test123@gmail.com',
};

const SUGGESTIONS = [
  'agile methodology',
  'agile methodology process',
  'agile methodology process testing',
];

app.get('/api/config', (req, res) => {
  res.status(200).json(config);
});

app.post('/api/config', (req, res) => {
  const { matchMode } = req.body || {};
  if (!['prefix', 'anywhere'].includes(matchMode)) {
    return res.status(400).json({ error: 'matchMode must be "prefix" or "anywhere"' });
  }
  config.matchMode = matchMode;
  res.status(200).json(config);
});

app.get('/api/suggestions', (req, res) => {
  res.status(200).json({ suggestions: SUGGESTIONS, matchMode: config.matchMode });
});

// FR-04 / FR-05: persist a submitted response.
app.post('/api/responses', (req, res) => {
  const body = req.body || {};
  const requiredFields = [
    'start_date',
    'end_date',
    'locale',
    'text',
    'suggestion_list',
    'completed',
  ];
  const missing = requiredFields.filter((f) => !(f in body));
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  // FR-01/02/03 validation: text must exactly equal one of the suggestions
  // to count as a "valid" selection. Free-typed text that doesn't match any
  // suggestion is invalid per the error-message element in the spec.
  const isValid = SUGGESTIONS.includes(body.text);
  if (!isValid) {
    return res.status(422).json({ error: 'Invalid input. Please select a valid suggestion.' });
  }

  const record = {
    id: responses.length + 1,
    account_id: TEST_USER.account_id,
    account_email: TEST_USER.account_email,
    start_date: body.start_date,
    end_date: body.end_date,
    locale: body.locale,
    text: body.text,
    suggestion_list: body.suggestion_list,
    completed: body.completed === true, // real boolean, not a string
  };
  responses.push(record);
  res.status(200).json(record);
});

app.get('/api/responses/latest', (req, res) => {
  if (responses.length === 0) {
    return res.status(404).json({ error: 'No responses submitted yet' });
  }
  res.status(200).json(responses[responses.length - 1]);
});

app.get('/api/responses/:id', (req, res) => {
  const record = responses.find((r) => r.id === Number(req.params.id));
  if (!record) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(record);
});

// Convenience alias matching the assignment's documented URL path.
app.get('/autocomplete-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mock autocomplete-form server running at http://localhost:${PORT}/autocomplete-form`);
});
