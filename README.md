# 🗓️ Wall Calendar

An immersive, interactive wall calendar built with **Next.js 15**, designed to feel like a physical calendar hanging on your wall — complete with seasonal hero photography, smooth month transitions, date-range selection, holiday markers, and a monthly notes pad.

---

## ✨ Features

| Feature | Detail |
|---|---|
| **12 monthly themes** | Each month has a unique light color palette, accent, and hero image |
| **Seamless image fade** | The hero photo blends directly into the calendar/notes panel via a gradient mask |
| **Animated month nav** | 3D flip/slide transition between months using Framer Motion |
| **Date range selection** | Click a start date, hover to preview, click an end date — range fills with a flowing wave animation |
| **Click spark** | Canvas-based burst of sparks fires on every date click |
| **Holiday markers** | Indian & international holidays shown as accent dots with hover tooltips |
| **Monthly notes** | Per-month lined notepad persisted to `localStorage` (Ctrl+S to save) |
| **Fully responsive** | Side-by-side on desktop, stacked on mobile — entire calendar fits in one viewport |

---

## 🛠️ Tech Choices

- **Next.js 15 (App Router)** — file-based routing, React Server Components, optimised `<Image>` for the hero photos
- **Tailwind CSS** — utility-first layout; avoids extra CSS files for spacing/flex/grid
- **Framer Motion** — handles the 3D month-flip animation, range fill wave, and micro hover effects
- **date-fns** — lightweight date arithmetic (range intervals, week grids, formatting)
- **lucide-react** — consistent, tree-shakeable icon set
- **Canvas API (vanilla)** — click-spark effect drawn directly on a per-cell canvas for zero third-party overhead

---

## 📁 Structure

```
calender/
├── app/
│   ├── page.tsx          # Wall calendar layout (hero image + panels)
│   └── globals.css       # Google Fonts, base resets, textarea styles
├── components/
│   ├── Calendar.tsx      # Grid, range selection, holiday tooltips
│   ├── Notes.tsx         # Lined notepad with localStorage persistence
│   ├── ClickSpark.tsx    # Canvas spark-burst on date click
│   └── SeasonalParticles.tsx  # (available, disabled by default)
├── lib/
│   ├── themes.ts         # 12 monthly light-mode theme definitions
│   └── holidays.ts       # Indian & international holiday lookup
└── public/
    └── images/           # 12 monthly hero JPEGs (jan–dec)
```

---

## 🚀 Running Locally

**Prerequisites:** Node.js ≥ 18, pnpm (or npm/yarn)

```bash
# 1. Clone the repo
git clone https://github.com/Kratika246/Calender.git
cd Calender

# 2. Install dependencies
pnpm install        # or: npm install

# 3. Start the dev server
pnpm dev            # or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Images:** Place 12 hero images named `january.jpg` → `december.jpg` inside `public/images/`. The app expects these files; missing ones will show a broken image placeholder.

---

## 🎨 Theming

Each month is defined in `lib/themes.ts` as a `MonthTheme` object:

```ts
{
  label: 'April',
  name: 'Showers',          // subtitle shown under the month name
  bgGradient: '...',        // page body background
  cardBg: '...',            // notes + calendar panel fill
  accent: '#7b1fa2',        // buttons, selected dates, holiday dots
  image: '/images/april.jpg',
  imageBlur: '#f3e5f5',     // color the hero fades into at the bottom
  // ...spark colors, range fill, today-ring, etc.
}
```

To customise a month, edit its entry in that file — no other changes needed.

---

## 🏗️ Building for Production

```bash
pnpm build          # type-checks + compiles
pnpm start          # serves the production bundle
```
