package com.editodo.dto;

import lombok.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CalendarEventDto {
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "제목은 필수입니다")
        private String title;
        
        private String description;
        
        @NotNull(message = "날짜는 필수입니다")
        private LocalDate eventDate;
        
        private String startTime; // HH:MM 형식
        
        private String endTime;   // HH:MM 형식
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        @NotBlank(message = "제목은 필수입니다")
        private String title;
        
        private String description;
        
        @NotNull(message = "날짜는 필수입니다")
        private LocalDate eventDate;
        
        private String startTime; // HH:MM 형식
        
        private String endTime;   // HH:MM 형식
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long eventId;
        private String title;
        private String description;
        private LocalDate eventDate;
        private String startTime;
        private String endTime;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
