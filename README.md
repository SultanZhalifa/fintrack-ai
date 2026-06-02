# FinTrack.ai

A warm, eye-friendly personal finance tracker built with React and Vite. Track income and expenses, set monthly budgets, visualize spending, and get AI-powered insights — all in the browser, with no backend and no account required.

**Stack:** React 19 - Vite 8 - Chart.js - Framer Motion - Gemini AI
**Storage:** localStorage (your data never leaves your device)

---

## Highlights

- **Warm, accessible design** — an ivory / terracotta / sage palette chosen for readability and low eye strain, with consistent design tokens, soft shadows, and reduced-motion support.
- **Fully responsive** — fixed sidebar on desktop, off-canvas drawer navigation on mobile, and fluid grids that reflow from 4 columns down to 1.
- **Enterprise-grade structure** — a clean, layered architecture (UI primitives, feature modules, hooks, context, and pure library functions) that is easy to read, test, and extend.

## Features

### Tracking
- Add, **edit**, and delete income or expense transactions
- Category tagging with a friendly icon per category
- Inline form validation and confirmation before destructive actions
- Toast notifications for every action

### Insight
- **Dashboard** — total balance with month-over-month change, income, expenses, and savings rate
- **Monthly overview** — six-month income vs. expense bar chart
- **Expense breakdown** — category doughnut chart
- **Net cash-flow trend** — month-by-month line chart
- **Analytics highlights** — top spending category and largest transaction

### Budgets
- Set a monthly limit per category
- Visual progress bars with warning and over-budget states
- Overall monthly budget summary

### Data and AI
- **Search and filter** transactions by text, type, category, date range, and sort order
- **Export to CSV** for spreadsheets and **import / export a JSON backup** to move data between devices
- **AI insights** — Gemini analyzes your spending and returns five tailored tips (with a built-in offline demo when no API key is set)

## Getting Started

```bash
git clone https://github.com/SultanZhalifa/fintrack-ai
cd fintrack-ai
npm install
npm run dev
```

Then open http://localhost:5174

```bash
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # lint the project
```

## Enable AI Insights (optional)

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com), then create a `.env.local` file in the project root:

```bash
VITE_GEMINI_KEY=your_gemini_api_key_here
```

Without a key, AI Insights runs in offline demo mode with sample advice.

## Architecture

The codebase is organized by concern. UI primitives are dumb and reusable; features compose them; all calculation lives in pure, side-effect-free library functions; and state is centralized in React context backed by localStorage.

```
src/
  main.jsx                  Entry point
  App.jsx                   Root: global providers + layout
  app/
    AppLayout.jsx           Responsive shell (sidebar + drawer + page switch)
    routes.jsx              Page registry (drives nav, header, content)
  components/
    ui/                     Design-system primitives
      Button, IconButton, Card, Modal, ConfirmDialog,
      Field (Input/Select), Badge, ProgressBar, EmptyState
    layout/                 Brand, Sidebar, MobileNav, NavList, PageHeader
  context/
    FinanceContext.jsx      Transactions + budgets state, CRUD, derived data
    ToastContext.jsx        Toast notifications
  features/
    dashboard/              Dashboard page, stat cards, budget widget
    transactions/           List, row, filters, add/edit modal
    analytics/              Monthly, category, and trend charts
    budgets/                Budgets page, budget cards, budget modal
    insights/               AI insights page
  hooks/
    useLocalStorage.js      State synced to localStorage
    useMediaQuery.js        Reactive breakpoints (useSyncExternalStore)
  lib/
    storage.js              Safe localStorage wrapper
    finance.js              Pure financial calculations
    format.js               Currency, date, and percentage formatters
    csv.js                  CSV export + JSON backup import/export
    gemini.js               Gemini client with offline fallback
  constants/
    config.js               Storage keys, app config, chart colors
    categories.js           Categories and icons
    seed.js                 Demo data for first run
  styles/
    theme.css               Warm-light design tokens
    base.css                Reset, typography, focus, scrollbars
    components.css          Shared component classes + responsive rules
```

### Design principles

- **Separation of concerns** — calculation (`lib/`), state (`context/`), presentation (`components/`, `features/`) never bleed into each other.
- **Single source of truth** — `FinanceContext` owns all data; components read derived selectors rather than recomputing.
- **Pure and testable** — every function in `lib/finance.js` takes inputs and returns outputs with no side effects.
- **Accessible by default** — keyboard focus styles, `aria` labels, Escape-to-close dialogs, and respect for `prefers-reduced-motion`.

## License

Built by Sultan Zhalifunnas Musyaffa - [sultanzhalifunnasmusyaffa@gmail.com](mailto:sultanzhalifunnasmusyaffa@gmail.com)
