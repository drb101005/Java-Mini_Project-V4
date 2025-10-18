package com.studentforum.backend.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;
    private Long answerId;
}