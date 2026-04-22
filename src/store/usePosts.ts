import { useState, useEffect } from 'react'
import { Post, PostFormData } from '../types/post'
import { createSlugFromTitle, makeUniqueSlug } from 'postkit-slug'
import { createExcerpt } from 'postkit-excerpt'
import { readingTime } from 'postkit-reading-time'
import { parseTags, removeDuplicateTags } from 'postkit-tag'
import { isPostValid } from 'postkit-validation-library'
import { savePosts, loadPosts, exportPosts, importPosts } from 'postkit-storage-lib'

const STORAGE_KEY = 'postkit-posts'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
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
  const [posts, setPosts] = useState<Post[]>(() => loadPosts(STORAGE_KEY) as Post[])

  useEffect(() => {
    savePosts(STORAGE_KEY, posts as Parameters<typeof savePosts>[1])
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

  function exportAllPosts(): string {
    return exportPosts(posts as Parameters<typeof exportPosts>[0])
  }

  function importAllPosts(json: string): boolean {
    const imported = importPosts(json) as Post[]
    if (imported.length === 0) return false
    setPosts(imported)
    return true
  }

  return { posts, createPost, updatePost, deletePost, exportAllPosts, importAllPosts }
}
