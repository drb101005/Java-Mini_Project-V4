import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import '../styles/forms.css'

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.title.length < 10) {
      setError('Title must be at least 10 characters')
      return
    }

    if (formData.content.length < 20) {
      setError('Description must be at least 20 characters')
      return
    }

    setLoading(true)

    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      await api.post('/questions', {
        ...formData,
        tags
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ask-question-page">
      <div className="ask-container">
        <h2>Ask a Question</h2>
        <p className="ask-subtitle">
          Be specific and imagine you're asking a question to another person
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label>Question Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., How do I implement binary search in Java?"
              required
            />
            <span className="helper-text">
              Be specific with your question title (min 10 characters)
            </span>
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              placeholder="Provide all the details someone would need to answer your question..."
              required
            />
            <span className="helper-text">
              Include all relevant information (min 20 characters)
            </span>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="java, algorithms, data-structures"
            />
            <span className="helper-text">
              Add up to 5 tags separated by commas
            </span>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Posting...' : 'Post Your Question'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AskQuestion