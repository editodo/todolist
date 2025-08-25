package com.editodo.service;

import com.editodo.dto.FontDto;
import com.editodo.entity.User;
import com.editodo.entity.UserFont;
import com.editodo.mapper.UserFontMapper;
import com.editodo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FontService {
    
    private final UserFontMapper userFontMapper;
    private final UserMapper userMapper;
    private final RestTemplate restTemplate;
    
    private static final String GOOGLE_FONTS_API = "https://www.googleapis.com/webfonts/v1/webfonts?key=";
    
    @Value("${google.fonts.api-key}")
    private String googleFontsApiKey;
    
    public List<FontDto.GoogleFont> getGoogleFonts() {
        try {
            String url = GOOGLE_FONTS_API + googleFontsApiKey;
            // Google Fonts API 호출 로직 구현
            // 실제로는 Google Fonts API 응답을 파싱하여 반환
            return List.of(
                FontDto.GoogleFont.builder()
                    .family("Noto Sans KR")
                    .category("sans-serif")
                    .variants(List.of("100", "300", "400", "500", "700", "900"))
                    .url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap")
                    .build(),
                FontDto.GoogleFont.builder()
                    .family("Nanum Gothic")
                    .category("sans-serif")
                    .variants(List.of("400", "700", "800"))
                    .url("https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap")
                    .build()
            );
        } catch (Exception e) {
            log.error("Google Fonts API 호출 실패", e);
            return List.of();
        }
    }
    
    public List<FontDto.FontResponse> getUserFonts(Long userId) {
        List<UserFont> userFonts = userFontMapper.findByUserIdOrderByCreatedAtDesc(userId);
        return userFonts.stream()
                .map(this::convertToFontResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public FontDto.FontResponse setUserFont(Long userId, FontDto.FontRequest request) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 기존 폰트 설정 삭제
        userFontMapper.deleteByUserId(userId);
        
        // 새로운 폰트 설정 저장
        UserFont userFont = UserFont.builder()
                .user(user)
                .fontFamily(request.getFontFamily())
                .fontUrl(request.getFontUrl())
                .isCustom(false)
                .build();
        
        userFontMapper.save(userFont);
        return convertToFontResponse(userFont);
    }
    
    @Transactional
    public void deleteUserFont(Long userId) {
        userFontMapper.deleteByUserId(userId);
    }
    
    private FontDto.FontResponse convertToFontResponse(UserFont userFont) {
        return FontDto.FontResponse.builder()
                .fontFamily(userFont.getFontFamily())
                .fontUrl(userFont.getFontUrl())
                .isCustom(userFont.getIsCustom())
                .build();
    }
}
