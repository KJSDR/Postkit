export type PostStatus = 'draft' | 'review' | 'published'

export type View = 'list' | 'preview' | 'editor'
export type SortKey = 'date' | 'title'
export interface Filters {
  status: PostStatus | 'all'
  tag: string
  sort: SortKey
  sortDir: 'asc' | 'desc'
}

export interface Post {
  id: string
  title: string
  body: string
  slug: string
  tags: string[]
  category: string
  status: PostStatus
  author: string
  excerpt: string
  readingTime: number
  createdAt: string
  updatedAt: string
}

export interface PostFormData {
  title: string
  body: string
  tags: string[]
  category: string
  status: PostStatus
  author: string
}
