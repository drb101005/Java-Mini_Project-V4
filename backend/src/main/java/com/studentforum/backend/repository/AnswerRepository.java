package com.studentforum.backend.repository;

import com.studentforum.backend.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionIdOrderByVotesDescCreatedAtDesc(Long questionId);
    Optional<Answer> findByQuestionIdAndIsAcceptedTrue(Long questionId);
    long countByUserId(Long userId);
    long countByUserIdAndIsAcceptedTrue(Long userId);
}