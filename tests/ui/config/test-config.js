// Central place for environment values, so tests don't hardcode URLs/data.
module.exports = {
  baseURL: process.env.BASE_URL || 'http://localhost:4000',
  apiURL: process.env.API_URL || 'http://localhost:4000/api/',
  testUser: {
    account_id: '98765',
    account_email: 'test123@gmail.com',
  },
  suggestions: [
    'agile methodology',
    'agile methodology process',
    'agile methodology process testing',
  ],
};
