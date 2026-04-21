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
