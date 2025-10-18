import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Award, BookOpen, MessageCircle, Edit } from 'lucide-react'
import api from '../api/axios'
import '../styles/profile.css'

const Profile = () => {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [userQuestions, setUserQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    bio: '',
    department: '',
    academicYear: '',
    skills: ''
  })

  useEffect(() => {
    fetchProfile()
    fetchUserQuestions()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/users/${userId}`)
      setProfile(data)
      setEditData({
        bio: data.bio || '',
        department: data.department || '',
        academicYear: data.academicYear || '',
        skills: data.skills?.join(', ') || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserQuestions = async () => {
    try {
      const { data } = await api.get(`/questions/user/${userId}`)
      setUserQuestions(data)
    } catch (error) {
      console.error('Error fetching user questions:', error)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      const skills = editData.skills.split(',').map(s => s.trim()).filter(s => s)
      await api.put(`/users/${userId}`, {
        ...editData,
        skills
      })
      setEditing(false)
      fetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading profile...</div>
  }

  if (!profile) {
    return <div className="error">Profile not found</div>
  }

  const isOwnProfile = currentUser?.id === parseInt(userId)

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{profile.name}</h2>
            {profile.isAdmin && <span className="admin-badge">Administrator</span>}
            <div className="profile-meta">
              {profile.department && <span>{profile.department}</span>}
              {profile.academicYear && <span>{profile.academicYear}</span>}
            </div>
          </div>
          {isOwnProfile && (
            <button onClick={() => setEditing(!editing)} className="edit-btn">
              <Edit size={18} />
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleEdit} className="profile-edit-form">
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={editData.department}
                onChange={(e) => setEditData({ ...editData, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Academic Year</label>
              <select
                value={editData.academicYear}
                onChange={(e) => setEditData({ ...editData, academicYear: e.target.value })}
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                value={editData.skills}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                placeholder="Java, Python, React"
              />
            </div>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        ) : (
          <>
            {profile.bio && (
              <div className="profile-section">
                <h3>About</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-list">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="profile-stats">
              <div className="stat-card">
                <MessageCircle size={24} />
                <div>
                  <h4>{userQuestions.length}</h4>
                  <p>Questions Asked</p>
                </div>
              </div>
              <div className="stat-card">
                <BookOpen size={24} />
                <div>
                  <h4>{profile.totalAnswers || 0}</h4>
                  <p>Answers Given</p>
                </div>
              </div>
              <div className="stat-card">
                <Award size={24} />
                <div>
                  <h4>{profile.acceptedAnswers || 0}</h4>
                  <p>Accepted Answers</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Recent Questions</h3>
              {userQuestions.length === 0 ? (
                <p className="no-content">No questions yet</p>
              ) : (
                <div className="questions-list">
                  {userQuestions.map((question) => (
                    <div key={question.id} className="question-item">
                      <h4>{question.title}</h4>
                      <div className="question-meta">
                        <span>{question.answerCount || 0} answers</span>
                        <span>{question.views || 0} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile