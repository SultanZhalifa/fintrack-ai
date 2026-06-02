# FinTrack.ai

A warm, eye-friendly, **local-first** personal finance app built with React and Vite. Track income and expenses across multiple accounts, set smart budgets, automate recurring items, forecast your month, and get both rule-based and AI-powered insights — all in the browser, with no account, no backend, and no tracking.

**Stack:** React 19 - Vite 8 - Chart.js - Framer Motion - Gemini AI (optional)
**Storage:** localStorage only. Your data never leaves your device.
**Languages:** Bahasa Indonesia and English
**Installable:** Progressive Web App (works offline, add to home screen)

---

## Why it stands out

Most finance apps win on data automation and cloud sync, which require a backend, an account, and your data on someone else's server. FinTrack takes the opposite bet: stay **100% local-first and private**, and win on user experience, budgeting intelligence, and honesty. No fabricated numbers, no fake sample data, no dark patterns.

### How it compares

| Capability | FinTrack | Typical local trackers | Cloud apps (YNAB, Wallet, Money Lover) |
|---|---|---|---|
| Works fully offline / installable PWA | Yes | Sometimes | Rarely |
| No account, no backend, fully private | Yes | Often | No |
| Multiple accounts + transfers + net worth | Yes | Rarely | Yes |
| Custom categories (icon + color) | Yes | Sometimes | Yes |
| Recurring transactions (auto-posted) | Yes | Rarely | Yes |
| Month-end balance forecast | Yes | No | Some |
| YNAB-style safe-to-spend per day | Yes | No | YNAB only |
| Financial health score (explainable) | Yes | No | Rarely |
| Offline rule-based insights | Yes | No | Rarely |
| Command palette (Ctrl/Cmd-K) | Yes | No | No |
| Multi-currency with live rates | Yes | Rarely | Yes |
| Bilingual ID + EN | Yes | Rarely | Some |
| Bank sync / auto-import | No (by design) | No | Yes |

The one thing cloud apps do that FinTrack deliberately does not is connect to your bank — that needs a backend and financial licensing. Everything else, FinTrack matches or beats while keeping your data on your device.

## Features

### Money tracking
- Add, edit, and delete income or expense transactions with inline validation
- Multiple **accounts** (cash, bank, e-wallet, savings) with per-account balances
- **Transfers** between accounts (net-worth neutral)
- **Net worth** across all accounts, on its own page and the dashboard
- Search, filter (type, category, date range), and sort

### Budgeting intelligence
- Monthly budgets per category with progress and over-budget warnings
- **Safe-to-spend per day** (YNAB-style) with spending-pace tracking
- Zero-based overall budget summary

### Automation and planning
- **Recurring transactions** (daily/weekly/monthly/yearly) that auto-post when due
- **Month-end forecast**: actual so far + scheduled recurring + run-rate estimate

### Insight
- **Financial health score** (0-100) from four explainable pillars: savings rate, budget adherence, expense stability, and emergency buffer
- **Smart insights** computed offline from your real data (spending spikes, over-budget alerts, savings observations, category concentration)
- **AI insights** via Google Gemini (optional) — real analysis only; without a key the panel honestly says a key is required, with no fake sample text
- Charts: monthly income/expense, category breakdown, and net cash-flow trend

### Experience
- Warm-light, eye-friendly palette with consistent design tokens and reduced-motion support
- Fully responsive: fixed sidebar on desktop, off-canvas drawer on mobile
- **Command palette** (Ctrl/Cmd-K) for instant navigation and quick actions
- **Onboarding** first-run flow for language and currency
- Multi-currency display with **live exchange rates** (Frankfurter API) and offline fallback to last-known rates
- CSV export and full JSON backup import/export
- Installable PWA that runs offline

## Getting started

```bash
git clone https://github.com/SultanZhalifa/fintrack-ai
cd fintrack-ai
npm install
npm run dev
```

Then open http://localhost:5174

```bash
npm run build     # production build (also generates the PWA service worker)
npm run preview   # preview the production build
npm run lint      # lint the project
```

## Enable AI insights (optional)

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com), then create `.env.local`:

```bash
VITE_GEMINI_KEY=your_gemini_api_key_here
```

Without a key, AI insights are disabled and the app tells you so — it never shows fabricated advice. All other features (including the offline rule-based insights and health score) work without any key.

## Architecture

Organized by concern: dumb, reusable UI primitives; feature modules that compose them; pure, side-effect-free calculation libraries; and centralized state in React context backed by localStorage with a versioned migration.

```
src/
  main.jsx                  Entry point
  App.jsx                   Providers + onboarding gate
  app/
    AppLayout.jsx           Responsive shell + command palette + quick add
    routes.jsx              Page registry (drives nav, header, content)
  components/
    ui/                     Button, Card, Modal, ConfirmDialog, Field, Badge,
                            ProgressBar, EmptyState, CategoryIcon, IconButton
    layout/                 Brand, Sidebar, MobileNav, NavList, PageHeader
    CommandPalette.jsx      Ctrl/Cmd-K palette
  context/
    SettingsContext         Currency, language, live rates, onboarding
    FinanceContext          Transactions, accounts, categories, budgets,
                            recurrings + all derived selectors
    ToastContext            Notifications
  i18n/
    id.js  en.js            Flat dictionaries
    I18nProvider            t(key, vars)
  features/
    dashboard/  transactions/  analytics/  accounts/
    recurring/  budgets/  insights/  settings/  onboarding/
  hooks/
    useLocalStorage  useMediaQuery  useFormat
  lib/
    storage  finance  budgeting  forecast  recurring  accounts
    health  insights  currency  exchange  format  csv  gemini  migrate
  constants/
    config  categories  categoryIcons  accounts
  styles/
    theme.css  base.css  components.css
  pwa/                      manifest + service worker (via vite-plugin-pwa)
```

### Design principles

- **Local-first and private** — all data in localStorage; no account, no backend, no analytics.
- **100% real** — no demo/seed data, no fake AI text, no hardcoded numbers. Every figure is computed from your own entries; exchange rates are fetched live.
- **Separation of concerns** — calculation (`lib/`), state (`context/`), presentation (`components/`, `features/`) stay independent.
- **Pure and testable** — every function in `lib/` takes inputs and returns outputs with no side effects.
- **Accessible by default** — keyboard focus styles, ARIA labels, Escape-to-close dialogs, and `prefers-reduced-motion` support. No emoji; all glyphs are vector icons.

## License

Built by Sultan Zhalifunnas Musyaffa - [sultanzhalifunnasmusyaffa@gmail.com](mailto:sultanzhalifunnasmusyaffa@gmail.com)
