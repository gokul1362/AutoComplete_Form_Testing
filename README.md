# Autocomplete Form — SDET Practical Assignment

A complete test engineering exercise for the Autocomplete Form spec: requirement analysis,
risk-ranked test scenarios, defect analysis, detailed test cases, and executable Playwright
UI/API automation — built against a small local mock server (since the assignment's URL and
backend are fictional).

## What's in here

```
├── docs/                          (Pratical Exercise Solutions)
│   ├── 1-requirement-analysis.md
│   ├── 2-test-scenarios.md
│   ├── 3-defect-identification.md
│   ├── 4-test-cases.md
│   ├── 7-ai-reflection.md
│   └── 8-architecture-discussion.md
├── mock-server/                  A tiny Express app implementing the assignment's spec,
│   ├── server.js                 so the test suite actually has something to run against
│   └── public/                   (index.html + app.js — the form itself)
├── tests/
│   ├── ui/
│   │   ├── pages/                Page Object Model
│   │   ├── tests/                Playwright UI test spec
│   │   └── config/                Shared test config/data
│   └── api/
│       ├── tests/                API contract & negative test spec
│       └── schemas/              JSON schema for the FR-05 data contract
├── playwright.config.js
└── package.json
```

## Prerequisites

- Node.js 18+
- npm

## Creating python virtual environment

```bash
python -m venv .venv       # creates virtual python env called .venv
.venv\Scripts\Activate.ps1  # Activates the virtual python env
```

## Setup

```bash
npm install
npx playwright install chromium   # downloads the browser binary Playwright drives
```

## Running the tests

The Playwright config automatically starts the mock server for you (via `webServer` in
`playwright.config.js`), so you normally don't need to start it manually.

```bash
npm test              # runs all UI + API tests
npm run test:ui        # UI tests only
npm run test:api       # API tests only
npm run test:report    # opens the HTML report from the last run
```

To run the mock server standalone (e.g. to poke at it manually in a browser, or with `curl`):

```bash
npm run mock-server
# then open http://localhost:4000/autocomplete-form
```

## Suggested reading order (if you're learning from this, like I am)

1. `docs/1-requirement-analysis.md` — what's actually being tested, and the ambiguities found
2. `docs/2-test-scenarios.md` — how to prioritize what to test first
3. `docs/3-defect-identification.md` — how to read an API response critically against a spec
4. `docs/4-test-cases.md` — turning scenarios into concrete, reproducible steps
5. `tests/ui/pages/AutocompleteFormPage.js` then `tests/ui/tests/autocomplete-form.spec.js` —
   how the Page Object Model pattern keeps Playwright tests maintainable
6. `tests/api/tests/autocomplete-api.spec.js` — schema/contract validation with Ajv
7. `docs/8-architecture-discussion.md` — the "why" behind the structural decisions

## Notes on scope

- `mock-server/` exists only because the assignment's target URL/API aren't real. It
  deliberately implements the fixed FR-05 defects correctly (e.g. `completed` as a boolean),
  and the negative tests exist to prove the suite _would_ catch it if that regressed.

## AI Usage Artifacts

As requested in the assignment, this repository includes:

- `prompts/prompts.md` – A summary of the prompts used during AI-assisted development.
- `ai-transcript/chatgpt-conversation.json` – The exported JSON transcript of the AI conversation.
