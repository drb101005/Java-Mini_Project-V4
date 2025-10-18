package com.studentforum.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuestionResponse {
    private Long id;
    private String title;
    private String content;
    private Long userId;
    private String userName;
    private Integer views;
    private LocalDateTime createdAt;
    private List<String> tags;
    private Integer answerCount;
    private Integer totalVotes;
}