package com.editodo.service;

import com.editodo.dto.UserDto;
import com.editodo.entity.User;
import com.editodo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public UserDto.UserInfo signUp(UserDto.SignUpRequest request) {
        // 중복 검사
        if (userMapper.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        
        if (userMapper.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        
        // 사용자 생성
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname() != null ? request.getNickname() : request.getUsername())
                .themePreference("style_simple")
                .colorPreference("palette_simple")
                .fontPreference("font_default")
                .modePreference("lightmode")
                .isAdmin(false)
                .isActive(true)
                .build();
        
        userMapper.save(user);
        return convertToUserInfo(user);
    }
    
    public UserDto.UserInfo getUserInfo(Long userId) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return convertToUserInfo(user);
    }
    
    public UserDto.UserInfo getUserInfoByUsername(String username) {
        User user = userMapper.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return convertToUserInfo(user);
    }
    
    @Transactional
    public UserDto.UserInfo updateUser(Long userId, UserDto.UpdateRequest request) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        if (request.getThemePreference() != null) {
            user.setThemePreference(request.getThemePreference());
        }
        if (request.getColorPreference() != null) {
            user.setColorPreference(request.getColorPreference());
        }
        if (request.getFontPreference() != null) {
            user.setFontPreference(request.getFontPreference());
        }
        if (request.getModePreference() != null) {
            user.setModePreference(request.getModePreference());
        }
        
        userMapper.update(user);
        return convertToUserInfo(user);
    }
    
    @Transactional
    public void changePassword(Long userId, UserDto.PasswordChangeRequest request) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }
        
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userMapper.update(user);
    }
    
    private UserDto.UserInfo convertToUserInfo(User user) {
        return UserDto.UserInfo.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .themePreference(user.getThemePreference())
                .colorPreference(user.getColorPreference())
                .fontPreference(user.getFontPreference())
                .modePreference(user.getModePreference())
                .isAdmin(user.getIsAdmin())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
