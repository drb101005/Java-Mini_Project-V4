package com.studentforum.backend.service;

import com.studentforum.backend.dto.LoginRequest;
import com.studentforum.backend.dto.RegisterRequest;
import com.studentforum.backend.dto.response.AuthResponse;
import com.studentforum.backend.dto.response.UserResponse;
import com.studentforum.backend.model.User;
import com.studentforum.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setBio(request.getBio());
        user.setDepartment(request.getDepartment());
        user.setAcademicYear(request.getAcademicYear());
        user.setIsAdmin(false);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        UserResponse userResponse = userService.mapToUserResponse(user);

        return new AuthResponse(token, userResponse);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());
        UserResponse userResponse = userService.mapToUserResponse(user);

        return new AuthResponse(token, userResponse);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userService.mapToUserResponse(user);
    }
}