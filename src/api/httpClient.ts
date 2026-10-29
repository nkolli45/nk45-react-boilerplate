import axios from 'axios';
import { apiBaseUrl, apiTokenRequest } from '../auth/authConfig';
import { msalInstance } from '../auth/msalInstance';

const httpClient = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Let MSAL read or renew its cache for each request. Don't persist a copied token.
httpClient.interceptors.request.use(async (config) => {
  const account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];
  if (!account) throw new Error('Sign in before making an API request.');

  const tokenResponse = await msalInstance.acquireTokenSilent({ ...apiTokenRequest, account });
  config.headers.Authorization = `Bearer ${tokenResponse.accessToken}`;
  return config;
});

export default httpClient;
