# PostKit

A post management app built with React + TypeScript, integrating libraries published by classmates.

## Run

```bash
npm install
npm run dev
```

## Features

- Create, edit, and delete posts
- Search posts by title, body, or tags
- Filter by status or tag, sort by date or title
- Auto-generated slugs, excerpts, and reading time
- Post data persists between reloads via localStorage

## Libraries Used

| Package | Purpose |
|---|---|
| `postkit-slug` | Slug generation and uniqueness |
| `postkit-excerpt` | Excerpt generation |
| `postkit-reading-time` | Reading time calculation |
| `postkit-tag` | Tag parsing and deduplication |
| `postkit-validation-library` | Post validation |
| `postkit-search-library` | Search across title, body, tags |
| `postkit-filter-sort` | Filter by status/tag, sort by date/title |
| `postkit-ui-component-library` | UI components (SearchInput, PostCard, StatusBadge) |
| `postkit-date-status-display` | Date formatting and status labels |

## Notes
State down component tree

Global star store is better


Restyle the existing app with the following design spec. 
Do not change any logic, functionality, or component structure.

## Fonts (add to index.html via Google Fonts)
- Lora (serif) — for the editor/textarea body text
- Inter (sans-serif) — for all UI chrome (header, footer, counts)

## Colors (add as custom tokens in tailwind.config.js)
- Background: #F9F8F6
- Text: #2C2C2C
- Muted UI: #A89F91

## Layout
- Single centered column, max-w-2xl, mx-auto
- Generous vertical padding (py-12 or more)
- No shadows, no borders, no card wrappers — content sits directly on background

## Editor Area
- Font: Lora, text-lg or text-xl, leading-relaxed, tracking-wide
- Textarea: transparent background, no border, no outline, full width
- Visible focus state — do not use outline-none without a replacement

## Header
- App name: Inter, small, muted color (#A89F91)
- Word count + reading time: Inter, small, muted — right-aligned
- No extra elements

## Footer / Status Bar
- Word count, character count, reading time: Inter, text-sm, muted
- Subtle top border or spacing to separate from editor — no heavy dividers

## Accessibility
- Contrast ratio ≥ 4.5:1 for all text (WCAG AA)
- All interactive elements keep visible focus styles
- No outline removal without a styled replacement

## Constraints
- Tailwind only — no inline styles, no new CSS files unless absolutely necessary
- Do not touch any JS logic or component structure
- Do not add dark mode, animations, or new UI elements