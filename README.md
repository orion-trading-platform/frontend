# Orion Frontend

React/TypeScript frontend for the Orion paper-trading platform. This app presents the user-facing trading experience: landing and authentication flows, portfolio dashboard, stock search, order entry, wallet, profile management, and ledger/history views.

Orion was built for Rice COMP 413 as a distributed software construction project. The frontend's main role is to integrate independently developed backend services into one coherent product experience.

## Feature overview

- **Landing and brand experience:** responsive public landing page, market preview cards, product messaging, and Orion visual assets.
- **Authentication:** email/password registration and login, Google OAuth, reCAPTCHA, refresh-token session restore, password reset, profile modal, password changes, account deletion, and protected routes.
- **Dashboard:** Mag 7 market snapshot cards, account summary cards, performance chart, recent activity, holdings table, ticker search, theme toggle, wallet/ledger/profile navigation.
- **Ordering:** stock search, URL-synced symbols, live price updates from the market data API, historical stock charts, order book visualization, order-entry validation, review modal, and submit/cancel calls to the trading engine.
- **Wallet:** account cash display and deposit flow backed by the database/account API and ledger transaction records.
- **Ledger:** account history and P&L view with summary cards, activity filters, detail rows, export/print affordances, and backend-backed ledger queries.
- **Transactional emails:** React Email templates exported to HTML and copied into the database service's Python and Go email directories.

## Repository structure

```text
frontend/
├── apps/
│   └── web_client/                 # Vite React app
│       ├── src/
│       │   ├── features/
│       │   │   ├── auth/           # auth context, login/signup/reset/profile flows, API clients
│       │   │   ├── dashboard/      # dashboard cards, charts, holdings, activity, search
│       │   │   ├── ledger/         # account history and P&L screens
│       │   │   ├── ordering/       # stock page, chart, order book, order panel, order API calls
│       │   │   └── wallet/         # account cash and deposit flow
│       │   ├── assets/             # logos, landing art, SVGs
│       │   └── App.tsx             # routes and protected-route wiring
│       └── public/                 # static assets and sample data
├── packages/
│   ├── styles/                     # shared CSS reset/tokens
│   ├── transactional/              # React Email templates and exported HTML
│   ├── ts-config/                  # shared TypeScript config
│   └── ui-kit/                     # shared UI primitives
├── Dockerfile                      # production build served by nginx
└── nginx.conf
```

## Local development

### Prerequisites

- Node.js 20+
- npm
- Running backend services for full functionality:
  - `database-system` on `http://localhost:8000`
  - `market-data-api` on `http://localhost:8001`
  - `trading-engine` on `http://localhost:8002`

### Setup

```bash
git clone https://github.com/orion-trading-platform/frontend.git
cd frontend
npm install
cp apps/web_client/.env.example apps/web_client/.env
```

Update `apps/web_client/.env` as needed:

```bash
VITE_BACKEND_URL=http://localhost:8000
VITE_MARKET_DATA_URL=http://localhost:8001
VITE_TRADING_ENGINE_URL=http://localhost:8002
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
VITE_PORT=5173
```

Start the dev server from the repo root:

```bash
npm run dev -w web-client
```

Or from the app directory:

```bash
cd apps/web_client
npm run dev
```

Open `http://localhost:5173`.

## Scripts

```bash
npm install                    # install all workspaces
npm run dev -w web-client      # start Vite dev server
npm run build -w web-client    # type-check and build production assets
npm run preview -w web-client  # preview the production build locally
npm run dev -w transactional   # preview email templates
npm run export -w transactional # export email templates to static HTML
```

## Backend integration

The app uses three service clients:

| Client | Environment variable | Local default | Used for |
| --- | --- | --- | --- |
| `api` | `VITE_BACKEND_URL` | `http://localhost:8000` | Auth, accounts, holdings, wallet, ledger, transactions, account data. |
| `marketApi` | `VITE_MARKET_DATA_URL` | `http://localhost:8001` | Stock search, snapshots, quotes, bars, S&P 500/Mag 7 data, SSE streams. |
| `tradingApi` | `VITE_TRADING_ENGINE_URL` | `http://localhost:8002` | Order submission and cancellation. |

`features/auth/api.ts` attaches access tokens to authenticated database/trading requests and handles access-token refresh on recoverable `401` responses. The ordering feature has dedicated wrappers in `features/ordering/api/` so UI components do not call backend endpoints directly.

## Build and deployment

The `Dockerfile` builds the Vite app and serves the generated `dist/` directory with nginx on port `8080`.

```bash
docker build \
  --build-arg VITE_BACKEND_URL=https://api.example.com \
  --build-arg VITE_MARKET_DATA_URL=https://data.example.com \
  --build-arg VITE_TRADING_ENGINE_URL=https://engine.example.com \
  --build-arg VITE_GOOGLE_CLIENT_ID=your-client-id \
  --build-arg VITE_RECAPTCHA_SITE_KEY=your-site-key \
  -t orion-frontend .

docker run -p 8080:8080 orion-frontend
```

The GitHub Actions workflow in `.github/workflows/deploy-frontend.yml` builds the image, pushes it to Artifact Registry, and deploys to Cloud Run using Workload Identity Federation.

## Email template workflow

Source templates live in `packages/transactional/emails/`. After editing:

```bash
npm run export -w transactional
```

Then copy the generated HTML from `packages/transactional/out/` into both backend email directories:

```text
database-system/api/emails/
database-system/api-go/handlers/emails/
```

The Go backend embeds its copy at compile time, while the Python backend reads its copy at runtime.

## Notes for contributors

- Keep feature code inside the relevant `src/features/*` directory and expose shared APIs through each feature's index file.
- Prefer the shared auth/account hooks over duplicating token or account lookup logic.
- Do not commit `.env` files or API secrets.
- The production build output `apps/web_client/dist/` is generated by CI/Docker. If it is already tracked in Git, remove it with `git rm -r --cached apps/web_client/dist` and commit the removal.
