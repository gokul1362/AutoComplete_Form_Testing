# 2. Test Scenarios

## Objective

The objective of this document is to identify and prioritize the most critical test scenarios for the Autocomplete Form based on the functional requirements and business risk.

---

## Risk Priority

| Risk Level   | Description                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Critical** | Core functionality. Failure prevents users from completing the primary workflow or results in incorrect data being stored. |
| **High**     | Important functionality. Failure significantly impacts user experience or business requirements.                           |
| **Medium**   | Functionality affects usability but does not completely block the user.                                                    |
| **Low**      | Minor functionality with limited business impact.                                                                          |

---

# Top 10 Test Scenarios

| Rank   | Test Scenario                                                                                                                                                                                    | Risk Level   | Ranking Rationale                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **1**  | Verify that a user can select a valid suggestion and successfully submit the form.                                                                                                               | **Critical** | This is the primary purpose of the application. If users cannot submit a valid response, the entire feature becomes unusable. |
| **2**  | Verify that clicking the **Next** button sends a REST API request and receives an HTTP 200 response upon successful submission.                                                                  | **Critical** | Successful data persistence depends on the API call. A failure would prevent user responses from being saved.                 |
| **3**  | Verify that the backend stores all required fields (`account_id`, `account_email`, `start_date`, `end_date`, `locale`, `text`, `suggestion_list`, and `completed`) correctly according to FR-05. | **Critical** | Missing or incorrect data could lead to reporting issues, data integrity problems, and business failures.                     |
| **4**  | Verify that invalid input displays the appropriate error message and prevents form submission.                                                                                                   | **High**     | Invalid data should never be accepted. Proper validation protects the quality of stored information.                          |
| **5**  | Verify that suggestion filtering works correctly using the default **Prefix Match** behavior.                                                                                                    | **High**     | Suggestion filtering is a core feature of the autocomplete functionality and directly affects user interaction.               |
| **6**  | Verify that suggestion filtering works correctly when **Match Anywhere** mode is enabled through backend configuration.                                                                          | **High**     | This configurable feature must behave differently when enabled, ensuring backend configuration is respected.                  |
| **7**  | Verify that selecting a suggestion from the list automatically populates the input field.                                                                                                        | **Medium**   | Selecting suggestions is a common user interaction and should correctly update the input field.                               |
| **8**  | Verify that users can manually type text into the input field.                                                                                                                                   | **Medium**   | Manual text entry is a basic functional requirement and should work without restrictions.                                     |
| **9**  | Verify that a success message is displayed only after a successful form submission.                                                                                                              | **Medium**   | Users should receive clear confirmation that their response has been successfully recorded.                                   |
| **10** | Verify that the suggestion list updates dynamically as the user types.                                                                                                                           | **Low**      | Dynamic filtering improves usability but does not directly impact successful form submission or data storage.                 |

---

## Summary

The highest priority test scenarios focus on the application's primary workflow:

- Selecting a valid suggestion
- Successfully submitting the form
- Verifying API communication
- Ensuring correct backend data persistence

Lower-priority scenarios focus on usability improvements such as dynamic suggestion updates and user interface behavior.
