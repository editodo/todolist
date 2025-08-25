package com.editodo.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TodoDto {
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String title;
        private String description;
        private Integer priority;
        private LocalDate dueDate;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String title;
        private String description;
        private Integer priority;
        private LocalDate dueDate;
        private Boolean isCompleted;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long todoId;
        private String title;
        private String description;
        private Boolean isCompleted;
        private Integer priority;
        private LocalDate dueDate;
        private LocalDateTime completedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Boolean isOverdue;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompleteRequest {
        private Boolean isCompleted = false;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TodoStats {
        private Long totalTodos;
        private Long completedTodos;
        private Long pendingTodos;
        private Long overdueTodos;
    }
}
