# Nguyen Dinh Nguyen

> _Personal Website & Portfolio_

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react&logoColor=0B1F2A) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![Yarn](https://img.shields.io/badge/Yarn-4.9.2-2C8EBB?style=flat-square&logo=yarn&logoColor=white) ![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=flat-square&logo=cloudflarepages&logoColor=white)

This is a modern, sustainable, and highly optimized personal portfolio and web tools hub built using **Next.js 16 (App Router)** and **React 19**. It features dual-language support, custom design tokens, and integrates with a standalone Python FastAPI + D1 backend for stateful features.

---

## Key Features

- **Multi-language Support (i18n)**: Fully localized in English (`en`) and Vietnamese (`vi`) using `next-intl`.
- **Advanced Portfolio & Experience**: Timeline structure, categorised tech skills, and certification details with dynamic theme adjustment.
- **Bookmarks Manager**: Interactive dashboard to search, filter, and manage links inside nested categories. Protected with admin token authentication.
- **Shopee Cashback Portal**: Shopee affiliate converter with conversion reports, local search history, interactive coin dropping effects, Google Identity Services (GSI) authentication, and manual/automated conversion synchronization for admins.
- **Modern UI & Design System**: Custom theme providers (`next-themes`), Tailwind CSS v4, and standard UI primitives based on `shadcn/ui`.

---

## Repository Structure

```text
.
├── src/
│   ├── app/                  # Next.js App Router (locale routing inside [locale])
│   ├── components/           # UI, features, and layout components
│   ├── features/             # Feature-specific components, hooks, and helpers
│   ├── i18n/                 # next-intl configuration and routing utilities
│   ├── lib/                  # Shared utilities and runtime config
│   └── messages/             # Localization JSON files (en.json, vi.json)
├── docs/                     # Documentation (dev.md, rule.md, deploy.md)
├── public/                   # Static assets and redirection files
├── package.json              # Scripts and project dependencies
└── README.md                 # Main workspace documentation
```

---

## Routes Matrix

| Route                   | Type                     | Description                                                                                  |
| ----------------------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| `/`                     | Redirect                 | Redirects to `/en/` via `public/_redirects` (or client fallback in `src/app/page.tsx`).       |
| `/bookmarks/`           | Client redirect          | Legacy entry point forwarding visitors to `/en/bookmarks`.                                   |
| `/experience/`          | Client redirect          | Legacy entry point forwarding visitors to `/en/experience`.                                   |
| `/[locale]/`            | Static page              | Landing page with localized greetings, language selection, and theme options.                |
| `/[locale]/bookmarks/`  | Static page + client API | Bookmarks manager interface loading data from the FastAPI backend.                           |
| `/[locale]/cashback/`   | Static page + client API | Shopee affiliate cashback portal with login, order list, and sync tools.                    |
| `/[locale]/experience/` | Static page              | Interactive resume showing professional timeline, education, and credentials.                |

---

## Environment Variables

Copy `.env.example` to `.env.local` and define the required values:

```bash
# Public URL of the FastAPI backend worker
NEXT_PUBLIC_API_URL=https://api.yourdomain.workers.dev

# Google OAuth Client ID for Cashback Portal authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com

# Optional Analytics IDs
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx

# Build-time Timezone
APP_TIME_ZONE=Asia/Ho_Chi_Minh
```

---

## Development & Operations

### Installation

```bash
yarn install
```

### Dev Mode

Start the Next.js development server:

```bash
yarn dev          # Runs with Webpack
yarn dev:turbo    # Runs with Turbopack (recommended for faster reloads)
```

### Build & Linting

Compile code, check for TypeScript/Linter issues, and prepare static output:

```bash
yarn lint         # Verify code style and formatting
yarn format       # Apply Prettier formatting across files
yarn depcheck     # Verify unused or missing package dependencies
yarn build        # Generate static production build under "out/" folder
```

---

## Code Quality & Git Workflow

This repository enforces high-quality standards using pre-commit hooks (Husky, lint-staged) and Conventional Commits.

### Commit Messages Format

```text
<type>(<scope>): <description>
```

Common types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semi-colons, etc.
- `refactor`: Refactoring production code (no new features/bug fixes)
- `perf`: Performance improvements
- `build`: Changes to build configurations or dependencies
- `chore`: General maintenance tasks

---

## Deployment & Verification

Deployments are set up as a **static export** compiled into the `out` directory and hosted on **Cloudflare Pages**. 

Verification check status of standard output:
- `GET /[locale]/` -> `200 OK`, Title: `Nguyen Dinh Nguyen`
- `GET /[locale]/bookmarks/` -> `200 OK`, Title: `Bookmarks — Nguyen Dinh Nguyen`
- `GET /[locale]/experience/` -> `200 OK`, Title: `Experience — Nguyen Dinh Nguyen`
- `GET /[locale]/cashback/` -> `200 OK`, Title: `Cashback — Nguyen Dinh Nguyen`
- `GET /` -> Redirects correctly to `/en/` using `_redirects` directives.

Refer to [docs/deploy.md](docs/deploy.md) for step-by-step setup details.
