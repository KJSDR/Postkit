import { PostCard } from 'postkit-ui-component-library'
import { formatDate } from 'postkit-date-status-display'
import { Post } from '../types/post'

interface Props {
  posts: Post[]
  onSelect: (post: Post) => void
}

export function PostList({ posts, onSelect }: Props) {
  if (posts.length === 0) return <p className="font-sans text-sm text-muted py-8">No posts found.</p>

  return (
    <ul className="space-y-6 mt-8">
      {posts.map(post => (
        <li key={post.id} className="pb-6 border-b border-muted/20 last:border-0">
          <PostCard
            title={post.title}
            author={post.author}
            status={post.status as 'draft' | 'published'}
            rawExcerpt={post.excerpt}
            createdAt={new Date(post.createdAt)}
            onClick={() => onSelect(post)}
          />
          <small className="font-sans text-sm text-muted block mt-2">
            {formatDate(post.updatedAt)} — {post.readingTime} min read — {post.tags.map(t => `#${t}`).join(' ')}
          </small>
        </li>
      ))}
    </ul>
  )
}
