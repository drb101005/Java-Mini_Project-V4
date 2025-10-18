package com.studentforum.backend.controller;

import com.studentforum.backend.dto.QuestionRequest;
import com.studentforum.backend.dto.response.QuestionResponse;
import com.studentforum.backend.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionResponse> createQuestion(
            @RequestBody QuestionRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(questionService.createQuestion(request, email));
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(questionService.getQuestionsByUserId(userId));
    }

    @PutMapping("/{id}/view")
    public ResponseEntity<Void> incrementViews(@PathVariable Long id) {
        questionService.incrementViews(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        return ResponseEntity.ok(questionService.getAllTags());
    }
}