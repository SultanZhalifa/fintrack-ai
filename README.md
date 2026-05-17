# FinTrack.ai

> AI-powered personal finance tracker — built with React, Chart.js, and Gemini AI.

**Live Demo:** [fintrack-ai.vercel.app](https://fintrack-ai.vercel.app) &nbsp;|&nbsp; **Stack:** React + Vite + Gemini AI

---

## Overview

FinTrack.ai is a personal finance web app that helps you track income and expenses, visualize spending patterns, and get AI-powered financial insights using Google's Gemini API — all running in the browser with no backend required.

## Features

- **Dashboard** — Balance, income, expense, and savings rate at a glance
- **Add Transactions** — Income/expense modal with category tagging
- **Monthly Bar Chart** — 6-month income vs expense comparison
- **Category Doughnut** — Visual expense breakdown by category
- **Transaction History** — Filterable list with delete support
- **AI Insights** — Gemini AI analyzes your spending and gives 5 personalized tips
- **Local Persistence** — Data stored in localStorage, no account needed
- **Responsive** — Works on desktop and mobile

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| Charts | Chart.js + react-chartjs-2 |
| Animations | Framer Motion |
| AI | Google Gemini API (gemini-2.0-flash) |
| Storage | localStorage |
| Icons | React Icons (Feather) |
| Fonts | Inter + Space Grotesk |
| Deploy | Vercel |

## Getting Started

```bash
git clone https://github.com/SultanZhalifa/fintrack-ai
cd fintrack-ai
npm install
npm run dev
```

Open `http://localhost:5174`

## Enable AI Insights (Optional)

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com), then:

```bash
# Create .env.local
VITE_GEMINI_KEY=your_gemini_api_key_here
```

Without the key, the app runs in offline demo mode with sample insights.

## Project Structure

```
fintrack-ai/
├── src/
│   ├── components/
│   │   ├── StatCards.jsx       # Summary stat cards
│   │   ├── Charts.jsx          # Bar & Doughnut charts
│   │   ├── AddTransaction.jsx  # Add transaction modal
│   │   ├── TransactionList.jsx # Transaction history + filter
│   │   └── AIInsights.jsx      # Gemini AI analysis panel
│   ├── store.js                # localStorage data layer
│   ├── App.jsx                 # Main shell + routing
│   └── index.css               # Design system
└── README.md
```

---

Built by Sultan Zhalifunnas Musyaffa — [sultanzhalifunnasmusyaffa@gmail.com](mailto:sultanzhalifunnasmusyaffa@gmail.com)
