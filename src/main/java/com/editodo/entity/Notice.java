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
public class Notice {
    
    private Long noticeId;
    private User user;
    private String title;
    private String content;
    private Boolean isNotice = false;
    private Integer viewCount = 0;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 연관관계
    private List<NoticeAttachment> attachments = new ArrayList<>();
    
    // 편의 메서드
    public void incrementViewCount() {
        this.viewCount++;
    }
    
    public void addAttachment(NoticeAttachment attachment) {
        attachments.add(attachment);
        attachment.setNotice(this);
    }
}
