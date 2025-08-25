package com.editodo.controller;

import com.editodo.dto.NoticeDto;
import com.editodo.service.NoticeService;
import com.editodo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@Slf4j
public class NoticeController {
    
    private final NoticeService noticeService;
    private final UserMapper userMapper;
    
    // 공지사항 목록 조회
    @GetMapping
    public ResponseEntity<List<NoticeDto.ListResponse>> getNoticeList() {
        List<NoticeDto.ListResponse> notices = noticeService.getNoticeList();
        return ResponseEntity.ok(notices);
    }
    
    // 공지사항 상세 조회
    @GetMapping("/{noticeId}")
    public ResponseEntity<NoticeDto.Response> getNoticeDetail(@PathVariable Long noticeId) {
        NoticeDto.Response notice = noticeService.getNoticeDetail(noticeId);
        return ResponseEntity.ok(notice);
    }
    
    // 공지사항 작성
    @PostMapping
    public ResponseEntity<NoticeDto.Response> createNotice(@Valid @RequestBody NoticeDto.CreateRequest request) {
        Long userId = getCurrentUserId();
        NoticeDto.Response notice = noticeService.createNotice(userId, request);
        return ResponseEntity.ok(notice);
    }
    
    // 공지사항 수정
    @PutMapping("/{noticeId}")
    public ResponseEntity<NoticeDto.Response> updateNotice(
            @PathVariable Long noticeId,
            @Valid @RequestBody NoticeDto.UpdateRequest request) {
        Long userId = getCurrentUserId();
        NoticeDto.Response notice = noticeService.updateNotice(userId, noticeId, request);
        return ResponseEntity.ok(notice);
    }
    
    // 공지사항 삭제
    @DeleteMapping("/{noticeId}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long noticeId) {
        Long userId = getCurrentUserId();
        noticeService.deleteNotice(userId, noticeId);
        return ResponseEntity.ok().build();
    }
    
    // 게시글 작성 권한 부여 (관리자만)
    @PostMapping("/permissions")
    public ResponseEntity<NoticeDto.PermissionResponse> grantPermission(@Valid @RequestBody NoticeDto.PermissionRequest request) {
        Long adminUserId = getCurrentUserId();
        NoticeDto.PermissionResponse permission = noticeService.grantPermission(adminUserId, request.getUserId());
        return ResponseEntity.ok(permission);
    }
    
    // 게시글 작성 권한 해제 (관리자만)
    @DeleteMapping("/permissions/{userId}")
    public ResponseEntity<Void> revokePermission(@PathVariable Long userId) {
        Long adminUserId = getCurrentUserId();
        noticeService.revokePermission(adminUserId, userId);
        return ResponseEntity.ok().build();
    }
    
    // 권한 목록 조회 (관리자만)
    @GetMapping("/permissions")
    public ResponseEntity<List<NoticeDto.PermissionResponse>> getPermissionList() {
        List<NoticeDto.PermissionResponse> permissions = noticeService.getPermissionList();
        return ResponseEntity.ok(permissions);
    }
    
    // 현재 사용자 ID 가져오기
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userMapper.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."))
                .getUserId();
    }
}
