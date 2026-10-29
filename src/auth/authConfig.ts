const tenantId: string = import.meta.env.VITE_AZURE_TENANT_ID || 'YOUR_TENANT_ID';

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'YOUR_CLIENT_ID',
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

export const loginRequest = { scopes: ['openid', 'profile'] };

export const apiTokenRequest = {
  scopes: [import.meta.env.VITE_API_SCOPE || 'api://YOUR_API_CLIENT_ID/access_as_user'],
};

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api';
