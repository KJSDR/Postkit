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
  const [tagsRaw, setTagsRaw] = useState(post ? post.tags.join(', ') : '')

  function set<K extends keyof PostFormData>(key: K, val: PostFormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleTagsBlur() {
    set('tags', parseTags(tagsRaw))
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.length > 0 && (
        <ul className="font-sans text-sm text-red-700 space-y-1">
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}

      <div className="space-y-1">
        <label className="block font-sans text-sm text-muted">Title</label>
        <input
          value={form.title}
          onChange={e => set('title', e.target.value)}
          required
          className="w-full bg-transparent font-sans text-ink text-lg border-b border-muted/40 focus:outline-none focus-visible:border-ink py-1"
        />
      </div>

      <div className="space-y-1">
        <label className="block font-sans text-sm text-muted">Author</label>
        <input
          value={form.author}
          onChange={e => set('author', e.target.value)}
          className="w-full bg-transparent font-sans text-ink border-b border-muted/40 focus:outline-none focus-visible:border-ink py-1"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-sans text-sm text-muted">Body</label>
        <textarea
          value={form.body}
          onChange={e => set('body', e.target.value)}
          rows={10}
          required
          className="w-full bg-transparent font-serif text-ink text-xl leading-relaxed tracking-wide resize-none focus:outline-none focus-visible:ring-1 focus-visible:ring-muted rounded"
        />
      </div>

      <div className="space-y-1">
        <label className="block font-sans text-sm text-muted">Tags (comma-separated)</label>
        <input
          value={tagsRaw}
          onChange={e => setTagsRaw(e.target.value)}
          onBlur={handleTagsBlur}
          className="w-full bg-transparent font-sans text-ink border-b border-muted/40 focus:outline-none focus-visible:border-ink py-1"
        />
      </div>

      <div className="space-y-1">
        <label className="block font-sans text-sm text-muted">Category</label>
        <input
          value={form.category}
          onChange={e => set('category', e.target.value)}
          className="w-full bg-transparent font-sans text-ink border-b border-muted/40 focus:outline-none focus-visible:border-ink py-1"
        />
      </div>

      <div className="space-y-1">
        <label className="block font-sans text-sm text-muted">Status</label>
        <select
          value={form.status}
          onChange={e => set('status', e.target.value as PostStatus)}
          className="bg-transparent font-sans text-ink border-b border-muted/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-muted rounded py-1 pr-2"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex gap-6 pt-2 border-t border-muted/20">
        <button
          type="submit"
          className="font-sans text-sm text-ink hover:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded transition-colors pt-4"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-sans text-sm text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-muted rounded transition-colors pt-4"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
