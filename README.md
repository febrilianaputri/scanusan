# Scanusan

## Authentication and API setup

The app uses a backend login API to verify bcrypt password hashes stored in MySQL, Firebase custom tokens for identity, and Firebase Admin SDK to validate custom-token ID tokens and issue server session cookies. MySQL is authoritative for employee roles, account status, password hashes, and inventory application data. Plain-text passwords are never stored in the database or browser storage.

### Prerequisites

- Node.js 20 or newer and pnpm
- A MySQL 8 database
- A Firebase project and service account for Firebase custom-token authentication
- A Firebase service account available to the backend through Application Default Credentials or `FIREBASE_SERVICE_ACCOUNT_JSON`

### Local setup

1. Copy `.env.example` to `.env` and set the MySQL connection, Firebase project ID, and Firebase web app values. Never commit `.env` or a service-account key.
2. Create a MySQL database and a restricted application user. Apply the schema:

   ```powershell
   Get-Content .\server\schema.sql -Raw | mysql -h 127.0.0.1 -u scanusan_admin -p scanusan
   ```

   Set `MYSQL_SSL=true` when the database provider requires TLS.
3. Configure Firebase web API key restrictions for the deployed app's domains. The web API key identifies the Firebase project; it is not a service-account credential. Disable the Firebase Email/Password sign-in provider: users are provisioned by the Admin API and sign in using short-lived Firebase custom tokens only.
4. Provision the first administrator by setting `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, and `BOOTSTRAP_ADMIN_PASSWORD` (minimum 12 characters) in the untracked `.env`, then run:

   ```powershell
   corepack pnpm install
   corepack pnpm bootstrap:admin
   ```

   This creates or links the Firebase identity, hashes the bootstrap password with bcrypt, and grants the MySQL employee row the `admin` role. Running the bootstrap command again rotates that admin password. Do not expose the bootstrap password in source control or build variables.
5. Start the API and Vite frontend in separate terminals:

   ```powershell
   corepack pnpm dev:api
   corepack pnpm dev
   ```

   Vite proxies `/api` to `http://localhost:3001`. Set `API_PROXY_TARGET` if the API runs elsewhere.

### Production

- Set `NODE_ENV=production`, `APP_ORIGIN` to the exact HTTPS frontend origin, `MYSQL_SSL=true` where supported, and all Firebase/MySQL environment values in the hosting platform's secret manager.
- Build the frontend and backend with `corepack pnpm build` and `corepack pnpm build:api`; run the API with `corepack pnpm start:api`.
- Serve frontend and `/api` on the same origin, or configure a trusted reverse proxy. The API requires the configured `Origin` for write requests and sets session cookies with `HttpOnly`, `Secure`, `SameSite=Strict`, and `Path=/api` in production.
- Apply `server/schema.sql` before starting the API. Restrict MySQL network access and use a database account with only the permissions the application needs.

### API security model

| Endpoint | Access |
| --- | --- |
| `POST /api/auth/login` | Email/password verification against bcrypt hash, rate limited; returns a Firebase custom token |
| `POST /api/auth/session` | Custom-provider Firebase ID token exchange |
| `GET /api/auth/session`, `DELETE /api/auth/session` | Session cookie |
| `PATCH /api/auth/profile` | Active employee session |
| `GET /api/data`, `PUT /api/data` | Active employee session; Operators cannot read/manage suppliers or alter transaction history |
| `POST /api/data/import-legacy` | Active Admin session; one-time import only when server data is empty |
| `GET /api/users`, `POST /api/users`, `PATCH /api/users/:id`, `POST /api/users/:id/reset-password` | Active Admin session |
| `GET /api/reports/export.csv` | Active Admin session |

Every protected request verifies the Firebase session cookie and reloads the active role from MySQL. Session exchange accepts only Firebase tokens authenticated with the custom-token provider. The frontend role checks are only for navigation and user experience; the server is authoritative. Passwords (12-72 UTF-8 bytes) are hashed with bcrypt (work factor 12) in the backend; a user's password is never assigned to a Firebase identity. The browser SDK uses in-memory persistence only; app login state stays in React memory and the session cookie is inaccessible to JavaScript.

On an Admin's first successful sign-in, any old local inventory collections are filtered to known inventory fields and submitted for a one-time import. Legacy local account/session values and any password field are discarded and are never sent to the API. The browser copy is removed only after a successful import; if the import fails or MySQL already contains inventory, the local copy is retained for recovery.

Existing client-side demo accounts are intentionally not migrated as identities. Provision the first Admin with the bootstrap command, then have an Admin recreate employee accounts with new initial passwords.

Inventory collections are currently persisted together in a MySQL JSON column to preserve the existing client data model. For high-write or multi-tenant production workloads, migrate those collections to normalized MySQL tables and use transactional domain-specific endpoints.
