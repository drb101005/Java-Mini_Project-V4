import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User, Home, PlusCircle } from 'lucide-react'
import '../styles/navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Student Forum
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <Home size={18} />
            Home
          </Link>

          {user ? (
            <>
              <Link to="/ask" className="nav-link btn-primary">
                <PlusCircle size={18} />
                Ask Question
              </Link>
              <Link to={`/profile/${user.id}`} className="nav-link">
                <User size={18} />
                Profile
              </Link>
              <button onClick={handleLogout} className="nav-link btn-logout">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link btn-secondary">
                Login
              </Link>
              <Link to="/register" className="nav-link btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar