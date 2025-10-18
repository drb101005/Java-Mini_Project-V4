package com.studentforum.backend.repository;

import com.studentforum.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByAnswerIdOrderByCreatedAtAsc(Long answerId);
}