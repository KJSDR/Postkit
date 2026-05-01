import { render, screen, fireEvent, act } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { App } from '../App'
import { usePostStore } from '../store/usePosts'
import { makePost } from './factories'

const defaultFilters = { status: 'all' as const, tag: '', sort: 'date' as const, sortDir: 'desc' as const }

function resetStore(posts: ReturnType<typeof makePost>[] = []) {
  localStorage.clear()
  usePostStore.setState({ posts, view: 'list', selected: null, search: '', filters: defaultFilters })
}

// T1 — Filter by status shows only matching posts
describe('T1 — filter by status', () => {
  beforeEach(() => resetStore([
    makePost({ title: 'Draft Post', status: 'draft' }),
    makePost({ title: 'Published Post', status: 'published' }),
  ]))

  it('selecting draft hides published posts', () => {
    render(<App />)
    fireEvent.change(screen.getByDisplayValue('All statuses'), { target: { value: 'draft' } })
    expect(screen.getByText('Draft Post')).toBeInTheDocument()
    expect(screen.queryByText('Published Post')).not.toBeInTheDocument()
  })
})

// T2 — Search returns only matching posts
describe('T2 — search filters posts', () => {
  beforeEach(() => resetStore([
    makePost({ title: 'Hello World', status: 'draft' }),
    makePost({ title: 'Goodbye World', status: 'draft' }),
  ]))

  it('typing a query hides non-matching posts', () => {
    vi.useFakeTimers()
    render(<App />)
    const searchInput = screen.getByPlaceholderText('Search posts...')
    fireEvent.change(searchInput, { target: { value: 'Hello' } })
    act(() => { vi.advanceTimersByTime(300) })
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.queryByText('Goodbye World')).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})

// T3 — Creating a post saves it to the list
describe('T3 — create post', () => {
  beforeEach(() => resetStore())

  it('filling the editor and saving adds the post to the list', () => {
    render(<App />)
    fireEvent.click(screen.getByText('+ New Post'))

    const textboxes = screen.getAllByRole('textbox')
    fireEvent.change(textboxes[0], { target: { value: 'My New Post' } })   // title
    fireEvent.change(textboxes[1], { target: { value: 'Test Author' } })    // author
    fireEvent.change(textboxes[2], { target: { value: 'This is the body text.' } }) // body

    // bypass HTML5 required validation — handleSubmit runs getPostValidationErrors
    const form = screen.getByRole('button', { name: 'Save' }).closest('form')!
    fireEvent.submit(form)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
    expect(usePostStore.getState().view).toBe('list')
  })
})

// T6 — Filter by tag shows only matching posts
describe('T6 — filter by tag', () => {
  beforeEach(() => resetStore([
    makePost({ title: 'JS Article', tags: ['javascript'] }),
    makePost({ title: 'CSS Article', tags: ['css'] }),
  ]))

  it('selecting a tag hides posts without that tag', async () => {
    render(<App />)
    fireEvent.change(screen.getByDisplayValue('All tags'), { target: { value: 'javascript' } })
    expect(screen.getByText('JS Article')).toBeInTheDocument()
    expect(screen.queryByText('CSS Article')).not.toBeInTheDocument()
  })
})
