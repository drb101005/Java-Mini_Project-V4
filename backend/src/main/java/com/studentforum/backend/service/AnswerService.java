package com.studentforum.backend.service;

import com.studentforum.backend.dto.AnswerRequest;
import com.studentforum.backend.model.Answer;
import com.studentforum.backend.model.Question;
import com.studentforum.backend.model.User;
import com.studentforum.backend.model.Vote;
import com.studentforum.backend.repository.AnswerRepository;
import com.studentforum.backend.repository.QuestionRepository;
import com.studentforum.backend.repository.UserRepository;
import com.studentforum.backend.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;

    @Transactional
    public Map<String, Object> createAnswer(AnswerRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Answer answer = new Answer();
        answer.setContent(request.getContent());
        answer.setQuestion(question);
        answer.setUser(user);

        answerRepository.save(answer);
        return mapToAnswerResponse(answer);
    }

    public List<Map<String, Object>> getAnswersByQuestionId(Long questionId) {
        return answerRepository.findByQuestionIdOrderByVotesDescCreatedAtDesc(questionId).stream()
                .map(this::mapToAnswerResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void voteAnswer(Long answerId, Integer voteType, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        Vote existingVote = voteRepository.findByAnswerIdAndUserId(answerId, user.getId())
                .orElse(null);

        if (existingVote != null) {
            // Update existing vote
            int oldVoteType = existingVote.getVoteType();
            answer.setVotes(answer.getVotes() - oldVoteType + voteType);
            existingVote.setVoteType(voteType);
            voteRepository.save(existingVote);
        } else {
            // Create new vote
            Vote vote = new Vote();
            vote.setAnswer(answer);
            vote.setUser(user);
            vote.setVoteType(voteType);
            voteRepository.save(vote);
            answer.setVotes(answer.getVotes() + voteType);
        }

        answerRepository.save(answer);
    }

    @Transactional
    public void acceptAnswer(Long answerId, String email) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is the question author
        if (!answer.getQuestion().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Only question author can accept answers");
        }

        // Unaccept any previously accepted answer
        answerRepository.findByQuestionIdAndIsAcceptedTrue(answer.getQuestion().getId())
                .ifPresent(prevAnswer -> {
                    prevAnswer.setIsAccepted(false);
                    answerRepository.save(prevAnswer);
                });

        answer.setIsAccepted(true);
        answerRepository.save(answer);
    }

    private Map<String, Object> mapToAnswerResponse(Answer answer) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", answer.getId());
        response.put("content", answer.getContent());
        response.put("questionId", answer.getQuestion().getId());
        response.put("userId", answer.getUser().getId());
        response.put("userName", answer.getUser().getName());
        response.put("votes", answer.getVotes());
        response.put("accepted", answer.getIsAccepted());
        response.put("createdAt", answer.getCreatedAt());
        response.put("commentCount", answer.getComments() != null ? answer.getComments().size() : 0);
        return response;
    }
}