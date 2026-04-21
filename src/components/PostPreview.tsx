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
      <button onClick={onBack}>← Back</button>
      <button onClick={onEdit}>Edit</button>

      <h2>{post.title}</h2>

      <dl>
        <dt>Slug</dt>        <dd>{post.slug}</dd>
        <dt>Status</dt>      <dd>
          <StatusBadge status={post.status as 'draft' | 'published'} size="sm" />
          {' '}{statusToLabel(post.status)}
        </dd>
        <dt>Excerpt</dt>     <dd>{post.excerpt}</dd>
        <dt>Reading time</dt><dd>{post.readingTime} min</dd>
        <dt>Date</dt>        <dd>{formatDate(post.createdAt)}</dd>
        <dt>Tags</dt>        <dd>{post.tags.join(', ')}</dd>
        <dt>Category</dt>    <dd>{post.category}</dd>
        <dt>Author</dt>      <dd>{post.author}</dd>
      </dl>

      <hr />
      <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
    </div>
  )
}
