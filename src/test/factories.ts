import type { Post } from '../types/post'

let counter = 0

export function makePost(overrides: Partial<Post> = {}): Post {
  counter++
  return {
    id: `post-${counter}`,
    title: `Test Post ${counter}`,
    body: 'Body text.',
    slug: `test-post-${counter}`,
    tags: ['test'],
    category: 'General',
    status: 'draft',
    author: 'Test Author',
    excerpt: 'Body text.',
    readingTime: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}
