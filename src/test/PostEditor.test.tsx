import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { PostEditor } from '../components/PostEditor'
import { usePostStore } from '../store/usePosts'

// T5 — Validation prevents saving an invalid post
describe('T5 — validation blocks empty title', () => {
  beforeEach(() => {
    localStorage.clear()
    usePostStore.setState({ posts: [] })
  })

  it('submitting with no title shows an error and does not save', () => {
    const onSave = vi.fn()
    render(<PostEditor onSave={onSave} onCancel={vi.fn()} />)

    // fireEvent.submit bypasses HTML5 required — exercises getPostValidationErrors directly
    const form = screen.getByRole('button', { name: 'Save' }).closest('form')!
    fireEvent.submit(form)

    expect(onSave).not.toHaveBeenCalled()
    expect(usePostStore.getState().posts).toHaveLength(0)
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
  })
})
