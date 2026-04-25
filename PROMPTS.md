# Prompt Log — PostKit

---

## Step 1 — R8: Persistence

**Q:** What did the storage library actually do vs. what the store middleware did? Were they the same thing or different layers?

**A:** Different layers. The `persist` middleware handles syncing Zustand state to localStorage automatically on every change. `postkit-storage-lib` is for explicit JSON export/import — like a manual backup. I used both: middleware for automatic persistence, the lib for the export/import feature.

---

## Step 2 — R1: Browse Posts

**Q:** Did any library return unexpected output for a post with very short body text or empty tags? What did you do about it?

**A:** Short body returned a decimal like `0.012` for reading time, the library doesn't floor to 1, it just does raw word-count math. It displays as-is, which looks odd for short posts. Empty tags array just renders nothing, no crash. Didn't need to change anything for tags, but the reading time display could use rounding. If this was mine I would have done something like "Less than 1 minute" or similar for less than that to make it look cleaner.

---

## Step 3 — R5: Create and Edit Posts

**Q:** How did the tag library handle unusual input — extra spaces, uppercase, empty strings between commas? Did you need to adjust your validation to account for this?

**A:** Handled it cleanly. Extra spaces got trimmed, uppercase got lowercased, empty strings between commas got dropped. No adjustments needed — `parseTags` output was always a clean array.

---

## Step 4 — R2 + R3: Filter and Sort

**Q:** Did you encounter any case where filtering produced unexpected results? Was the issue in your code, the library, or the data?

**A:** No unexpected results. Combining status and tag filters worked correctly. The only thing to get right was skipping `filterByStatus` when status is `'all'` — that was in my code, not the library.

---

## Step 5 — R4: Search

**Q:** Does search interact with the filter correctly? What happens when you search for something and also have a status filter active?

**A:** Yes — only posts that match both the search query and the active status filter appear. Search runs first so filters operate on a smaller set. Clearing the search restores the full filtered list.

---

## Step 6 — R6 + R7: Slug and Post Preview

**Q:** Which library required the most guarding for edge case input? What did it return for empty strings?

**A:** `postkit-date-status-display` needed the most guarding — `formatDate` expects a valid date string, so new posts with no `updatedAt` needed a fallback (`?? 'Not saved yet'`). `postkit-excerpt` returned an empty string for empty body — safe. `postkit-reading-time` returned a small decimal (e.g. `0.012`) for very short text — no minimum floor.


## Extra Notes

### State Management Refactor — Moving UI State into Zustand

Mitchell pointed out that while posts were correctly stored in Zustand, the UI state (`search`, `filters`, `view`, `selected`) was still living as `useState` in `App.tsx` and being passed down as props to child components. He called this the "vanilla method" — the same pattern the app used before Zustand was added, where state was managed with `useState` + `useEffect` inside a custom hook. The problem with that approach is that each component calling the hook gets its own independent copy of the state rather than a shared one. He also noted the contrast: "state down component tree" (prop drilling) vs. "global state store is better."

The fix was to move `view`, `selected`, `search`, and `filters` into the Zustand store alongside `posts`. `SearchBar` and `FilterSort` now call `usePostStore()` directly instead of receiving props. The `partialize` option was added to the persist middleware so only `posts` saves to localStorage — UI state correctly resets on reload. The `Filters`, `SortKey`, and `View` types were also moved to `types/post.ts` as a single source of truth.