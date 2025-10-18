package com.studentforum.backend.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String bio;
    private String department;
    private String academicYear;
    private Boolean isAdmin;
    private List<String> skills;
    private Long totalAnswers;
    private Long acceptedAnswers;
}