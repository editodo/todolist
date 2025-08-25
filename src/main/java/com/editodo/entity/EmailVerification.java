package com.editodo.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerification {
    
    private Long verificationId;
    private User user;
    private String email;
    private String verificationCode;
    private Boolean isVerified = false;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
