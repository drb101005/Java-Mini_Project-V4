package com.studentforum.backend.service;

import com.studentforum.backend.dto.response.UserResponse;
import com.studentforum.backend.model.Skill;
import com.studentforum.backend.model.User;
import com.studentforum.backend.repository.AnswerRepository;
import com.studentforum.backend.repository.SkillRepository;
import com.studentforum.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final AnswerRepository answerRepository;

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserResponse request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBio(request.getBio());
        user.setDepartment(request.getDepartment());
        user.setAcademicYear(request.getAcademicYear());

        // Update skills
        skillRepository.deleteByUserId(id);
        if (request.getSkills() != null) {
            for (String skillName : request.getSkills()) {
                Skill skill = new Skill();
                skill.setUser(user);
                skill.setSkillName(skillName);
                skillRepository.save(skill);
            }
        }

        userRepository.save(user);
        return mapToUserResponse(user);
    }

    public UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setBio(user.getBio());
        response.setDepartment(user.getDepartment());
        response.setAcademicYear(user.getAcademicYear());
        response.setIsAdmin(user.getIsAdmin());

        List<String> skills = skillRepository.findByUserId(user.getId())
                .stream()
                .map(Skill::getSkillName)
                .collect(Collectors.toList());
        response.setSkills(skills);

        response.setTotalAnswers(answerRepository.countByUserId(user.getId()));
        response.setAcceptedAnswers(answerRepository.countByUserIdAndIsAcceptedTrue(user.getId()));

        return response;
    }
}