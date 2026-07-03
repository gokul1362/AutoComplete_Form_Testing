# AI Reflection

## a. Tools Used

The following AI tools were used during this assignment:

- ChatGPT (GPT-5.5)
- Claude (anthropic)

---

## b. Usage Areas

AI was used as an assistant throughout the assignment in the following areas:

- Understanding and analyzing the functional requirements.
- Identifying requirement ambiguities and potential edge cases.
- Brainstorming and prioritizing risk-based test scenarios.
- Reviewing API responses against the specified data contract.
- Drafting test cases for both UI and API testing.
- Designing the Playwright automation framework using the Page Object Model.
- Generating an initial version of the API automation scripts.
- Improving the overall documentation structure and wording.

The generated content was reviewed and refined before being included in the final submission.

---

## c. Modifications Made

### Example 1 – Improved Test Scenarios (Exercise 1)

The initial AI-generated test scenarios were high-level and lacked some technical details.

For example, the highest-priority test scenario only mentioned verifying a successful form submission. I refined it by explicitly including the validation that a successful submission should return **HTTP Status Code 200**, as specified in **FR-04**. This made the scenario more precise and aligned it with the functional requirements.

Additionally, one of the scenarios focused on backend data validation but did not explicitly reference **FR-05 (Backend Data Contract)**. I updated the scenario to reference the requirement directly, improving traceability between the test scenario and the specification.

---

### Example 2 – Enhanced Defect Identification (Exercise 2)

The AI correctly identified the discrepancies between the API response and the specification. However, it did not assign a severity level to each identified defect.

I reviewed each discrepancy and classified it based on its potential impact on the application and data integrity (Critical, High, and Low). This made the defect report more actionable and helped prioritize issues for development and QA teams.

---

## d. AI Limitations

While AI was helpful for generating an initial draft, I found that it could overlook important details or make assumptions when interpreting the assignment specification. The generated output therefore required manual review and validation to ensure it aligned with the documented requirements.

### Example 1

A misalignment occurred during the automation task. The assignment required the Playwright scripts to be **executable**, but the provided URL (`https://test.com/autocomplete-form`) is a placeholder and does not host a real application. Initially, the AI generated Playwright scripts that targeted this URL directly without recognizing that the tests could not actually be executed.

After reviewing the assignment, I identified this limitation and implemented a **mock server** to simulate the application's behavior. This allowed the automation suite to be executed and verified while satisfying the assignment requirement for executable test scripts.

### Example 2

The HTML that was created for mock server it really did not behave like expected. The suggestion list should only shown when the user is suppose to type something. But the suggestion list was displayed even with zero entry and this caused one test case to fail.

If little more time was given for the completion of the assignment, It was possible for me to find a solution to fix this.

This experience reinforced that AI is a valuable productivity tool for generating ideas and accelerating development, but its output should always be reviewed, validated, and refined by the engineer before being used in a final deliverable.
