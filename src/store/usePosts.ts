import { useState, useEffect } from 'react'
import { Post, PostFormData } from '../types/post'
import { createSlugFromTitle, makeUniqueSlug } from 'postkit-slug'
import { createExcerpt } from 'postkit-excerpt'
import { readingTime } from 'postkit-reading-time'
import { parseTags, removeDuplicateTags } from 'postkit-tag'
import { isPostValid } from 'postkit-validation-library'

const STORAGE_KEY = 'postkit-posts'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function load(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(posts: Post[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

function buildPost(id: string, data: PostFormData, existingSlugs: string[], createdAt?: string): Post {
  const rawSlug = createSlugFromTitle(data.title)
  const slug = makeUniqueSlug(rawSlug, existingSlugs)
  const tags = removeDuplicateTags(parseTags(data.tags.join(', ')))
  const now = new Date().toISOString()

  return {
    id,
    title: data.title,
    body: data.body,
    slug,
    tags,
    category: data.category,
    status: data.status,
    author: data.author,
    excerpt: createExcerpt(data.body, 150),
    readingTime: readingTime(data.body),
    createdAt: createdAt ?? now,
    updatedAt: now,
  }
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(load)

  useEffect(() => {
    save(posts)
  }, [posts])

  function createPost(data: PostFormData): Post | null {
    const candidate = buildPost(generateId(), data, posts.map(p => p.slug))
    if (!isPostValid(candidate as Parameters<typeof isPostValid>[0])) return null
    setPosts(prev => [candidate, ...prev])
    return candidate
  }

  function updatePost(id: string, data: PostFormData): boolean {
    let success = false
    setPosts(prev => {
      const existingSlugs = prev.filter(p => p.id !== id).map(p => p.slug)
      const original = prev.find(p => p.id === id)
      const updated = buildPost(id, data, existingSlugs, original?.createdAt)
      if (!isPostValid(updated as Parameters<typeof isPostValid>[0])) return prev
      success = true
      return prev.map(p => (p.id === id ? updated : p))
    })
    return success
  }

  function deletePost(id: string): void {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return { posts, createPost, updatePost, deletePost }
}
