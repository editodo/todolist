package com.editodo.entity;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {
    
    private Long todoId;
    private User user;
    private String title;
    private String description;
    private Boolean isCompleted = false;
    private Integer priority = 1; // 1: 낮음, 2: 보통, 3: 높음
    private LocalDate dueDate;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 편의 메서드
    public void complete() {
        this.isCompleted = true;
        this.completedAt = LocalDateTime.now();
    }
    
    public void uncomplete() {
        this.isCompleted = false;
        this.completedAt = null;
    }
    
    public boolean isOverdue() {
        return dueDate != null && dueDate.isBefore(LocalDate.now()) && !isCompleted;
    }
}
