import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Post, PostFormData } from '../types/post'
import { createSlugFromTitle, makeUniqueSlug } from 'postkit-slug'
import { createExcerpt } from 'postkit-excerpt'
import { readingTime } from 'postkit-reading-time'
import { parseTags, removeDuplicateTags } from 'postkit-tag'
import { isPostValid } from 'postkit-validation-library'
import { exportPosts, importPosts } from 'postkit-storage-lib'

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

interface PostStore {
  posts: Post[]
  createPost: (data: PostFormData) => Post | null
  updatePost: (id: string, data: PostFormData) => boolean
  deletePost: (id: string) => void
  exportAllPosts: () => string
  importAllPosts: (json: string) => boolean
}

export const usePostStore = create<PostStore>()(
  persist(
    (set, get) => ({
      posts: [],

      createPost: (data) => {
        const { posts } = get()
        const candidate = buildPost(generateId(), data, posts.map(p => p.slug))
        if (!isPostValid(candidate as Parameters<typeof isPostValid>[0])) return null
        set(state => ({ posts: [candidate, ...state.posts] }))
        return candidate
      },

      updatePost: (id, data) => {
        let success = false
        set(state => {
          const existingSlugs = state.posts.filter(p => p.id !== id).map(p => p.slug)
          const original = state.posts.find(p => p.id === id)
          const updated = buildPost(id, data, existingSlugs, original?.createdAt)
          if (!isPostValid(updated as Parameters<typeof isPostValid>[0])) return state
          success = true
          return { posts: state.posts.map(p => (p.id === id ? updated : p)) }
        })
        return success
      },

      deletePost: (id) => {
        set(state => ({ posts: state.posts.filter(p => p.id !== id) }))
      },

      exportAllPosts: () => {
        return exportPosts(get().posts as Parameters<typeof exportPosts>[0])
      },

      importAllPosts: (json) => {
        const imported = importPosts(json) as Post[]
        if (imported.length === 0) return false
        set({ posts: imported })
        return true
      },
    }),
    { name: 'postkit-posts' }
  )
)
