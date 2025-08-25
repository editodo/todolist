package com.editodo.dto;

import lombok.*;

import java.time.LocalDateTime;

public class UserDto {
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SignUpRequest {
        private String username;
        private String email;
        private String password;
        private String nickname;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        private String username;
        private String password;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
        private UserInfo userInfo;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        private Long userId;
        private String username;
        private String email;
        private String nickname;
        private String profileImage;
        private String themePreference;
        private String colorPreference;
        private String fontPreference;
        private String modePreference;
        private Boolean isAdmin;
        private LocalDateTime createdAt;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String nickname;
        private String profileImage;
        private String themePreference;
        private String colorPreference;
        private String fontPreference;
        private String modePreference;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;
    }
}
