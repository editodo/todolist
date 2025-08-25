package com.editodo.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFont {
    
    private Long fontId;
    private User user;
    private String fontFamily;
    private String fontUrl;
    private Boolean isCustom = false;
    private LocalDateTime createdAt;
}
