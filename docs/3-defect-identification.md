# 3. Defect Identification — Sample Response vs. FR-05

## Sample response under review

```json
{
  "account_id": "98765",
  "account_email": "test123@gmail.com",
  "start_date": "2024-03-15T10:30:00Z",
  "end_date": "2024-03-15T10:32:00Z",
  "locale": "en",
  "text": "agile methodology",
  "suggestion_list": "agile methodology, agile methodology process, agile methodology process testing",
  "completed": "true"
}
```

All 8 required FR-05 fields are present — nothing is _missing_. The discrepancies are in the
**values and types**, which is arguably worse: a missing field fails loudly, a wrong-typed or
wrong-value field fails silently.

## Discrepancies found

### 1. `completed` is a string, not a boolean — **Critical**

FR-05 specifies `completed` as "Boolean representing the status of form response upload."
The sample returns `"true"` (string) instead of `true` (boolean).
**Impact:** In any strictly-typed consumer (schema validators, statically typed backend
services, some ORMs), a truthy _string_ `"false"` still evaluates as truthy. A record with
`completed: "false"` could be silently treated as completed. This is the single most dangerous
defect in the sample because it fails silently rather than throwing an error.

### 2. `locale` is missing the region subtag — **High**

The Test Environment is explicitly India, Chrome language set to English, IST timezone. FR-05's
own example format is `en-IN`. The sample returns bare `"en"`.
**Impact:** `en` is technically a valid BCP 47 primary language tag, so this won't fail a naive
"is it a string" check — but it loses region information the spec's own example implies is
expected. Any feature keying off region (date formatting, currency, region-specific content,
compliance/consent logic) gets the wrong behavior for every user, since the capture logic
appears to truncate to language-only rather than using the full locale (e.g.
`navigator.language`, which would return `en-IN` in this environment, was likely not used, or
was parsed incorrectly).

### 3. Timestamps use UTC (`Z` suffix), but the field is documented as "local time" — **Medium**

FR-05 describes `start_date`/`end_date` as "Timestamp in the user's local time when they
reached/selected Next." The sample values end in `Z`, i.e., UTC, with no `+05:30` offset applied
for the documented IST test environment.
**Impact:** This is ambiguous rather than a clear-cut bug — a UTC timestamp is a defensible,
unambiguous way to represent an instant, and clients can render it in local time. But as
written, the field name promises "local time" and the value doesn't reflect the user's actual
local offset. This should be clarified with the spec owner: either (a) the field name is
misleading and UTC is intentional, or (b) the capture logic is missing a timezone conversion
step. Flagging rather than asserting, since both readings are plausible.

## Not flagged as a defect (but worth commenting)

`suggestion_list` returns all three suggestions for a selection of `"agile methodology"`. This
looks suspicious at first glance ("shouldn't it only show what matches?"), Because according to unspoken rule of suggestion list, the suggestion list should only contain `"agile methodology process"`,
`"agile methodology process testing"` but under the
**default prefix-match mode (FR-02)**, `"agile methodology"` is a valid prefix of all three
suggestions (`"agile methodology"`, `"agile methodology process"`,
`"agile methodology process testing"`), so all three legitimately remain visible/matching at
the moment of selection. This is consistent with the spec, not a discrepancy — included here to
show the reasoning explicitly rather than silently passing over it.

## Defect Severity Summary

| Defect                                                                                   | Severity                      | Reason                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `completed` is returned as a **string** instead of a **Boolean**                         | **Critical**                  | Incorrect data type violates the API contract and may cause failures for clients expecting a Boolean value.                                                                      |
| `start_date` and `end_date` are returned in **UTC** instead of the user's local timezone | **High**                      | The response does not satisfy the specified data contract and may lead to incorrect reporting or audit information.                                                              |
| `locale` is returned as `en` instead of `en-IN`                                          | **High**                      | The response does not fully identify the user's locale as required, which may affect localization and reporting.                                                                 |
| `suggestion_list` contains all suggestions instead of only matching suggestions          | **Low (Needs Clarification)** | The requirement is somewhat ambiguous. If "matching suggestions" means only filtered suggestions, this is a defect. Otherwise, clarification from the Product Owner is required. |
