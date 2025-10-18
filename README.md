🎓 Student Discussion Forum
A modern, full-stack academic Q&A platform where students can ask questions, share knowledge, and collaborate to find the best solutions through community voting and engagement.

Show Image
Show Image
Show Image
Show Image
Show Image

📋 Table of Contents
Features
Tech Stack
System Architecture
Prerequisites
Installation
Running the Application
Project Structure
API Documentation
Screenshots
Contributing
Team
License
✨ Features
🔐 Authentication & User Management
Secure user registration and login with JWT authentication
User profiles with bio, department, academic year, and skills
Profile editing and customization
Admin user support
💬 Questions & Answers
Post questions with titles, descriptions, and tags
Browse all questions with filtering and sorting options
Search functionality across questions
View count tracking
Real-time question feed
🎯 Community Engagement
Upvote/downvote answers
Accept best answers (by question author)
Comment on answers for discussions
Tag-based categorization
Vote tracking to prevent duplicate voting
🎨 User Interface
Clean, modern design with pure CSS
Responsive layout for all devices
Smooth animations and transitions
Intuitive navigation
Modal-based question details
🔮 Additional Features
User reputation system (accepted answers count)
Skills showcase on profiles
Question statistics (views, answers, votes)
Protected routes for authenticated users
Real-time UI updates
🛠️ Tech Stack
Frontend
React 18.2.0 - UI library
React Router 6.20.1 - Client-side routing
Axios 1.6.2 - HTTP client
React Hook Form 7.49.2 - Form handling
Zod 3.22.4 - Schema validation
Lucide React 0.263.1 - Icons
Vite 5.0.8 - Build tool
Pure CSS - Styling (no frameworks)
Backend
Spring Boot 3.2.0 - Application framework
Spring Security - Authentication & authorization
Spring Data JPA - Database abstraction
MySQL 8.0 - Relational database
JWT (jjwt 0.11.5) - Token-based authentication
Lombok - Boilerplate reduction
Maven - Dependency management
Database
MySQL 8.0
8 interconnected tables
Foreign key relationships
Unique constraints for data integrity
🏗️ System Architecture
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │  HTTP   │                 │  JDBC   │                 │
│  React Frontend │ ◄─────► │  Spring Boot    │ ◄─────► │  MySQL Database │
│   (Port 3000)   │  REST   │   (Port 8080)   │         │   (Port 3306)   │
│                 │   API   │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
   - React Router            - JWT Authentication
   - Axios Interceptors      - Spring Security
   - Context API             - JPA Repositories
   - Pure CSS                - REST Controllers
Authentication Flow
User Login → Spring Security → JWT Token Generated
                    ↓
          Token stored in localStorage
                    ↓
    Every API request includes JWT in header
                    ↓
       Backend validates token → Grants/Denies access
📦 Prerequisites
Before you begin, ensure you have the following installed:

Required Software
Java Development Kit (JDK) 17 or higher
Download JDK
Verify: java -version
Node.js 18.x or higher and npm
Download Node.js
Verify: node -v and npm -v
MySQL 8.0 or higher
Download MySQL
MySQL Workbench (recommended for GUI)
Verify: mysql --version
Maven (usually bundled with IDE)
Verify: mvn -version
Optional (Recommended)
Git for version control
Visual Studio Code or IntelliJ IDEA (IDE)
Postman for API testing
🚀 Installation
Step 1: Clone the Repository
bash
# Clone the project
git clone https://github.com/yourusername/student-discussion-forum.git

# Navigate to project directory
cd student-discussion-forum
Step 2: Database Setup
2.1. Start MySQL Server
Open MySQL Workbench or use terminal
Connect to your MySQL server (default: localhost:3306)
2.2. Create Database
sql
CREATE DATABASE student_forum;
USE student_forum;
2.3. Create Tables
Run the following SQL script to create all tables:

sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    department VARCHAR(100),
    academic_year VARCHAR(50),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Questions table
CREATE TABLE questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tags table
CREATE TABLE tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Question-Tags junction table
CREATE TABLE question_tags (
    question_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (question_id, tag_id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Answers table
CREATE TABLE answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    question_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    votes INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    answer_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Votes table
CREATE TABLE votes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    answer_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    vote_type TINYINT NOT NULL,
    UNIQUE KEY unique_vote (answer_id, user_id),
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
2.4. Verify Tables Created
sql
SHOW TABLES;
-- Should show 8 tables
Step 3: Backend Setup
3.1. Navigate to Backend Directory
bash
cd backend
3.2. Configure Database Connection
Open src/main/resources/application.properties and update:

properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/student_forum
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server Configuration
server.port=8080

# JWT Configuration (Change this to a secure secret key)
jwt.secret=your-256-bit-secret-key-make-it-at-least-32-characters-long
jwt.expiration=86400000
Important: Replace YOUR_MYSQL_PASSWORD with your actual MySQL password!

3.3. Install Dependencies
bash
# Using Maven Wrapper (recommended)
./mvnw clean install

# Or if you have Maven installed globally
mvn clean install
3.4. Run Backend Server
bash
# Using Maven Wrapper
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run
Expected Output:

Started BackendApplication in X seconds (JVM running for Y)
Tomcat started on port(s): 8080 (http)
✅ Backend is now running at: http://localhost:8080

Step 4: Frontend Setup
Open a NEW terminal window (keep backend running).

4.1. Navigate to Frontend Directory
bash
cd frontend
4.2. Install Dependencies
bash
npm install
This will install all required packages including React, React Router, Axios, etc.

4.3. Run Frontend Development Server
bash
npm run dev
Expected Output:

VITE v5.0.8  ready in X ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
✅ Frontend is now running at: http://localhost:3000

🎮 Running the Application
Access the Application
Open your browser
Navigate to: http://localhost:3000
You should see the Student Discussion Forum homepage
Create Your First Account
Click "Sign Up" in the navbar
Fill in the registration form:
Full Name: Your Name
Email: your.email@example.com
Password: (at least 6 characters)
Department: Computer Science
Academic Year: 3rd Year
Click "Register"
You'll be automatically logged in and redirected to the homepage
Post Your First Question
Click "Ask Question" button
Fill in:
Title: "How do I implement binary search in Java?"
Description: Detailed explanation of what you need
Tags: "java, algorithms, data-structures"
Click "Post Your Question"
Your question appears on the homepage!
Try Other Features
✅ Answer a question - Click on any question card, write an answer
✅ Vote on answers - Use upvote/downvote buttons
✅ Accept an answer - Mark the best answer (as question author)
✅ Comment - Add comments to answers
✅ Search & Filter - Use sidebar to filter by tags or sort
✅ Edit Profile - Click your profile, add bio and skills
📁 Project Structure
student-discussion-forum/
│
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/studentforum/backend/
│   │   │   │   ├── config/          # Security & JWT configuration
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   │   │
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── QuestionController.java
│   │   │   │   │   ├── AnswerController.java
│   │   │   │   │   ├── CommentController.java
│   │   │   │   │   └── UserController.java
│   │   │   │   │
│   │   │   │   ├── model/           # Database entities
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Question.java
│   │   │   │   │   ├── Answer.java
│   │   │   │   │   ├── Comment.java
│   │   │   │   │   ├── Tag.java
│   │   │   │   │   ├── Vote.java
│   │   │   │   │   └── Skill.java
│   │   │   │   │
│   │   │   │   ├── repository/      # Database access layer
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── QuestionRepository.java
│   │   │   │   │   ├── AnswerRepository.java
│   │   │   │   │   ├── CommentRepository.java
│   │   │   │   │   ├── TagRepository.java
│   │   │   │   │   ├── VoteRepository.java
│   │   │   │   │   └── SkillRepository.java
│   │   │   │   │
│   │   │   │   ├── service/         # Business logic
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── JwtService.java
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   ├── QuestionService.java
│   │   │   │   │   ├── AnswerService.java
│   │   │   │   │   └── CommentService.java
│   │   │   │   │
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── QuestionRequest.java
│   │   │   │   │   ├── AnswerRequest.java
│   │   │   │   │   ├── CommentRequest.java
│   │   │   │   │   └── response/
│   │   │   │   │       ├── AuthResponse.java
│   │   │   │   │       ├── UserResponse.java
│   │   │   │   │       └── QuestionResponse.java
│   │   │   │   │
│   │   │   │   └── BackendApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/                    # Unit tests
│   │
│   ├── pom.xml                      # Maven dependencies
│   └── mvnw                         # Maven wrapper
│
├── frontend/                        # React Frontend
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── api/                     # API configuration
│   │   │   └── axios.js
│   │   │
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── QuestionDetails.jsx
│   │   │   ├── AnswerCard.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── AISummary.jsx
│   │   │
│   │   ├── context/                 # Global state management
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AskQuestion.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── styles/                  # CSS files
│   │   │   ├── global.css
│   │   │   ├── navbar.css
│   │   │   ├── questions.css
│   │   │   ├── forms.css
│   │   │   └── profile.css
│   │   │
│   │   ├── utils/                   # Helper functions
│   │   │   └── helpers.js
│   │   │
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   │
│   ├── index.html                   # HTML template
│   ├── package.json                 # NPM dependencies
│   └── vite.config.js               # Vite configuration
│
└── README.md                        # This file
📡 API Documentation
Base URL
http://localhost:8080/api
Authentication Endpoints
Register User
http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "department": "Computer Science",
  "academicYear": "3rd Year"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
Login
http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
Get Current User
http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  ...
}
Question Endpoints
Get All Questions
http
GET /api/questions

Response: 200 OK
[
  {
    "id": 1,
    "title": "How to implement binary search?",
    "content": "...",
    "tags": ["java", "algorithms"],
    "views": 42,
    ...
  }
]
Create Question
http
POST /api/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "How to use Spring Security?",
  "content": "Detailed question...",
  "tags": ["spring", "security"]
}

Response: 200 OK
{ ... }
Get Question by ID
http
GET /api/questions/{id}
Increment View Count
http
PUT /api/questions/{id}/view
Answer Endpoints
Get Answers for Question
http
GET /api/answers/question/{questionId}
Create Answer
http
POST /api/answers
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Here's how to solve it...",
  "questionId": 1
}
Vote on Answer
http
POST /api/answers/{id}/vote
Authorization: Bearer {token}
Content-Type: application/json

{
  "voteType": 1  // 1 for upvote, -1 for downvote
}
Accept Answer
http
PUT /api/answers/{id}/accept
Authorization: Bearer {token}
Comment Endpoints
Get Comments for Answer
http
GET /api/comments/answer/{answerId}
Create Comment
http
POST /api/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Great explanation!",
  "answerId": 1
}
User Endpoints
Get User Profile
http
GET /api/users/{id}
Update User Profile
http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "bio": "Updated bio...",
  "skills": ["Java", "React", "MySQL"]
}
📸 Screenshots
Homepage
Show Image
Browse all questions with filtering and search

Question Details
Show Image
View full question with answers and comments

Ask Question
Show Image
Post new questions with tags

User Profile
Show Image
View and edit user profiles

🐛 Troubleshooting
Common Issues
Backend won't start - Port 8080 already in use
bash
# Windows - Find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
Frontend won't start - Port 3000 already in use
bash
# Kill the process or change port in vite.config.js
server: {
  port: 3001  // Use different port
}
Database connection failed
Verify MySQL is running
Check username/password in application.properties
Ensure database student_forum exists
Test connection in MySQL Workbench
CORS errors in browser
Verify backend is running on port 8080
Check SecurityConfig.java has correct CORS configuration
Clear browser cache
JWT token expired
Tokens expire after 24 hours
Log out and log back in
Check jwt.expiration in application.properties
Build errors in backend
bash
# Clean and rebuild
./mvnw clean install -DskipTests
NPM install errors
bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
🧪 Testing
Backend Testing
bash
cd backend
./mvnw test
API Testing with cURL
bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get questions
curl http://localhost:8080/api/questions
Manual Testing Checklist
 User registration
 User login
 Post question
 Post answer
 Upvote/downvote
 Accept answer
 Post comment
 Edit profile
 Search questions
 Filter by tags
🤝 Contributing
We welcome contributions! Here's how you can help:

Fork the repository
Create a feature branch
bash
   git checkout -b feature/AmazingFeature
Commit your changes
bash
   git commit -m 'Add some AmazingFeature'
Push to the branch
bash
   git push origin feature/AmazingFeature
Open a Pull Request
Development Guidelines
Follow existing code style
Write meaningful commit messages
Add comments for complex logic
Test your changes thoroughly
Update documentation if needed
👥 Team
Project Members
Member 1 - Core Architecture & Authentication
Member 2 - User Management System
Member 3 - Q&A Functionality
Member 4 - Community Features & UI
Contact
Project Repository: GitHub
Report Issues: Issues Page
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Spring Boot Documentation
React Documentation
MySQL Documentation
Stack Overflow Community
All open-source contributors
🔮 Future Enhancements
 Email verification for registration
 Forgot password functionality
 AI-powered answer summaries (OpenAI/Gemini integration)
 Real-time notifications with WebSockets
 Markdown support in questions/answers
 File attachment uploads
 Advanced reputation system
 Badges and achievements
 Question bookmarking
 Private messaging between users
 Dark mode theme
 Mobile app (React Native)
📊 Project Statistics
Lines of Code: ~8,000+
Components: 15+ React components
API Endpoints: 20+ REST endpoints
Database Tables: 8 interconnected tables
Development Time: 2-3 weeks
Team Size: 1 members
<div align="center">
⭐ Star this repo if you found it helpful!
Made with ❤️ by the Student Discussion Forum Team

</div>
