package com.studentforum.backend.service;

import com.studentforum.backend.dto.CommentRequest;
import com.studentforum.backend.model.Answer;
import com.studentforum.backend.model.Comment;
import com.studentforum.backend.model.User;
import com.studentforum.backend.repository.AnswerRepository;
import com.studentforum.backend.repository.CommentRepository;
import com.studentforum.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    @Transactional
    public Map<String, Object> createComment(CommentRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Answer answer = answerRepository.findById(request.getAnswerId())
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setAnswer(answer);
        comment.setUser(user);

        commentRepository.save(comment);
        return mapToCommentResponse(comment);
    }

    public List<Map<String, Object>> getCommentsByAnswerId(Long answerId) {
        return commentRepository.findByAnswerIdOrderByCreatedAtAsc(answerId).stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    private Map<String, Object> mapToCommentResponse(Comment comment) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", comment.getId());
        response.put("content", comment.getContent());
        response.put("answerId", comment.getAnswer().getId());
        response.put("userId", comment.getUser().getId());
        response.put("userName", comment.getUser().getName());
        response.put("createdAt", comment.getCreatedAt());
        return response;
    }
}