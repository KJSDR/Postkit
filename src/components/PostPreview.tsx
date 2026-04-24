import { StatusBadge } from 'postkit-ui-component-library'
import { formatDate, statusToLabel } from 'postkit-date-status-display'
import { Post } from '../types/post'

interface Props {
  post: Post
  onEdit: () => void
  onBack: () => void
}

export function PostPreview({ post, onEdit, onBack }: Props) {
  return (
    <div>
      <div className="flex gap-6 mb-10">
        <button
          onClick={onBack}
          className="font-sans text-sm text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-muted rounded transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onEdit}
          className="font-sans text-sm text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-muted rounded transition-colors"
        >
          Edit
        </button>
      </div>

      <h2 className="font-sans text-2xl text-ink mb-8">{post.title}</h2>

      <dl className="font-sans text-sm space-y-3 mb-10">
        <div className="flex gap-4">
          <dt className="text-muted w-28 shrink-0">Slug</dt>
          <dd className="text-ink">{post.slug}</dd>
        </div>
        <div className="flex gap-4">
          <dt className="text-muted w-28 shrink-0">Status</dt>
          <dd className="text-ink flex items-center gap-2">
            <StatusBadge status={post.status as 'draft' | 'published'} size="sm" />
            {statusToLabel(post.status)}
          </dd>
        </div>
        <div className="flex gap-4">
          <dt className="text-muted w-28 shrink-0">Excerpt</dt>
          <dd className="text-ink">{post.excerpt}</dd>
        </div>
        <div className="flex gap-4">
          <dt className="text-muted w-28 shrink-0">Reading time</dt>
          <dd className="text-ink">{post.readingTime} min</dd>
        </div>
        <div className="flex gap-4">
          <dt className="text-muted w-28 shrink-0">Date</dt>
          <dd className="text-ink">{formatDate(post.createdAt)}</dd>
        </div>
        <div className="flex gap-4">
          <dt className="text-muted w-28 shrink-0">Tags</dt>
          <dd className="text-ink">{post.tags.join(', ')}</dd>
        </div>
        <div className="flex gap-4">
          <dt className="text-muted w-28 shrink-0">Category</dt>
          <dd className="text-ink">{post.category}</dd>
        </div>
        <div className="flex gap-4">
          <dt className="text-muted w-28 shrink-0">Author</dt>
          <dd className="text-ink">{post.author}</dd>
        </div>
      </dl>

      <div className="border-t border-muted/20 pt-8">
        <p className="font-serif text-ink text-xl leading-relaxed tracking-wide whitespace-pre-wrap">{post.body}</p>
      </div>
    </div>
  )
}
