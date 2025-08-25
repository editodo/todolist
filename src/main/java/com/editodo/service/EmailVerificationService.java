package com.editodo.service;

import com.editodo.dto.EmailDto;
import com.editodo.entity.EmailVerification;
import com.editodo.entity.User;
import com.editodo.mapper.EmailVerificationMapper;
import com.editodo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@ConditionalOnProperty(name = "spring.mail.host")
public class EmailVerificationService {
    
    private final EmailVerificationMapper emailVerificationMapper;
    private final UserMapper userMapper;
    private final EmailService emailService;
    
    @Transactional
    public void sendVerificationEmail(String email) {
        // 기존 미인증 코드 삭제
        emailVerificationMapper.deleteByEmailAndIsVerifiedFalse(email);
        
        // 새로운 인증 코드 생성
        String verificationCode = generateVerificationCode();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);
        
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .verificationCode(verificationCode)
                .expiresAt(expiresAt)
                .build();
        
        emailVerificationMapper.save(verification);
        emailService.sendVerificationEmail(email, verificationCode);
    }
    
    @Transactional
    public EmailDto.VerificationResponse verifyEmail(String email, String verificationCode) {
        EmailVerification verification = emailVerificationMapper
                .findByEmailAndVerificationCodeAndIsVerifiedFalse(email, verificationCode)
                .orElse(null);
        
        if (verification == null) {
            return EmailDto.VerificationResponse.builder()
                    .isVerified(false)
                    .message("인증 코드가 올바르지 않습니다.")
                    .build();
        }
        
        if (verification.isExpired()) {
            return EmailDto.VerificationResponse.builder()
                    .isVerified(false)
                    .message("인증 코드가 만료되었습니다.")
                    .build();
        }
        
        verification.setIsVerified(true);
        emailVerificationMapper.update(verification);
        
        return EmailDto.VerificationResponse.builder()
                .isVerified(true)
                .message("이메일 인증이 완료되었습니다.")
                .build();
    }
    
    @Transactional
    public void sendPasswordResetEmail(String username, String email) {
        User user = userMapper.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        if (!user.getEmail().equals(email)) {
            throw new RuntimeException("이메일이 일치하지 않습니다.");
        }
        
        String temporaryPassword = generateTemporaryPassword();
        user.setPasswordHash(temporaryPassword); // 실제로는 암호화 필요
        userMapper.update(user);
        
        emailService.sendPasswordResetEmail(email, temporaryPassword);
    }
    
    private String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }
    
    private String generateTemporaryPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }
}
