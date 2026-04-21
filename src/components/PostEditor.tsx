import { useState } from 'react'
import { Post, PostFormData, PostStatus } from '../types/post'
import { parseTags } from 'postkit-tag'
import { getPostValidationErrors } from 'postkit-validation-library'

interface Props {
  post?: Post
  onSave: (data: PostFormData) => void
  onCancel: () => void
}

const EMPTY: PostFormData = {
  title: '',
  body: '',
  tags: [],
  category: '',
  status: 'draft',
  author: '',
}

export function PostEditor({ post, onSave, onCancel }: Props) {
  const [form, setForm] = useState<PostFormData>(
    post
      ? { title: post.title, body: post.body, tags: post.tags, category: post.category, status: post.status, author: post.author }
      : EMPTY
  )
  const [errors, setErrors] = useState<string[]>([])

  function set<K extends keyof PostFormData>(key: K, val: PostFormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleTagsChange(raw: string) {
    set('tags', parseTags(raw))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const candidate = { ...form, id: post?.id ?? '', slug: '', createdAt: '', updatedAt: '' }
    const issues = getPostValidationErrors(candidate as Parameters<typeof getPostValidationErrors>[0])
    if (issues.length > 0) {
      setErrors(issues.map(i => i.message))
      return
    }
    setErrors([])
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <div>
        <label>Title</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} required />
      </div>

      <div>
        <label>Author</label>
        <input value={form.author} onChange={e => set('author', e.target.value)} />
      </div>

      <div>
        <label>Body</label>
        <textarea value={form.body} onChange={e => set('body', e.target.value)} rows={10} required />
      </div>

      <div>
        <label>Tags (comma-separated)</label>
        <input value={form.tags.join(', ')} onChange={e => handleTagsChange(e.target.value)} />
      </div>

      <div>
        <label>Category</label>
        <input value={form.category} onChange={e => set('category', e.target.value)} />
      </div>

      <div>
        <label>Status</label>
        <select value={form.status} onChange={e => set('status', e.target.value as PostStatus)}>
          <option value="draft">Draft</option>
          <option value="review">In Review</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  )
}
