import { Filters, SortKey } from '../types/post'
import { usePostStore } from '../store/usePosts'

export type { SortKey, Filters }

interface Props {
  availableTags: string[]
}

const selectClass = 'bg-transparent font-sans text-sm text-ink border-b border-muted/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-muted rounded py-1 pr-2 cursor-pointer'

export function FilterSort({ availableTags }: Props) {
  const { filters, setFilters } = usePostStore()
  function set<K extends keyof Filters>(key: K, val: Filters[K]) {
    setFilters({ ...filters, [key]: val })
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <select
        value={filters.status}
        onChange={e => set('status', e.target.value as Filters['status'])}
        className={selectClass}
      >
        <option value="all">All statuses</option>
        <option value="draft">Draft</option>
        <option value="review">In Review</option>
        <option value="published">Published</option>
      </select>

      <select
        value={filters.tag}
        onChange={e => set('tag', e.target.value)}
        className={selectClass}
      >
        <option value="">All tags</option>
        {availableTags.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={e => set('sort', e.target.value as SortKey)}
        className={selectClass}
      >
        <option value="date">Sort by date</option>
        <option value="title">Sort by title</option>
      </select>

      <select
        value={filters.sortDir}
        onChange={e => set('sortDir', e.target.value as 'asc' | 'desc')}
        className={selectClass}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  )
}
