import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import '../styles/questions.css'

const AISummary = ({ answerId }) => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateSummary = async () => {
    setLoading(true)
    try {
      // Placeholder for AI integration
      // You can integrate with OpenAI API or Google Gemini here
      setTimeout(() => {
        setSummary('This is a placeholder AI summary. Integrate with your preferred AI service.')
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Error generating summary:', error)
      setLoading(false)
    }
  }

  return (
    <div className="ai-summary-card">
      <div className="ai-summary-header">
        <Sparkles size={20} />
        <h4>AI-Powered Summary</h4>
      </div>
      
      {!summary ? (
        <button onClick={generateSummary} disabled={loading} className="generate-btn">
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      ) : (
        <div className="ai-summary-content">
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
}

export default AISummary