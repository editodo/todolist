package com.editodo.dto;

import lombok.*;

import java.time.LocalDateTime;

public class InquiryDto {
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String title;
        private String content;
        private String inquiryType; // 'bug', 'feature', 'general'
        private String email;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long inquiryId;
        private String title;
        private String content;
        private String inquiryType;
        private String status;
        private String adminResponse;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminResponseRequest {
        private String adminResponse;
    }
}
