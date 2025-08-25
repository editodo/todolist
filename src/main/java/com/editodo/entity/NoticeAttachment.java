package com.editodo.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeAttachment {
    
    private Long attachmentId;
    private Notice notice;
    private String originalFilename;
    private String storedFilename;
    private String filePath;
    private Long fileSize;
    private String mimeType;
    private LocalDateTime createdAt;
}
