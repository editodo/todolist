package com.editodo.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class NoticeDto {
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        private String title;
        private String content;
        private Boolean isNotice = false;
        private List<AttachmentRequest> attachments;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String title;
        private String content;
        private Boolean isNotice = false;
        private List<AttachmentRequest> attachments;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long noticeId;
        private UserDto.UserInfo user;
        private String title;
        private String content;
        private Boolean isNotice;
        private Integer viewCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<AttachmentResponse> attachments;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private Long noticeId;
        private UserDto.UserInfo user;
        private String title;
        private Boolean isNotice;
        private Integer viewCount;
        private LocalDateTime createdAt;
        private Integer attachmentCount;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttachmentRequest {
        private String originalFilename;
        private String storedFilename;
        private String filePath;
        private Long fileSize;
        private String mimeType;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AttachmentResponse {
        private Long attachmentId;
        private String originalFilename;
        private String storedFilename;
        private String filePath;
        private Long fileSize;
        private String mimeType;
        private LocalDateTime createdAt;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PermissionRequest {
        private Long userId;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PermissionResponse {
        private Long permissionId;
        private UserDto.UserInfo user;
        private UserDto.UserInfo grantedBy;
        private LocalDateTime grantedAt;
    }
}
