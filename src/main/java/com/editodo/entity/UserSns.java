package com.editodo.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSns {
    
    private Long snsId;
    private User user;
    private String provider; // 'google', 'kakao', 'naver'
    private String providerUserId;
    private String accessToken;
    private String refreshToken;
    private LocalDateTime createdAt;
}
