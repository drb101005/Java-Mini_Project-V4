import { MessageCircle, ThumbsUp, Eye } from 'lucide-react'
import { formatDate } from '../utils/helpers'
import '../styles/questions.css'

const QuestionCard = ({ question, onClick }) => {
  return (
    <div className="question-card" onClick={() => onClick(question)}>
      <div className="question-header">
        <h3 className="question-title">{question.title}</h3>
        <span className="question-date">{formatDate(question.createdAt)}</span>
      </div>

      <p className="question-content">
        {question.content.substring(0, 200)}
        {question.content.length > 200 && '...'}
      </p>

      <div className="question-tags">
        {question.tags?.map((tag, idx) => (
          <span key={idx} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="question-footer">
        <div className="question-author">
          By <strong>{question.userName}</strong>
        </div>
        <div className="question-stats">
          <span className="stat">
            <ThumbsUp size={14} />
            {question.totalVotes || 0}
          </span>
          <span className="stat">
            <MessageCircle size={14} />
            {question.answerCount || 0}
          </span>
          <span className="stat">
            <Eye size={14} />
            {question.views || 0}
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard