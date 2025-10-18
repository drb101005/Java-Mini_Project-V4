package com.studentforum.backend.controller;

import com.studentforum.backend.dto.CommentRequest;
import com.studentforum.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createComment(
            @RequestBody CommentRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(commentService.createComment(request, email));
    }

    @GetMapping("/answer/{answerId}")
    public ResponseEntity<List<Map<String, Object>>> getCommentsByAnswerId(@PathVariable Long answerId) {
        return ResponseEntity.ok(commentService.getCommentsByAnswerId(answerId));
    }
}