package com.studentforum.backend.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String department;
    private String academicYear;

    @Column(name = "is_admin")
    private Boolean isAdmin = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Question> questions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Answer> answers;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Skill> skills;
}