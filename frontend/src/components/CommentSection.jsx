import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { formatDate } from '../utils/helpers'
import '../styles/questions.css'

const CommentSection = ({ answerId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [answerId])

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/answer/${answerId}`)
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to comment')
      return
    }
    if (!newComment.trim()) return

    setLoading(true)
    try {
      await api.post('/comments', {
        content: newComment,
        answerId
      })
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="comments-section">
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
            <div className="comment-meta">
              <strong>{comment.userName}</strong>
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Comment'}
          </button>
        </form>
      )}
    </div>
  )
}

export default CommentSection