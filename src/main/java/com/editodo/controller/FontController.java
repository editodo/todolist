package com.editodo.controller;

import com.editodo.dto.FontDto;
import com.editodo.service.FontService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/fonts")
@RequiredArgsConstructor
public class FontController {
    
    private final FontService fontService;
    
    @GetMapping("/google")
    public ResponseEntity<List<FontDto.GoogleFont>> getGoogleFonts() {
        List<FontDto.GoogleFont> fonts = fontService.getGoogleFonts();
        return ResponseEntity.ok(fonts);
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<FontDto.FontResponse>> getUserFonts() {
        Long userId = getCurrentUserId();
        List<FontDto.FontResponse> fonts = fontService.getUserFonts(userId);
        return ResponseEntity.ok(fonts);
    }
    
    @PostMapping("/user")
    public ResponseEntity<FontDto.FontResponse> setUserFont(@Valid @RequestBody FontDto.FontRequest request) {
        Long userId = getCurrentUserId();
        FontDto.FontResponse response = fontService.setUserFont(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/user")
    public ResponseEntity<Void> deleteUserFont() {
        Long userId = getCurrentUserId();
        fontService.deleteUserFont(userId);
        return ResponseEntity.noContent().build();
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        if ("demo_user".equals(username)) {
            return 0L;
        }
        
        return 1L; // 임시로 1L 반환
    }
}
