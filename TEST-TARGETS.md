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
 
### T1 — Filter by status shows only matching posts
Behavior: Changing the status filter to 'draft' shows only draft posts in the list
Setup: Store contains two posts — one with status 'draft', one with status 'published'
Action: Render App, change the status select to 'draft'
Assert:
  - Draft post title appears in the document
  - Published post title does NOT appear in the document
Failure: Would catch — wrong variable passed to filterByStatus, filter not connected to store, stale useMemo
 
### T2 — Search returns only matching posts
Behavior: Typing a search query filters the list to only posts matching that query
Setup: Store contains two posts — one titled 'Hello World', one titled 'Goodbye World'
Action: Render App, type 'Hello' into the search input
Assert:
  - 'Hello World' appears in the document
  - 'Goodbye World' does NOT appear in the document
Failure: Would catch — search value not passed to searchPosts, searchPosts not called on store update
 
### T3 — Creating a post saves it to the list
Behavior: Filling out the editor and saving adds the new post to the post list
Setup: Store starts empty
Action: Render App, click New Post, fill in title and body, click Save
Assert:
  - The new post title appears in the post list
  - View returns to list after save
Failure: Would catch — validation blocking save incorrectly, createPost not updating store, view not resetting
 
### T4 — Slug is unique when two posts have the same title
Behavior: Creating two posts with the same title produces two different slugs
Setup: Store contains one post with title 'My Post' and slug 'my-post'
Action: Create a second post with title 'My Post'
Assert:
  - Second post slug is NOT 'my-post'
  - Second post slug starts with 'my-post' (e.g. 'my-post-1' or similar)
Failure: Would catch — makeUniqueSlug not called, existing slugs not passed correctly
 
### T5 — Validation prevents saving an invalid post
Behavior: Submitting the editor with no title shows an error and does not save
Setup: Store starts empty
Action: Render PostEditor, leave title blank, click Save
Assert:
  - An error message appears in the document
  - No new post is added to the store
Failure: Would catch — getPostValidationErrors not called, isPostValid not blocking createPost
 
### T6 — Filter by tag shows only matching posts
Behavior: Selecting a tag filter shows only posts that have that tag
Setup: Store contains two posts — one tagged 'javascript', one tagged 'css'
Action: Render App, select 'javascript' from the tag filter
Assert:
  - Post tagged 'javascript' appears in the document
  - Post tagged 'css' does NOT appear in the document
Failure: Would catch — wrong field passed to filterByTag, tag filter not wired to store