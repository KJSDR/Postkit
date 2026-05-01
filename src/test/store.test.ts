import { beforeEach, describe, it, expect } from 'vitest'
import { usePostStore } from '../store/usePosts'

const validPost = {
  title: 'My Post',
  body: 'Some body content here for testing.',
  tags: [],
  category: 'General',
  status: 'draft' as const,
  author: 'Test Author',
}

// T4 — Slug is unique when two posts have the same title
describe('T4 — unique slug generation', () => {
  beforeEach(() => {
    localStorage.clear()
    usePostStore.setState({ posts: [] })
  })

  it('two posts with the same title get different slugs', () => {
    const { createPost } = usePostStore.getState()
    const post1 = createPost(validPost)
    const post2 = createPost(validPost)

    expect(post1).not.toBeNull()
    expect(post2).not.toBeNull()
    expect(post1!.slug).toBe('my-post')
    expect(post2!.slug).not.toBe('my-post')
    expect(post2!.slug).toMatch(/^my-post/)
  })
})
