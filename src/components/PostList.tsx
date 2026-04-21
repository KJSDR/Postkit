import { PostCard } from 'postkit-ui-component-library'
import { formatDate } from 'postkit-date-status-display'
import { Post } from '../types/post'

interface Props {
  posts: Post[]
  onSelect: (post: Post) => void
}

export function PostList({ posts, onSelect }: Props) {
  if (posts.length === 0) return <p>No posts found.</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {posts.map(post => (
        <li key={post.id}>
          <PostCard
            title={post.title}
            author={post.author}
            status={post.status as 'draft' | 'published'}
            rawExcerpt={post.excerpt}
            createdAt={new Date(post.createdAt)}
            onClick={() => onSelect(post)}
          />
          <small>{formatDate(post.updatedAt)} — {post.readingTime} min read — {post.tags.map(t => `#${t}`).join(' ')}</small>
        </li>
      ))}
    </ul>
  )
}
