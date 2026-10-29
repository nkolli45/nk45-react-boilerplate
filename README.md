# NK React 26 Boilerplate

A fresh React + TypeScript starter with Home, Products, Posts, and Users tabs. Login is temporarily bypassed so you can explore the UI immediately. The tabs load public sample data from [DummyJSON](https://dummyjson.com/docs), and show both a visual preview and the raw JSON response. MSAL setup and a typed protected API client are included for later use.

## Run locally

```sh
npm install
cp .env.example .env
npm run dev
```

The UI runs without an Azure setup while sign-in is bypassed. When you're ready to restore login, copy `.env.example` to `.env`, register a Microsoft Entra **Single-page application**, add the development redirect URI shown by Vite (usually `http://localhost:5173`), and expose and grant consent to a delegated API scope such as `api://<api-client-id>/access_as_user`.

When enabled, Microsoft handles the sign-in page; the app never collects a Microsoft password. The Axios request interceptor calls `acquireTokenSilent` for the configured API scope and attaches the bearer token. MSAL owns its browser cache; the app does not persist a copied token. If token acquisition needs interactive consent or sign-in, start that interaction from an explicit UI action.

Home, Products, Posts, and Users are separate routes in `src/App.tsx`. The public sample API client is `src/api/publicApiClient.ts`. The MSAL-protected API client remains in `src/api/httpClient.ts` for future app endpoints.
