import axios from 'axios';

// Public practice data only. Keep this separate from the MSAL-protected client.
const publicApiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: { Accept: 'application/json' },
  timeout: 10000,
});

export default publicApiClient;
