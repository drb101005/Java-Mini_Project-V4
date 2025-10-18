import { useState, useEffect } from 'react'
import api from '../api/axios'
import '../styles/questions.css'

const Filters = ({ onFilterChange, onSortChange }) => {
  const [tags, setTags] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const { data } = await api.get('/questions/tags')
      setTags(data)
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const handleTagChange = (tag) => {
    setSelectedTag(tag)
    onFilterChange(tag)
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    onSortChange(sort)
  }

  return (
    <div className="filters-sidebar">
      <div className="filter-section">
        <h3>Sort By</h3>
        <div className="filter-options">
          <button
            className={sortBy === 'newest' ? 'active' : ''}
            onClick={() => handleSortChange('newest')}
          >
            Newest
          </button>
          <button
            className={sortBy === 'popular' ? 'active' : ''}
            onClick={() => handleSortChange('popular')}
          >
            Most Popular
          </button>
          <button
            className={sortBy === 'unanswered' ? 'active' : ''}
            onClick={() => handleSortChange('unanswered')}
          >
            Unanswered
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h3>Filter by Tag</h3>
        <div className="filter-tags">
          <button
            className={selectedTag === '' ? 'active' : ''}
            onClick={() => handleTagChange('')}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              className={selectedTag === tag ? 'active' : ''}
              onClick={() => handleTagChange(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Filters