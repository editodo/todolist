package com.editodo.controller;

import com.editodo.dto.EmailDto;
import com.editodo.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.mail.host")
public class EmailController {
    
    private final EmailVerificationService emailVerificationService;
    
    @PostMapping("/send-verification")
    public ResponseEntity<Void> sendVerificationEmail(@Valid @RequestBody EmailDto.VerificationRequest request) {
        emailVerificationService.sendVerificationEmail(request.getEmail());
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/verify")
    public ResponseEntity<EmailDto.VerificationResponse> verifyEmail(@Valid @RequestBody EmailDto.VerificationConfirmRequest request) {
        EmailDto.VerificationResponse response = emailVerificationService.verifyEmail(request.getEmail(), request.getVerificationCode());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/find-password")
    public ResponseEntity<Void> findPassword(@Valid @RequestBody EmailDto.FindPasswordRequest request) {
        emailVerificationService.sendPasswordResetEmail(request.getUsername(), request.getEmail());
        return ResponseEntity.ok().build();
    }
}
