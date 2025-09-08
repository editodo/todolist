package com.editodo.service;

import com.editodo.dto.NoticeDto;
import com.editodo.dto.UserDto;
import com.editodo.entity.Notice;
import com.editodo.entity.NoticeAttachment;
import com.editodo.entity.NoticePermission;
import com.editodo.entity.User;
import com.editodo.mapper.NoticeAttachmentMapper;
import com.editodo.mapper.NoticeMapper;
import com.editodo.mapper.NoticePermissionMapper;
import com.editodo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NoticeService {
    
    private final NoticeMapper noticeMapper;
    private final NoticeAttachmentMapper attachmentMapper;
    private final NoticePermissionMapper permissionMapper;
    private final UserMapper userMapper;
    
    // 공지사항 목록 조회
    public List<NoticeDto.ListResponse> getNoticeList() {
        List<Notice> notices = noticeMapper.findAllOrderByNoticeAndCreatedAtDesc();
        return notices.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }
    
    // 공지사항 상세 조회
    @Transactional
    public NoticeDto.Response getNoticeDetail(Long noticeId) {
        Notice notice = noticeMapper.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));
        
        // 조회수 증가
        noticeMapper.incrementViewCount(noticeId);
        
        // 첨부파일 조회
        List<NoticeAttachment> attachments = attachmentMapper.findByNoticeId(noticeId);
        notice.setAttachments(attachments);
        
        return convertToResponse(notice);
    }
    
    // 공지사항 작성
    @Transactional
    public NoticeDto.Response createNotice(Long userId, NoticeDto.CreateRequest request) {
        // 권한 확인
        if (!hasWritePermission(userId)) {
            throw new RuntimeException("게시글 작성 권한이 없습니다.");
        }
        
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Notice notice = Notice.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .isNotice(request.getIsNotice())
                .viewCount(0)
                .build();
        
        noticeMapper.save(notice);
        
        // 첨부파일 저장
        if (request.getAttachments() != null && !request.getAttachments().isEmpty()) {
            for (NoticeDto.AttachmentRequest attachmentRequest : request.getAttachments()) {
                NoticeAttachment attachment = NoticeAttachment.builder()
                        .notice(notice)
                        .originalFilename(attachmentRequest.getOriginalFilename())
                        .storedFilename(attachmentRequest.getStoredFilename())
                        .filePath(attachmentRequest.getFilePath())
                        .fileSize(attachmentRequest.getFileSize())
                        .mimeType(attachmentRequest.getMimeType())
                        .build();
                
                attachmentMapper.save(attachment);
            }
        }
        
        return convertToResponse(notice);
    }
    
    // 공지사항 수정
    @Transactional
    public NoticeDto.Response updateNotice(Long userId, Long noticeId, NoticeDto.UpdateRequest request) {
        Notice notice = noticeMapper.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));
        
        // 권한 확인 (작성자 또는 관리자만 수정 가능)
        if (!notice.getUser().getUserId().equals(userId) && !isAdmin(userId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }
        
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setIsNotice(request.getIsNotice());
        
        noticeMapper.update(notice);
        
        // 기존 첨부파일 삭제 후 새로 저장
        attachmentMapper.deleteByNoticeId(noticeId);
        
        if (request.getAttachments() != null && !request.getAttachments().isEmpty()) {
            for (NoticeDto.AttachmentRequest attachmentRequest : request.getAttachments()) {
                NoticeAttachment attachment = NoticeAttachment.builder()
                        .notice(notice)
                        .originalFilename(attachmentRequest.getOriginalFilename())
                        .storedFilename(attachmentRequest.getStoredFilename())
                        .filePath(attachmentRequest.getFilePath())
                        .fileSize(attachmentRequest.getFileSize())
                        .mimeType(attachmentRequest.getMimeType())
                        .build();
                
                attachmentMapper.save(attachment);
            }
        }
        
        return convertToResponse(notice);
    }
    
    // 공지사항 삭제
    @Transactional
    public void deleteNotice(Long userId, Long noticeId) {
        Notice notice = noticeMapper.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));
        
        // 권한 확인 (작성자 또는 관리자만 삭제 가능)
        if (!notice.getUser().getUserId().equals(userId) && !isAdmin(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        
        // 첨부파일 삭제
        attachmentMapper.deleteByNoticeId(noticeId);
        
        // 공지사항 삭제
        noticeMapper.deleteById(noticeId);
    }
    
    // 게시글 작성 권한 부여
    @Transactional
    public NoticeDto.PermissionResponse grantPermission(Long adminUserId, Long targetUserId) {
        if (!isAdmin(adminUserId)) {
            throw new RuntimeException("관리자만 권한을 부여할 수 있습니다.");
        }
        
        User targetUser = userMapper.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("대상 사용자를 찾을 수 없습니다."));
        
        User adminUser = userMapper.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("관리자를 찾을 수 없습니다."));
        
        // 이미 권한이 있는지 확인
        Optional<NoticePermission> existingPermission = permissionMapper.findByUserId(targetUserId);
        if (existingPermission.isPresent()) {
            throw new RuntimeException("이미 게시글 작성 권한이 부여된 사용자입니다.");
        }
        
        NoticePermission permission = NoticePermission.builder()
                .user(targetUser)
                .grantedBy(adminUser)
                .build();
        
        permissionMapper.save(permission);
        
        return convertToPermissionResponse(permission);
    }
    
    // 게시글 작성 권한 해제
    @Transactional
    public void revokePermission(Long adminUserId, Long targetUserId) {
        if (!isAdmin(adminUserId)) {
            throw new RuntimeException("관리자만 권한을 해제할 수 있습니다.");
        }
        
        permissionMapper.deleteByUserId(targetUserId);
    }
    
    // 권한 목록 조회
    public List<NoticeDto.PermissionResponse> getPermissionList() {
        List<NoticePermission> permissions = permissionMapper.findAll();
        return permissions.stream()
                .map(this::convertToPermissionResponse)
                .collect(Collectors.toList());
    }
    
    // 권한 확인
    public boolean hasWritePermission(Long userId) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 관리자는 항상 권한 있음
        if (user.getIsAdmin()) {
            return true;
        }
        
        // 권한 테이블에서 확인
        Optional<NoticePermission> permission = permissionMapper.findByUserId(userId);
        return permission.isPresent();
    }
    
    // 관리자 확인
    private boolean isAdmin(Long userId) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return user.getIsAdmin();
    }
    
    // DTO 변환 메서드들
    private NoticeDto.Response convertToResponse(Notice notice) {
        
        List<NoticeDto.AttachmentResponse> attachmentResponses =  notice.getAttachments() != null
            ? notice.getAttachments().stream()
                .map(this::convertToAttachmentResponse)
                .collect(Collectors.toList())
            : Collections.emptyList();

        
        return NoticeDto.Response.builder()
                .noticeId(notice.getNoticeId())
                .user(UserDto.UserInfo.builder()
                        .userId(notice.getUser().getUserId())
                        .username(notice.getUser().getUsername())
                        .email(notice.getUser().getEmail())
                        .nickname(notice.getUser().getNickname())
                        .isAdmin(notice.getUser().getIsAdmin())
                        .build())
                .title(notice.getTitle())
                .content(notice.getContent())
                .isNotice(notice.getIsNotice())
                .viewCount(notice.getViewCount())
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
                .attachments(attachmentResponses)
                .build();
    }
    
    private NoticeDto.ListResponse convertToListResponse(Notice notice) {
        List<NoticeAttachment> attachments = attachmentMapper.findByNoticeId(notice.getNoticeId());
        
        return NoticeDto.ListResponse.builder()
                .noticeId(notice.getNoticeId())
                .user(UserDto.UserInfo.builder()
                        .userId(notice.getUser().getUserId())
                        .username(notice.getUser().getUsername())
                        .email(notice.getUser().getEmail())
                        .nickname(notice.getUser().getNickname())
                        .isAdmin(notice.getUser().getIsAdmin())
                        .build())
                .title(notice.getTitle())
                .isNotice(notice.getIsNotice())
                .viewCount(notice.getViewCount())
                .createdAt(notice.getCreatedAt())
                .attachmentCount(attachments.size())
                .build();
    }
    
    private NoticeDto.AttachmentResponse convertToAttachmentResponse(NoticeAttachment attachment) {
        return NoticeDto.AttachmentResponse.builder()
                .attachmentId(attachment.getAttachmentId())
                .originalFilename(attachment.getOriginalFilename())
                .storedFilename(attachment.getStoredFilename())
                .filePath(attachment.getFilePath())
                .fileSize(attachment.getFileSize())
                .mimeType(attachment.getMimeType())
                .createdAt(attachment.getCreatedAt())
                .build();
    }
    
    private NoticeDto.PermissionResponse convertToPermissionResponse(NoticePermission permission) {
        return NoticeDto.PermissionResponse.builder()
                .permissionId(permission.getPermissionId())
                .user(UserDto.UserInfo.builder()
                        .userId(permission.getUser().getUserId())
                        .username(permission.getUser().getUsername())
                        .email(permission.getUser().getEmail())
                        .nickname(permission.getUser().getNickname())
                        .isAdmin(permission.getUser().getIsAdmin())
                        .build())
                .grantedBy(UserDto.UserInfo.builder()
                        .userId(permission.getGrantedBy().getUserId())
                        .username(permission.getGrantedBy().getUsername())
                        .email(permission.getGrantedBy().getEmail())
                        .nickname(permission.getGrantedBy().getNickname())
                        .isAdmin(permission.getGrantedBy().getIsAdmin())
                        .build())
                .grantedAt(permission.getGrantedAt())
                .build();
    }
}
