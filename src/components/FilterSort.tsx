import { PostStatus } from '../types/post'

export type SortKey = 'date' | 'title'

export interface Filters {
  status: PostStatus | 'all'
  tag: string
  sort: SortKey
  sortDir: 'asc' | 'desc'
}

interface Props {
  filters: Filters
  availableTags: string[]
  onChange: (filters: Filters) => void
}

export function FilterSort({ filters, availableTags, onChange }: Props) {
  function set<K extends keyof Filters>(key: K, val: Filters[K]) {
    onChange({ ...filters, [key]: val })
  }

  return (
    <div>
      <select value={filters.status} onChange={e => set('status', e.target.value as Filters['status'])}>
        <option value="all">All statuses</option>
        <option value="draft">Draft</option>
        <option value="review">In Review</option>
        <option value="published">Published</option>
      </select>

      <select value={filters.tag} onChange={e => set('tag', e.target.value)}>
        <option value="">All tags</option>
        {availableTags.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select value={filters.sort} onChange={e => set('sort', e.target.value as SortKey)}>
        <option value="date">Sort by date</option>
        <option value="title">Sort by title</option>
      </select>

      <select value={filters.sortDir} onChange={e => set('sortDir', e.target.value as 'asc' | 'desc')}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  )
}
