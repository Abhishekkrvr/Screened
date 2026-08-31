# SCREENED.

A clean, minimal screen-time calculator that turns an average daily screen-time habit into a lifetime perspective.

## Features

- Daily screen-time input
- Quick presets from 1 to 8 hours
- 70, 75, 80, 85 and 90-year lifespan options
- 80 years selected by default
- Lifetime screen-time projection
- Hours spent on screens per year
- Screen days accumulated over 10 years
- Total projected screen days across the selected lifespan
- Simple perspective section
- Share result using the native share sheet where supported
- Responsive layout for mobile, tablet and desktop
- No account and no database

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- JavaScript

## Folder Structure

```text
screened/
├── app/
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── public/
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md
```

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Calculation

The projection uses:

```text
daily screen minutes × 365.2425 × selected lifespan
```

The result is a simple mathematical projection based on the user's current daily screen-time input. It is not a prediction of life expectancy or future behavior.

## License

Free to use and modify for personal or commercial projects.
