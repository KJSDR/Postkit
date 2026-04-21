export type PostStatus = 'draft' | 'review' | 'published'

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
