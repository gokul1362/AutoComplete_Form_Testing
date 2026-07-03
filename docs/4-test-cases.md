# 4. Detailed Test Cases

Covers the scenarios from `2-test-scenarios.md`. Environment for all cases (unless stated
otherwise): Chrome on Windows 10, browser language English, logged in as
`test123@gmail.com`, location India (IST, UTC+05:30).

---

### TC-01 — Valid selection persists a record matching the FR-05 contract exactly
- **Title:** Submitting a clicked suggestion creates a record with all FR-05 fields, correct types
- **Preconditions:** User logged in, on `/autocomplete-form`, default prefix-match mode active
- **Test Steps:**
  1. Navigate to `/autocomplete-form`
  2. Click the suggestion `agile methodology`
  3. Click **Next**
  4. GET the persisted response via the API
- **Expected Results:**
  - UI shows the success message, not the error message
  - API returns HTTP 200 on POST
  - GET response contains all 8 FR-05 fields
  - `completed` is JSON boolean `true` (not string)
  - `locale` matches `en-IN` (region-qualified BCP 47)
  - `account_id` = `98765`, `account_email` = `test123@gmail.com`
- **Test Data:** Suggestion clicked: `agile methodology`

---

### TC-02 — `completed` is returned as boolean type, never a string
- **Title:** Data type check on `completed` field
- **Preconditions:** At least one successful submission exists
- **Test Steps:**
  1. Submit a valid suggestion
  2. Inspect the raw JSON response body (not just a truthy check)
- **Expected Results:** `typeof response.completed === 'boolean'`; value is `true`
- **Test Data:** N/A (schema/type check)

---

### TC-03 — Invalid free-typed text does not persist a record
- **Title:** Clicking Next with unmatched free text shows error and creates no backend record
- **Preconditions:** User on `/autocomplete-form`, no prior submissions this session
- **Test Steps:**
  1. Type `this is not a real suggestion` into the input field
  2. Click **Next**
  3. Query the API for the latest response (or record count before/after)
- **Expected Results:**
  - UI shows the error message, not the success message
  - No new record is created in the backend (count unchanged, or POST returns non-200 e.g. 422)
- **Test Data:** Typed text: `this is not a real suggestion`

---

### TC-04 — `suggestion_list` reflects only the filtered/matching suggestions at submit time
- **Title:** suggestion_list excludes suggestions that don't match the submitted text
- **Preconditions:** Prefix-match mode (default) active
- **Test Steps:**
  1. Type `agile methodology process t` (matches only the third suggestion by prefix)
  2. Click the remaining visible suggestion to select it
  3. Click **Next**
  4. GET the persisted record
- **Expected Results:** `suggestion_list` = `"agile methodology process testing"` only — not all three
- **Test Data:** Typed prefix: `agile methodology process t`

---

### TC-05 — Locale is captured as the full region-qualified value, not language-only
- **Title:** Persisted locale matches the environment's actual BCP 47 locale (en-IN)
- **Preconditions:** Browser configured as English, user location India
- **Test Steps:**
  1. Submit a valid suggestion
  2. GET the persisted record
- **Expected Results:** `locale` = `en-IN` (or the browser's actual `navigator.language` value for this environment) — not bare `en`
- **Test Data:** N/A

---

### TC-06 — FR-03 match-anywhere mode surfaces suggestions containing the typed substring anywhere
- **Title:** Match-anywhere config shows suggestions matching mid-string, not just prefix
- **Preconditions:** Backend config `matchMode` set to `anywhere`
- **Test Steps:**
  1. Set backend config to match-anywhere mode
  2. Navigate to `/autocomplete-form`
  3. Type `methodology process` (not a prefix of any suggestion, but a substring of two)
- **Expected Results:** Suggestions containing the substring anywhere remain visible: `agile methodology process` and `agile methodology process testing`; `agile methodology` is hidden (doesn't contain the full substring)
- **Test Data:** Typed text: `methodology process`; config: `matchMode=anywhere`

---

### TC-07 — Full keyboard-only flow: Tab to suggestion, Enter to submit
- **Title:** User can complete the form using only the keyboard
- **Preconditions:** Page freshly loaded, no prior focus
- **Test Steps:**
  1. Press **Tab** — focus should land on the text input
  2. Press **Tab** again — focus should land on the first suggestion
  3. Press **Enter** — the focused suggestion should be selected into the input
  4. Press **Tab** to reach **Next**, then **Enter** to submit (or press Enter directly in input after selection)
- **Expected Results:** Input is populated with the selected suggestion; submission succeeds and the success message is shown; at no point was a mouse used
- **Test Data:** Suggestion selected via keyboard: `agile methodology`

---

### TC-08 — Escape key clears input and restores full suggestion list
- **Title:** Escape resets the input field without submitting
- **Preconditions:** User has typed a partial filter into the input
- **Test Steps:**
  1. Type `agile method`
  2. Verify suggestions are filtered
  3. Press **Escape**
- **Expected Results:** Input field is empty; all 3 suggestions are visible again; no API call was made; no success/error message shown
- **Test Data:** Typed text before Escape: `agile method`

---

### TC-09 — Double-clicking Next does not create duplicate records
- **Title:** Rapid double submission is not persisted twice
- **Preconditions:** A valid suggestion is selected in the input
- **Test Steps:**
  1. Select `agile methodology`
  2. Rapidly click **Next** twice (simulate double-click / slow network double-tap)
  3. Query the API for total record count for this session
- **Expected Results:** Only one record is persisted; the button is disabled (or submission is otherwise guarded) after the first click
- **Test Data:** Suggestion: `agile methodology`

---

### TC-10 — Case and whitespace handling on typed (not clicked) text
- **Title:** Typed text with different case or trailing whitespace matches the intended suggestion
- **Preconditions:** User on `/autocomplete-form`
- **Test Steps:**
  1. Type `Agile Methodology ` (capitalized, trailing space)
  2. Click **Next**
- **Expected Results:** Either (a) the system normalizes and accepts it as a valid match to `agile methodology`, or (b) it's explicitly rejected with the error message — the behavior should be **consistent and documented**, not undefined; this test's real purpose is to surface which behavior the system actually has, since the spec doesn't define it (see `1-requirement-analysis.md`)
- **Test Data:** Typed text: `Agile Methodology ` (note trailing space and capitalization)

---

## API-specific negative cases (see also `tests/api/tests/autocomplete-api.spec.js`)

### TC-11 — POST with a missing required field is rejected
- **Title:** Backend rejects payloads missing a required FR-05 field
- **Preconditions:** None
- **Test Steps:** POST a payload with `locale` omitted
- **Expected Results:** HTTP 400 (or equivalent client-error code), not 200; no record persisted
- **Test Data:** Payload missing `locale`

### TC-12 — POST with text not matching any suggestion is rejected
- **Title:** Backend enforces valid-selection rule server-side, not just client-side
- **Preconditions:** None
- **Test Steps:** POST directly to the API (bypassing the UI) with `text: "not a real suggestion"`
- **Expected Results:** HTTP 4xx, not 200; confirms validation isn't purely client-side and can't be bypassed by a direct API call
- **Test Data:** `text: "not a real suggestion"`
