package com.editodo.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticePermission {
    
    private Long permissionId;
    private User user;
    private User grantedBy;
    private LocalDateTime grantedAt;
}
