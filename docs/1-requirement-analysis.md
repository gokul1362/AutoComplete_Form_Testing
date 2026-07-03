# 1. Requirement Analysis

## What the form does
The user lands on `/autocomplete-form` after login. They either type free text or click a
suggestion from a fixed list of three seeded values:
`agile methodology`, `agile methodology process`, `agile methodology process testing`.
Clicking **Next** submits the value to a REST API, which must return `200` on success.

## Key ambiguities / assumptions found while analyzing the spec
These matter because they directly shape test design — an untested assumption is a hidden risk.

1. **What counts as "valid input"?**
   FR-04 says invalid input shows an error, but never defines "invalid." We assumed the only
   valid `text` is an **exact match** to one of the three suggestions (typed or clicked). Free
   text that happens to be a prefix but isn't a complete suggestion (e.g. "agile") is treated
   as invalid until it becomes an exact match. This assumption should be confirmed with the
   Admin/PM — it's the single biggest source of ambiguity in the whole spec.

2. **Case sensitivity and whitespace** are unspecified. Does "Agile Methodology" (different
   case) or "agile methodology " (trailing space) count as a match? We test both.

3. **`suggestion_list` semantics** — FR-05 says it's "suggestions matching the value
   entered/selected," but doesn't say whether that's captured at the moment of selection or
   re-evaluated at submit time (e.g. if the user selects, then keeps typing before hitting
   Next). We test the submit-time snapshot as the expected behavior.

4. **Locale source** — "IETF BCP 47 format of the user's locale" doesn't specify whether this
   comes from the browser (`navigator.language`), the OS, or an account profile setting. The
   sample response returns `"en"` instead of the environment's actual `en-IN`/`en-GB`-style
   value, which is one of the defects in Section 2 analysis.

5. **Timestamp precision/timezone** — "Timestamp in the user's local time" is ambiguous: does
   "local time" mean the string should be offset to IST (`+05:30`), or is UTC with an
   implicit understanding that the client renders it locally acceptable? The sample response
   uses `Z` (UTC) suffix, which we flag as worth clarifying, though it's defensible as "local
   time expressed in a standard, unambiguous format."

6. **Match-anywhere config (FR-03)** is backend-configurable but there's no way to inspect
   the current mode from the client. Tests must be written to work under whichever mode is
   active, or the mode must be exposed/mockable for deterministic testing (we exposed a
   `/api/config` endpoint in our mock backend for exactly this reason).

7. **Retry / idempotency on submit** — if the POST fails (network blip) and the user clicks
   Next again, does this create a duplicate record? Not specified; flagged as a risk in
   Section 2.

## Traceability
Every functional requirement (FR-01 to FR-05) is mapped to at least one test scenario in
`2-test-scenarios.md` and one or more concrete test cases in `4-test-cases.md`.
