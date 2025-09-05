package com.editodo.entity;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarEvent {
    
    private Long eventId;
    private User user;
    private String title;
    private String description;
    private LocalDate eventDate;
    private String startTime; // HH:MM 형식
    private String endTime;   // HH:MM 형식
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
