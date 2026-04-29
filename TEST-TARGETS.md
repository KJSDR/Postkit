## Boundary Map

### Library Boundaries

- App.tsx: searchPosts(posts, search) → filtered posts
- App.tsx: filterByStatus(posts, filters.status) → filtered posts
- App.tsx: filterByTag(result, filters.tag) → filtered posts
- App.tsx: sortByDate(result, filters.sortDir) → sorted posts
- App.tsx: sortByTitle(result, filters.sortDir) → sorted posts
- PostEditor.tsx: parseTags(tagsRaw) → string[] (called on input blur)
- PostEditor.tsx: getPostValidationErrors(candidate) → error message list (gates form submission)
- PostList.tsx: formatDate(post.updatedAt) → display string
- PostList.tsx: PostCard from postkit-ui-component-library — receives title, author, status, excerpt, createdAt
- usePosts.ts: createSlugFromTitle(title) + makeUniqueSlug(slug, existingSlugs) → unique slug string
- usePosts.ts: createExcerpt(body, 150) → excerpt string
- usePosts.ts: readingTime(body) → number
- usePosts.ts: isPostValid(candidate) → boolean (gates createPost and updatePost)
- usePosts.ts: exportPosts(posts) → JSON string
- usePosts.ts: importPosts(json) → Post[]

### State Boundaries

- posts: Post[] — written by createPost, updatePost, deletePost, importAllPosts in store; read by App.tsx useMemo for filtering, then passed to PostList
- search: string — written by SearchBar via setSearch; read by App.tsx useMemo to call searchPosts
- filters: Filters — written by FilterSort via setFilters; read by App.tsx useMemo to call filter/sort libraries
- view: View + selected: Post | null — written by App.tsx event handlers; control which screen (list, editor, preview) is rendered

### View Boundaries

- PostList receives posts: Post[] — assumes tags is always string[], updatedAt always exists
- PostCard receives status typed as 'draft' | 'published' only — a 'review' value would be a mismatch (removed from app)
- PostPreview receives post: Post — assumes all fields are present and non-empty
- PostEditor receives optional post?: Post — undefined means new post, populated means edit mode
- FilterSort receives availableTags: string[] — deduped and sorted upstream by App.tsx useMemo

---

## Test Targets