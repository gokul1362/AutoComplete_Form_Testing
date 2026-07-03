# 8. Architecture Discussion

## Why a mock server exists in this repo
The assignment describes `https://test.com/autocomplete-form` and a REST API, but neither is a
real, reachable system — the assignment expects you to design tests *as if* it existed. To make
this repository's test suite genuinely runnable (not just theoretical scripts), `mock-server/`
implements the HTML structure and API contract exactly as documented in the assignment,
including:
- FR-02 (prefix match, default) and FR-03 (match-anywhere, configurable) via `/api/config`
- FR-04 submission semantics (200 on success, error on invalid input)
- FR-05's exact field set, with `completed` returned as a real boolean (the mock intentionally
  fixes the defect found in the sample response, so tests validate *correct* behavior; the
  negative test cases in `tests/api/tests/` prove the validation logic would catch it if it
  regressed)

In a real-world assignment submission for an actual company, you would point `baseURL` at their
staging environment instead — the Page Object Model and test structure wouldn't change at all,
only `tests/ui/config/test-config.js` and `playwright.config.js`'s `use.baseURL`.

## Design pattern: Page Object Model (POM)
`AutocompleteFormPage` (in `tests/ui/pages/`) is the single place that knows about CSS
selectors and low-level interactions. Test files (`tests/ui/tests/`) only call high-level
methods like `clickSuggestionByText()` or `isSuccessVisible()`. This means:
- If the form's markup changes (e.g. `#next-button` becomes `.btn-next`), only one file needs
  updating.
- Test intent stays readable — a reviewer can understand *what* is being tested without wading
  through selectors.

## Why API tests are separate from UI tests
`tests/api/` tests the REST contract directly via HTTP calls, independent of the browser. This
matters because:
1. It's much faster (no browser, no rendering) — good for a tight feedback loop.
2. It catches **server-side validation gaps** that a UI-only test suite would never find (see
   TC-12 in `4-test-cases.md`) — the UI's own JS can block bad input before it ever reaches the
   network, hiding a missing server-side check.
3. Schema/contract regressions (e.g. `completed` silently becoming a string again) are much
   easier to assert precisely against a JSON body than by inspecting rendered HTML.

## What would change for a production suite
- Config/secrets (like `baseURL`) would move to environment-specific `.env` files, not
  hardcoded defaults.
- CI would run against a real staging environment with test-data cleanup between runs (this
  mock resets on server restart, which isn't realistic for a persistent backend).
- Visual/cross-browser coverage (Firefox, WebKit, mobile viewports) would be added via
  additional Playwright `projects` entries.
- Authentication (login) would need its own fixture/setup step, since the assignment explicitly
  scopes login out — a real suite can't skip it.
