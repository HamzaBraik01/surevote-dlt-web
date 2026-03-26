<p align="center">
  <img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI/CD" />
</p>

# 🗳️ SureVote Frontend

> **A secure, modern, and production-ready electronic voting platform built with Angular 21.**

SureVote is a decentralized ledger-backed voting system designed to ensure transparency, integrity, and accessibility in digital elections. This repository contains the **frontend application** — a responsive single-page application that provides role-based interfaces for administrators, voters, and observers.

---

## 📌 Project Overview

SureVote Frontend serves as the user-facing layer of the SureVote platform. It communicates with a Spring Boot backend via RESTful APIs and provides a complete election lifecycle management experience:

- **Administrators** create and manage elections, candidates, and electoral colleges
- **Voters** enroll in elections, cast secure ballots, and receive cryptographic receipts
- **Observers** monitor election integrity through audit journals and participation metrics
- **Public users** browse elections, view live results, and verify vote receipts

The application features a premium dark/light theme system, responsive layouts, real-time form validation, JWT-based authentication with 2FA support, and role-based access control.

---

## 🚀 Features

### 🔑 Authentication & Security
- JWT-based login with automatic token refresh
- Two-factor authentication (TOTP verification)
- Password reset flow with email verification
- Role-based route guards (`AuthGuard`, `RoleGuard`)
- HTTP interceptor for token injection and 401 handling

### 👨‍💼 Admin Panel
- **Dashboard** — Real-time statistics cards with activity feed
- **Elections** — Full CRUD with status lifecycle (Draft → Open → Closed)
- **Candidates** — Registration with photo and program file uploads
- **Electoral Colleges** — Voter group management and assignment
- **Users** — User list with search, role filtering, and pagination

### 🗳️ Voter Portal
- **Dashboard** — View enrolled elections and voting status
- **Voting Booth** — Secure ballot interface with vote submission
- **Receipts** — Cryptographic vote receipt viewing and verification
- **Profile** — Personal information and account management

### 👁️ Observer Module
- **Audit Journal** — Searchable, filterable audit trail monitoring
- **Metrics** — Election participation statistics and analytics

### 🌐 Public Pages
- **Landing Page** — Hero section with features showcase and CTA
- **Elections List** — Browse elections with search and status filtering
- **Election Results** — Live vote tallies with progress visualizations
- **404 Page** — Custom not-found page with navigation

### 🎨 UI/UX
- Dark and light theme with system preference detection
- Smooth animations and micro-interactions
- Toast notification system with stacking and auto-dismiss
- Confirmation modals for destructive actions
- Responsive design for mobile, tablet, and desktop

---

## 🧱 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Angular | 21.x |
| **Language** | TypeScript | 5.9 |
| **Styling** | TailwindCSS + Custom CSS | 4.x |
| **State Management** | RxJS | 7.8 |
| **HTTP Client** | Angular HttpClient | 21.x |
| **Routing** | Angular Router (lazy-loaded) | 21.x |
| **Unit Testing** | Vitest + jsdom | 4.x |
| **E2E Testing** | Playwright | 1.58 |
| **Linting** | ESLint + Angular ESLint | 10.x |
| **Build** | Angular CLI + esbuild | 21.x |
| **Containerization** | Docker (Nginx 1.27) | Multi-stage |
| **CI/CD** | GitHub Actions | 4 jobs |

---

## 📂 Project Structure

```
surevote-frontend/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions CI/CD pipeline
├── e2e/                            # Playwright end-to-end tests
├── src/
│   ├── app/
│   │   ├── core/                   # Singleton services & infrastructure
│   │   │   ├── guards/             # AuthGuard, RoleGuard
│   │   │   ├── interceptors/       # JWT AuthInterceptor
│   │   │   ├── models/             # Domain interfaces (User, Election, Vote...)
│   │   │   └── services/           # API services (Auth, Election, Vote...)
│   │   ├── features/               # Lazy-loaded feature modules
│   │   │   ├── admin/              # Admin dashboard, elections, candidates, colleges, users
│   │   │   ├── auth/               # Login, register, forgot-password, 2FA, reset
│   │   │   ├── observer/           # Audit journal, metrics
│   │   │   ├── public/             # Landing, elections list, results, 404
│   │   │   └── voter/              # Dashboard, voting booth, receipts, profile
│   │   ├── shared/                 # Reusable UI components
│   │   │   └── components/         # Sidebar, Spinner, Modal, Toast, StatusBadge
│   │   ├── app.config.ts           # Application providers & DI configuration
│   │   ├── app.routes.ts           # Root route definitions
│   │   └── app.ts                  # Root component
│   ├── environments/               # Dev & production environment configs
│   ├── styles.css                  # Global CSS design system
│   ├── index.html                  # HTML entry point
│   └── main.ts                     # Application bootstrap
├── Dockerfile                      # Multi-stage build (Node + Nginx)
├── docker-compose.yml              # Full-stack deployment config
├── nginx.conf                      # Production Nginx with security headers
├── eslint.config.js                # ESLint flat config
├── angular.json                    # Angular workspace configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies & scripts
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** ≥ 22.x
- **npm** ≥ 10.x
- **Angular CLI** (installed globally or via npx)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/HamzaBraik01/surevote-dlt-web.git
cd surevote-dlt-web

# 2. Install dependencies
npm ci

# 3. Configure the API endpoint
#    Edit src/environments/environment.ts
#    Set apiUrl to your backend server address
```

### Environment Configuration

| File | Purpose |
|------|---------|
| `src/environments/environment.ts` | Development — points to `http://localhost:8080` |
| `src/environments/environment.prod.ts` | Production — points to your live API domain |

---

## ▶️ Running the App

### Development Server

```bash
npm start
# or
npx ng serve
```

Navigate to `http://localhost:4200`. The app reloads automatically on file changes.

### Production Build

```bash
npx ng build --configuration=production
```

Build artifacts are output to `dist/surevote-frontend/browser/`.

---

## 🔐 Authentication & Roles

SureVote implements a comprehensive role-based access control (RBAC) system:

| Role | Access Level | Key Capabilities |
|------|-------------|-------------------|
| **ADMIN** | Full system access | Manage elections, candidates, colleges, users |
| **ELECTEUR** (Voter) | Authenticated voter | Browse elections, cast votes, view receipts |
| **OBSERVATEUR** (Observer) | Read-only monitoring | Audit journals, participation metrics |
| **Public** | Unauthenticated | Landing page, public elections, results |

### Authentication Flow

```
Login → JWT Token Issued → Token stored in localStorage
    ↓
  (if 2FA enabled) → Redirect to /auth/verify-2fa → TOTP verification
    ↓
  Role detected → Redirect to role-specific dashboard
    ↓
  HTTP Interceptor attaches Bearer token to all API requests
    ↓
  On 401 → Automatic token refresh → Retry request
    ↓
  On refresh failure → Redirect to login
```

---

## 🌐 API Configuration

The frontend connects to a **Spring Boot REST API** backend. All HTTP communication is handled through Angular's `HttpClient` with a centralized interceptor.

### Base URL Configuration

```typescript
// src/environments/environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};

// src/environments/environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'https://api.surevote.com'
};
```

### Core API Services

| Service | Endpoint Prefix | Purpose |
|---------|----------------|---------|
| `AuthService` | `/api/auth/*` | Login, register, refresh, 2FA, password reset |
| `UserService` | `/api/users/*` | User CRUD, profile management |
| `ElectionService` | `/api/elections/*` | Election lifecycle management |
| `CandidatService` | `/api/candidats/*` | Candidate registration and management |
| `CollegeService` | `/api/colleges/*` | Electoral college management |
| `VoteService` | `/api/vote/*` | Vote submission, receipts, integrity checks |
| `AuditService` | `/api/audit/*` | Audit trail retrieval |
| `FileService` | `/api/admin/files/*` | File upload/download operations |

---

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
npx ng test

# Run in watch mode (development)
npx ng test --watch
```

Unit tests use **Vitest** with **jsdom** environment and Angular `TestBed`. Coverage includes:

- ✅ All core services (Auth, User, Election, Vote, Audit, College, Candidat, File, Toast)
- ✅ Route guards (AuthGuard, RoleGuard)
- ✅ HTTP Interceptor (token injection, 401 refresh handling)
- ✅ Key components (Login, Elections, VotingBooth)

### End-to-End Tests

```bash
# Run Playwright E2E tests
npx playwright test
```

### Linting

```bash
# Run ESLint
npx ng lint
```

---

## 🐳 Docker Support

### Multi-Stage Dockerfile

The application uses a hardened multi-stage Docker build:

1. **Stage 1 — Build**: Node 22 Alpine builds the Angular production bundle
2. **Stage 2 — Serve**: Nginx 1.27 Alpine serves static files with security headers

```bash
# Build the Docker image
docker build -t surevote-frontend .

# Run the container
docker run -d -p 80:80 --name surevote-frontend surevote-frontend
```

### Docker Compose (Full Stack)

```bash
# Start frontend + backend + database
docker-compose up -d

# Stop all services
docker-compose down
```

### Security Features

- 🔒 Runs as **non-root** user inside the container
- 🩺 Built-in **health check** for orchestration readiness
- 🛡️ Nginx configured with **HSTS**, **CSP**, **X-Frame-Options**, **Permissions-Policy**
- ⚡ **Rate limiting** (10 req/s per IP) for DDoS protection
- 📦 **Gzip compression** for optimized asset delivery
- 🔄 Reverse proxy to backend on `/api/` path

---

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** with a 4-job pipeline triggered on pushes to `main`/`develop` and pull requests to `main`.

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐
│  🔍 Lint │────▶│  🧪 Test │────▶│ 🏗️ Build │────▶│ 🐳 Docker│
└─────────┘     └─────────┘     └─────────┘     └──────────┘
  ESLint          Vitest          ng build        GHCR Push
  Angular ESLint  Coverage        Production      OCI Image
```

| Job | Description | Depends On |
|-----|-------------|------------|
| **Lint** | Runs ESLint with Angular-specific rules | — |
| **Test** | Executes Vitest unit tests, uploads coverage | — |
| **Build** | Production build with optimizations | Lint ✅, Test ✅ |
| **Docker** | Builds and pushes image to GitHub Container Registry | Build ✅ |

### Key Features

- ⚡ **npm caching** for fast CI installations
- 🔄 **Concurrency groups** to cancel stale pipeline runs
- 📊 **Coverage artifacts** retained for 14 days
- 🏷️ **Auto-tagging** with commit SHA and `latest`

---

## 📸 Screenshots

> _Screenshots will be added after the first production deployment._

| Page | Description |
|------|-------------|
| Landing Page | Hero section with platform features |
| Login | Secure authentication form with 2FA |
| Admin Dashboard | Statistics overview and activity feed |
| Election Management | CRUD interface with status filters |
| Voting Booth | Candidate selection and vote submission |
| Vote Receipt | Cryptographic receipt verification |
| Observer Audit | Searchable audit trail journal |

---

## 📖 Usage Guide

### For Administrators

1. **Login** at `/auth/login` with admin credentials
2. **Create an election** from Admin Dashboard → Elections → New Election
3. **Add candidates** to the election with photos and programs
4. **Create electoral colleges** and assign eligible voters
5. **Publish the election** to make it visible and open for voting
6. **Monitor results** in real-time from the election detail page

### For Voters

1. **Register** at `/auth/register` and verify your email
2. **Login** and complete 2FA verification if enabled
3. **Browse elections** you are eligible for on the Voter Dashboard
4. **Enter the voting booth**, select your candidate, and submit your vote
5. **Save your receipt** — a cryptographic proof of your vote for later verification

### For Observers

1. **Login** with observer credentials
2. **View the audit journal** to monitor all system actions
3. **Check metrics** for election participation statistics and trends

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

---

## 📄 License

This project is developed as part of an academic capstone project (Projet de Fin d'Études).

---

<p align="center">
  Built with ❤️ using <strong>Angular 21</strong> · Secured by <strong>JWT + 2FA</strong> · Deployed with <strong>Docker + GitHub Actions</strong>
</p>
