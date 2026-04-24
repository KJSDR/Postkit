import { SearchInput } from 'postkit-ui-component-library'

interface Props {
  value: string
  onChange: (val: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="mb-6 font-sans text-sm text-ink">
      <SearchInput value={value} onChange={onChange} placeholder="Search posts..." debounceMs={300} />
    </div>
  )
}
