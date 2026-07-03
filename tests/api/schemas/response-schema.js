// Schema for the persisted response object, per FR-05.
// Used with ajv for structural + type validation.
const responseSchema = {
  type: 'object',
  required: [
    'account_id',
    'account_email',
    'start_date',
    'end_date',
    'locale',
    'text',
    'suggestion_list',
    'completed',
  ],
  additionalProperties: true, // 'id' is allowed as an extra server-side field
  properties: {
    account_id: { type: 'string' },
    account_email: { type: 'string', format: 'email' },
    start_date: { type: 'string', format: 'date-time' },
    end_date: { type: 'string', format: 'date-time' },
    // IETF BCP 47: e.g. "en", "en-IN", "en-US". Simple pragmatic pattern.
    locale: { type: 'string', pattern: '^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8})*$' },
    text: { type: 'string', minLength: 1 },
    suggestion_list: { type: 'string' },
    completed: { type: 'boolean' }, // must be a real boolean, not "true"/"false" string
  },
};

module.exports = { responseSchema };
