import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AnswerCard from './AnswerCard'
import { formatDate } from '../utils/helpers'
import '../styles/questions.css'

const QuestionDetails = ({ question, onClose, onUpdate }) => {
  const { user } = useAuth()
  const [answers, setAnswers] = useState([])
  const [newAnswer, setNewAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAnswers()
    incrementViews()
  }, [question.id])

  const fetchAnswers = async () => {
    try {
      const { data } = await api.get(`/answers/question/${question.id}`)
      setAnswers(data)
    } catch (error) {
      console.error('Error fetching answers:', error)
    }
  }

  const incrementViews = async () => {
    try {
      await api.put(`/questions/${question.id}/view`)
    } catch (error) {
      console.error('Error incrementing views:', error)
    }
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to answer')
      return
    }
    if (!newAnswer.trim()) return

    setLoading(true)
    try {
      await api.post('/answers', {
        content: newAnswer,
        questionId: question.id
      })
      setNewAnswer('')
      fetchAnswers()
      onUpdate()
    } catch (error) {
      console.error('Error posting answer:', error)
      alert('Failed to post answer')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptAnswer = async (answerId) => {
    try {
      await api.put(`/answers/${answerId}/accept`)
      fetchAnswers()
      onUpdate()
    } catch (error) {
      console.error('Error accepting answer:', error)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="question-detail">
          <h2 className="detail-title">{question.title}</h2>
          <div className="detail-meta">
            <span>Asked by <strong>{question.userName}</strong></span>
            <span>{formatDate(question.createdAt)}</span>
          </div>
          <p className="detail-content">{question.content}</p>
          <div className="question-tags">
            {question.tags?.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="answers-section">
          <h3>{answers.length} Answer{answers.length !== 1 && 's'}</h3>
          
          {answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              questionAuthorId={question.userId}
              onUpdate={fetchAnswers}
              onAccept={handleAcceptAnswer}
            />
          ))}

          {user && (
            <form onSubmit={handleSubmitAnswer} className="answer-form">
              <h3>Your Answer</h3>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                rows="5"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Post Answer'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionDetails