package com.studentforum.backend.controller;

import com.studentforum.backend.dto.AnswerRequest;
import com.studentforum.backend.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createAnswer(
            @RequestBody AnswerRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(answerService.createAnswer(request, email));
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Map<String, Object>>> getAnswersByQuestionId(@PathVariable Long questionId) {
        return ResponseEntity.ok(answerService.getAnswersByQuestionId(questionId));
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<Void> voteAnswer(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> voteData,
            Authentication authentication
    ) {
        String email = authentication.getName();
        answerService.voteAnswer(id, voteData.get("voteType"), email);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Void> acceptAnswer(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        answerService.acceptAnswer(id, email);
        return ResponseEntity.ok().build();
    }
}