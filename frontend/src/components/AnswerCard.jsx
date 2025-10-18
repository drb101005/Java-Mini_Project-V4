import { ThumbsUp, ThumbsDown, CheckCircle, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import CommentSection from './CommentSection'
import { formatDate } from '../utils/helpers'
import '../styles/questions.css'

const AnswerCard = ({ answer, questionAuthorId, onUpdate, onAccept }) => {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)

  const handleVote = async (voteType) => {
    if (!user) {
      alert('Please login to vote')
      return
    }
    try {
      await api.post(`/answers/${answer.id}/vote`, { voteType })
      onUpdate()
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const isQuestionAuthor = user?.id === questionAuthorId

  return (
    <div className={`answer-card ${answer.accepted ? 'accepted' : ''}`}>
      {answer.accepted && (
        <div className="accepted-badge">
          <CheckCircle size={18} />
          Accepted Answer
        </div>
      )}

      <div className="answer-content">
        <div className="answer-voting">
          <button onClick={() => handleVote(1)} className="vote-btn">
            <ThumbsUp size={20} />
          </button>
          <span className="vote-count">{answer.votes || 0}</span>
          <button onClick={() => handleVote(-1)} className="vote-btn">
            <ThumbsDown size={20} />
          </button>
        </div>

        <div className="answer-body">
          <p>{answer.content}</p>
          <div className="answer-meta">
            <span>Answered by <strong>{answer.userName}</strong></span>
            <span>{formatDate(answer.createdAt)}</span>
          </div>

          <div className="answer-actions">
            <button onClick={() => setShowComments(!showComments)} className="comment-toggle">
              <MessageCircle size={16} />
              {answer.commentCount || 0} Comments
            </button>
            
            {isQuestionAuthor && !answer.accepted && (
              <button onClick={() => onAccept(answer.id)} className="accept-btn">
                <CheckCircle size={16} />
                Accept Answer
              </button>
            )}
          </div>

          {showComments && <CommentSection answerId={answer.id} />}
        </div>
      </div>
    </div>
  )
}

export default AnswerCard