import { SearchInput } from 'postkit-ui-component-library'

interface Props {
  value: string
  onChange: (val: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return <SearchInput value={value} onChange={onChange} placeholder="Search posts..." debounceMs={300} />
}
