import { useState, useMemo } from 'react'
import { Post, PostFormData } from './types/post'
import { usePostStore } from './store/usePosts'
import { SearchBar } from './components/SearchBar'
import { FilterSort, Filters } from './components/FilterSort'
import { PostList } from './components/PostList'
import { PostEditor } from './components/PostEditor'
import { PostPreview } from './components/PostPreview'
import { searchPosts } from 'postkit-search-library'
import { filterByStatus, filterByTag, sortByDate, sortByTitle } from 'postkit-filter-sort'

type View = 'list' | 'preview' | 'editor'

export function App() {
  const { posts, createPost, updatePost, deletePost } = usePostStore()
  const [view, setView] = useState<View>('list')
  const [selected, setSelected] = useState<Post | null>(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>({ status: 'all', tag: '', sort: 'date', sortDir: 'desc' })

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap(p => p.tags))).sort(),
    [posts]
  )

  const visible = useMemo(() => {
    type LibPost = Parameters<typeof filterByStatus>[0][number]

    let result = posts as unknown as LibPost[]

    if (search.trim()) {
      result = searchPosts(result as Parameters<typeof searchPosts>[0], search) as unknown as LibPost[]
    }

    if (filters.status !== 'all') {
      result = filterByStatus(result, filters.status as Parameters<typeof filterByStatus>[1])
    }

    if (filters.tag) {
      result = filterByTag(result, filters.tag)
    }

    result = filters.sort === 'title'
      ? sortByTitle(result, filters.sortDir)
      : sortByDate(result, filters.sortDir)

    return result as unknown as Post[]
  }, [posts, search, filters])

  function handleSave(data: PostFormData) {
    if (selected) {
      updatePost(selected.id, data)
    } else {
      createPost(data)
    }
    setView('list')
    setSelected(null)
  }

  function handleSelect(post: Post) {
    setSelected(post)
    setView('preview')
  }

  function handleNew() {
    setSelected(null)
    setView('editor')
  }

  function handleBack() {
    setSelected(null)
    setView('list')
  }

  function handleDelete() {
    if (selected) {
      deletePost(selected.id)
      setSelected(null)
      setView('list')
    }
  }

  if (view === 'editor') {
    return (
      <main className="min-h-screen bg-paper">
        <div className="max-w-2xl mx-auto py-12 px-6">
          <h1 className="font-sans text-sm text-muted tracking-widest uppercase mb-10">
            {selected ? 'Edit Post' : 'New Post'}
          </h1>
          <PostEditor post={selected ?? undefined} onSave={handleSave} onCancel={handleBack} />
        </div>
      </main>
    )
  }

  if (view === 'preview' && selected) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="max-w-2xl mx-auto py-12 px-6">
          <PostPreview post={selected} onEdit={() => setView('editor')} onBack={handleBack} />
          <button
            onClick={handleDelete}
            className="mt-8 font-sans text-sm text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-muted rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto py-12 px-6">
        <header className="flex items-center justify-between mb-10">
          <h1 className="font-sans text-sm text-muted tracking-widest uppercase">PostKit</h1>
          <button
            onClick={handleNew}
            className="font-sans text-sm text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-muted rounded transition-colors"
          >
            + New Post
          </button>
        </header>
        <SearchBar value={search} onChange={setSearch} />
        <FilterSort filters={filters} availableTags={allTags} onChange={setFilters} />
        <PostList posts={visible} onSelect={handleSelect} />
      </div>
    </main>
  )
}
