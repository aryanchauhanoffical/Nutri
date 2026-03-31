# 🥗 Nutri — Personal Health Dashboard

> An Apple-inspired, AI-powered nutrition & habit tracking web app built with React, TypeScript, and Framer Motion.

![Nutri Dashboard](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?logo=framer) ![Zustand](https://img.shields.io/badge/Zustand-5-orange)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Real-time calorie, protein & hydration stats with animated progress bars |
| **Meal Log** | Log meals with autocomplete food database, timeline view, edit/delete |
| **AI Recommendations** | 6 personalized meal cards with match scores, macros & rationale |
| **Habit Tracker** | 14-day streak calendar, progress rings, milestone badges |
| **Grocery List** | AI-curated checklist grouped by category, with strikethrough animation |
| **Dark Mode** | Full dark theme, persisted in localStorage |
| **Responsive** | Desktop sidebar, collapsible on tablet, bottom nav on mobile |

---

## 🖥️ Screenshot

The dashboard features a clean, minimal design with DM Sans + DM Serif Display typography, a warm cream background, and rich green accents.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/aryanchauhanoffical/Nutri.git
cd Nutri
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click **"🥗 Continue as Guest (Demo)"** to access the full app immediately.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion 12 |
| Charts | Recharts 3 |
| State | Zustand 5 (persisted) |
| Routing | React Router DOM 7 |
| Icons | Lucide React |
| Toasts | React Hot Toast |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, BottomNav, Layout
│   └── ui/              # AnimatedNumber, ProgressBar
├── data/
│   └── seed.ts          # Mock data: meals, groceries, habits, recommendations
├── features/
│   ├── auth/            # Auth Zustand store
│   └── preferences/     # User preferences store
├── pages/               # Dashboard, MealLog, Recommendations, Habits, Grocery
├── store/
│   └── useStore.ts      # Main app state (meals, groceries, habits, dark mode)
├── types/               # TypeScript interfaces
└── lib/
    └── animations.ts    # Shared Framer Motion variants
```

---

## 🎨 Design System

- **Fonts:** DM Sans (UI) + DM Serif Display (headings)
- **Primary:** `#3a7d44` (green)
- **Background:** `#faf8f4` (warm cream)
- **Accent:** `#e8704a` (coral) · `#6366f1` (indigo)
- **Card radius:** 16px · **Border:** 1px soft

---

## ♿ Accessibility

- Full `aria-label` coverage on all interactive elements
- Keyboard navigation on all controls
- Focus visible rings
- `role` attributes on progress bars and regions
- Screen-reader-friendly `noscript` fallback

---

## 📄 License

MIT © 2026 Nutri
