package com.studentforum.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionRequest {
    private String title;
    private String content;
    private List<String> tags;
}