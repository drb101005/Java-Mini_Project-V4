package com.studentforum.backend.repository;

import com.studentforum.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT DISTINCT t.name FROM Tag t")
    List<String> findAllTagNames();
}