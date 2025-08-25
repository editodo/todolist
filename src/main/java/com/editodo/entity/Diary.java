package com.editodo.entity;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Diary {
    
    private Long diaryId;
    private User user;
    private LocalDate diaryDate;
    private String content;
    private String moodEmoji;
    private String weather;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
