package com.studentforum.backend.repository;

import com.studentforum.backend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}