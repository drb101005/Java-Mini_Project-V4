# 🎓 Student Discussion Forum

A modern full-stack Q&A platform where students can ask questions, share knowledge, and collaborate through community voting and engagement.

## 📸 Features

- 🔐 **Secure Authentication** - JWT-based login and registration
- 💬 **Q&A System** - Post questions, provide answers, and earn reputation
- 🎯 **Community Voting** - Upvote/downvote answers and accept best solutions
- 💭 **Comments** - Discuss answers with the community
- 🏷️ **Tag System** - Categorize and filter questions by topics
- 👤 **User Profiles** - Showcase skills, bio, and academic information
- 🔍 **Search & Filter** - Find questions quickly with advanced filtering

---

## 🛠️ Tech Stack

**Frontend:** React, React Router, Axios, Vite  
**Backend:** Spring Boot, Spring Security, JWT, JPA  
**Database:** MySQL 8.0

---

## ⚙️ Prerequisites

Install these before starting:

- **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
- **Maven** (usually included with IDE)

---

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/drb101005/Java-Mini_Project-V4.git
cd Java-Mini_Project-V4
```

### Step 2: Setup Database

1. **Start MySQL** and open MySQL Workbench or terminal

2. **Create the database:**
   ```sql
   CREATE DATABASE student_forum;
   USE student_forum;
   ```

3. **Run this SQL script** to create all tables:

```sql
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
```

4. **Verify tables created:**
   ```sql
   SHOW TABLES;  -- Should show 8 tables
   ```

### Step 3: Configure Backend

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Open** `src/main/resources/application.properties`

3. **Update these settings** with your MySQL credentials:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/student_forum
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JPA Configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

# Server Configuration
server.port=8080

# JWT Configuration (use a secure secret key)
jwt.secret=your-secret-key-must-be-at-least-32-characters-long-for-security
jwt.expiration=86400000
```

**Important:** Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password!

### Step 4: Run Backend

```bash
# Install dependencies and run
./mvnw clean install
./mvnw spring-boot:run

# Or if you have Maven installed globally:
mvn clean install
mvn spring-boot:run
```

**Success!** You should see:
```
Started BackendApplication in X seconds
Tomcat started on port(s): 8080 (http)
```

Backend is now running at: **http://localhost:8080**

### Step 5: Run Frontend

**Open a NEW terminal** (keep backend running)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Success!** You should see:
```
VITE v5.0.8 ready in X ms
➜ Local: http://localhost:3000/
```

Frontend is now running at: **http://localhost:3000**

---

## 🎮 Using the Application

### 1. Access the App
Open your browser and go to: **http://localhost:3000**

### 2. Create an Account
- Click **"Sign Up"** in the navbar
- Fill in your details:
  - Full Name
  - Email
  - Password (minimum 6 characters)
  - Department
  - Academic Year
- Click **"Register"**

### 3. Ask Your First Question
- Click **"Ask Question"** button
- Fill in:
  - Title: e.g., "How to implement binary search in Java?"
  - Description: Detailed explanation
  - Tags: e.g., "java, algorithms, data-structures"
- Click **"Post Question"**

### 4. Explore Features
- ✅ Answer questions
- ✅ Vote on answers (upvote/downvote)
- ✅ Accept best answers (as question author)
- ✅ Add comments to answers
- ✅ Search and filter questions
- ✅ Edit your profile and add skills

---

## 🐛 Troubleshooting

### Backend won't start

**Issue:** Port 8080 already in use

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9
```

### Frontend won't start

**Issue:** Port 3000 already in use

Edit `vite.config.js` and change the port:
```javascript
export default defineConfig({
  server: {
    port: 3001  // Use a different port
  }
})
```

### Database connection failed

- ✅ Verify MySQL is running
- ✅ Check username/password in `application.properties`
- ✅ Ensure database `student_forum` exists
- ✅ Test connection in MySQL Workbench

### JWT token expired

- Tokens expire after 24 hours
- Simply log out and log back in

---

## 📁 Project Structure

```
Java-Mini_Project-V4/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/
│   │   ├── config/            # Security & JWT config
│   │   ├── controller/        # REST API endpoints
│   │   ├── model/             # Database entities
│   │   ├── repository/        # Data access layer
│   │   ├── service/           # Business logic
│   │   └── dto/               # Data transfer objects
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                   # React Frontend
    ├── src/
    │   ├── api/               # API configuration
    │   ├── components/        # Reusable components
    │   ├── context/           # Global state
    │   ├── pages/             # Page components
    │   └── styles/            # CSS files
    └── package.json
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create question
- `GET /api/questions/{id}` - Get question by ID
- `PUT /api/questions/{id}/view` - Increment view count

### Answers
- `GET /api/answers/question/{questionId}` - Get answers for question
- `POST /api/answers` - Create answer
- `POST /api/answers/{id}/vote` - Vote on answer
- `PUT /api/answers/{id}/accept` - Accept answer

### Comments
- `GET /api/comments/answer/{answerId}` - Get comments
- `POST /api/comments` - Create comment

### Users
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update user profile

---

## 🧪 Testing

### Test with cURL

```bash
# Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get all questions
curl http://localhost:8080/api/questions
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🔮 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Real-time notifications with WebSockets
- [ ] Markdown support
- [ ] File attachments
- [ ] Advanced reputation system
- [ ] Dark mode
- [ ] Mobile app

---

## 📞 Support

Having issues? Please check the [Troubleshooting](#-troubleshooting) section or open an issue on GitHub.

**Made with ❤️ by the Student Discussion Forum Team**

⭐ Star this repo if you find it helpful!
