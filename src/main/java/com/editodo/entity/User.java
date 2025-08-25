package com.editodo.entity;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    private Long userId;
    private String username;
    private String email;
    private String passwordHash;
    private String nickname;
    private String profileImage;
    private String themePreference = "style_simple";
    private String colorPreference = "palette_simple";
    private String fontPreference = "font_default";
    private String modePreference = "lightmode";
    private Boolean isAdmin = false;
    private Boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 연관관계 (MyBatis에서는 필요시 조인으로 처리)
    private List<Todo> todos = new ArrayList<>();
    private List<Diary> diaries = new ArrayList<>();
    private List<UserSns> userSnsList = new ArrayList<>();
    
    // 편의 메서드
    public void addTodo(Todo todo) {
        todos.add(todo);
        todo.setUser(this);
    }
    
    public void addDiary(Diary diary) {
        diaries.add(diary);
        diary.setUser(this);
    }
}
