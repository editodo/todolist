package com.editodo.dto;

import lombok.*;

public class EmailDto {
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerificationRequest {
        private String email;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerificationConfirmRequest {
        private String email;
        private String verificationCode;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerificationResponse {
        private Boolean isVerified;
        private String message;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FindIdRequest {
        private String username;
        private String phoneNumber;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FindPasswordRequest {
        private String username;
        private String email;
        private String phoneNumber;
    }
}
