package com.studentforum.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String bio;
    private String department;
    private String academicYear;
}