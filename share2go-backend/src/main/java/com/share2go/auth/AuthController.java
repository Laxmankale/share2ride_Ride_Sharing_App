package com.share2go.auth;

import com.share2go.model.User;
import com.share2go.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> userOpt = userService.findByEmail(req.email());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getId(), user.getRole());

        return ResponseEntity
                .ok(new LoginResponse(accessToken, user.getId(), user.getName(), user.getRole().toString()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        if (userId == null)
            return ResponseEntity.badRequest().build();
        return ResponseEntity.noContent().build();
    }
}