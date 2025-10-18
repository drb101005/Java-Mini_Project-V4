package com.studentforum.backend.service;

import com.studentforum.backend.dto.QuestionRequest;
import com.studentforum.backend.dto.response.QuestionResponse;
import com.studentforum.backend.model.Question;
import com.studentforum.backend.model.Tag;
import com.studentforum.backend.model.User;
import com.studentforum.backend.repository.QuestionRepository;
import com.studentforum.backend.repository.TagRepository;
import com.studentforum.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @Transactional
    public QuestionResponse createQuestion(QuestionRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = new Question();
        question.setTitle(request.getTitle());
        question.setContent(request.getContent());
        question.setUser(user);

        // Handle tags
        List<Tag> tags = new ArrayList<>();
        if (request.getTags() != null) {
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            return tagRepository.save(newTag);
                        });
                tags.add(tag);
            }
        }
        question.setTags(tags);

        questionRepository.save(question);
        return mapToQuestionResponse(question);
    }

    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
    }

    public QuestionResponse getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return mapToQuestionResponse(question);
    }

    public List<QuestionResponse> getQuestionsByUserId(Long userId) {
        return questionRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToQuestionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void incrementViews(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        question.setViews(question.getViews() + 1);
        questionRepository.save(question);
    }

    public List<String> getAllTags() {
        return questionRepository.findAllTagNames();
    }

    private QuestionResponse mapToQuestionResponse(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setTitle(question.getTitle());
        response.setContent(question.getContent());
        response.setUserId(question.getUser().getId());
        response.setUserName(question.getUser().getName());
        response.setViews(question.getViews());
        response.setCreatedAt(question.getCreatedAt());

        List<String> tagNames = question.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
        response.setTags(tagNames);

        response.setAnswerCount(question.getAnswers() != null ? question.getAnswers().size() : 0);
        
        Integer totalVotes = question.getAnswers() != null ? 
                question.getAnswers().stream()
                        .mapToInt(a -> a.getVotes() != null ? a.getVotes() : 0)
                        .sum() : 0;
        response.setTotalVotes(totalVotes);

        return response;
    }
}