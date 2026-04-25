import { SearchInput } from 'postkit-ui-component-library'
import { usePostStore } from '../store/usePosts'

export function SearchBar() {
  const { search, setSearch } = usePostStore()
  return (
    <div className="mb-6 font-sans text-sm text-ink">
      <SearchInput value={search} onChange={setSearch} placeholder="Search posts..." debounceMs={300} />
    </div>
  )
}
