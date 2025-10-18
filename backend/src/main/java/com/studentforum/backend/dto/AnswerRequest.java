package com.studentforum.backend.dto;

import lombok.Data;

@Data
public class AnswerRequest {
    private String content;
    private Long questionId;
}