import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import api from '../api/axios'
import QuestionCard from '../components/QuestionCard'
import QuestionDetails from '../components/QuestionDetails'
import Filters from '../components/Filters'
import '../styles/questions.css'

const Home = () => {
  const [questions, setQuestions] = useState([])
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get('/questions')
      setQuestions(data)
      setFilteredQuestions(data)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    
    const filtered = questions.filter(q =>
      q.title.toLowerCase().includes(term) ||
      q.content.toLowerCase().includes(term) ||
      q.tags?.some(tag => tag.toLowerCase().includes(term))
    )
    setFilteredQuestions(filtered)
  }

  const handleFilterChange = (tag) => {
    if (!tag) {
      setFilteredQuestions(questions)
    } else {
      const filtered = questions.filter(q => q.tags?.includes(tag))
      setFilteredQuestions(filtered)
    }
  }

  const handleSortChange = (sortBy) => {
    let sorted = [...filteredQuestions]
    
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'popular') {
      sorted.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))
    } else if (sortBy === 'unanswered') {
      sorted = sorted.filter(q => !q.answerCount || q.answerCount === 0)
    }
    
    setFilteredQuestions(sorted)
  }

  if (loading) {
    return <div className="loading">Loading questions...</div>
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <Filters onFilterChange={handleFilterChange} onSortChange={handleSortChange} />

        <div className="questions-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="questions-header">
            <h2>All Questions</h2>
            <span className="question-count">{filteredQuestions.length} questions</span>
          </div>

          <div className="questions-list">
            {filteredQuestions.length === 0 ? (
              <div className="no-questions">
                <p>No questions found. Be the first to ask!</p>
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onClick={setSelectedQuestion}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {selectedQuestion && (
        <QuestionDetails
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onUpdate={fetchQuestions}
        />
      )}
    </div>
  )
}

export default Home