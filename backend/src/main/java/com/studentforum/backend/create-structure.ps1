# PowerShell Script for Windows
# Navigate to the backend project directory
# Make sure you run this from: backend/src/main/java/com/studentforum/backend/

# Create directories
New-Item -ItemType Directory -Force -Path config
New-Item -ItemType Directory -Force -Path controller
New-Item -ItemType Directory -Force -Path model
New-Item -ItemType Directory -Force -Path repository
New-Item -ItemType Directory -Force -Path service
New-Item -ItemType Directory -Force -Path dto
New-Item -ItemType Directory -Force -Path dto/response

# Create config files
New-Item -ItemType File -Force -Path config/SecurityConfig.java
New-Item -ItemType File -Force -Path config/JwtAuthenticationFilter.java

# Create controller files
New-Item -ItemType File -Force -Path controller/AuthController.java
New-Item -ItemType File -Force -Path controller/QuestionController.java
New-Item -ItemType File -Force -Path controller/AnswerController.java
New-Item -ItemType File -Force -Path controller/UserController.java
New-Item -ItemType File -Force -Path controller/CommentController.java

# Create model files
New-Item -ItemType File -Force -Path model/User.java
New-Item -ItemType File -Force -Path model/Question.java
New-Item -ItemType File -Force -Path model/Answer.java
New-Item -ItemType File -Force -Path model/Comment.java
New-Item -ItemType File -Force -Path model/Tag.java
New-Item -ItemType File -Force -Path model/Vote.java
New-Item -ItemType File -Force -Path model/Skill.java

# Create repository files
New-Item -ItemType File -Force -Path repository/UserRepository.java
New-Item -ItemType File -Force -Path repository/QuestionRepository.java
New-Item -ItemType File -Force -Path repository/AnswerRepository.java
New-Item -ItemType File -Force -Path repository/CommentRepository.java
New-Item -ItemType File -Force -Path repository/TagRepository.java
New-Item -ItemType File -Force -Path repository/VoteRepository.java
New-Item -ItemType File -Force -Path repository/SkillRepository.java

# Create service files
New-Item -ItemType File -Force -Path service/AuthService.java
New-Item -ItemType File -Force -Path service/QuestionService.java
New-Item -ItemType File -Force -Path service/AnswerService.java
New-Item -ItemType File -Force -Path service/UserService.java
New-Item -ItemType File -Force -Path service/CommentService.java
New-Item -ItemType File -Force -Path service/JwtService.java

# Create DTO files
New-Item -ItemType File -Force -Path dto/LoginRequest.java
New-Item -ItemType File -Force -Path dto/RegisterRequest.java
New-Item -ItemType File -Force -Path dto/QuestionRequest.java
New-Item -ItemType File -Force -Path dto/AnswerRequest.java
New-Item -ItemType File -Force -Path dto/CommentRequest.java
New-Item -ItemType File -Force -Path dto/response/AuthResponse.java
New-Item -ItemType File -Force -Path dto/response/QuestionResponse.java
New-Item -ItemType File -Force -Path dto/response/UserResponse.java

Write-Host "✅ All files and folders created successfully!" -ForegroundColor Green
Write-Host "📁 Directory structure is ready!" -ForegroundColor Cyan