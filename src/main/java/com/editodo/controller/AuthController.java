package com.editodo.controller;

import com.editodo.dto.UserDto;
import com.editodo.security.JwtTokenProvider;
import com.editodo.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    
    @PostMapping("/signup")
    public ResponseEntity<UserDto.UserInfo> signUp(@Valid @RequestBody UserDto.SignUpRequest request) {
        UserDto.UserInfo userInfo = userService.signUp(request);
        return ResponseEntity.ok(userInfo);
    }
    
    @PostMapping("/login")
    public ResponseEntity<UserDto.LoginResponse> login(@Valid @RequestBody UserDto.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        UserDto.LoginResponse response = UserDto.LoginResponse.builder()
                .accessToken(jwt)
                .refreshToken(jwt) // 실제로는 별도의 refresh token을 생성해야 함
                .userInfo(userService.getUserInfoByUsername(request.getUsername()))
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/demo-login")
    public ResponseEntity<UserDto.LoginResponse> demoLogin() {
        // 체험판 로그인 - 임시 사용자 정보로 로그인
        UserDto.LoginResponse response = UserDto.LoginResponse.builder()
                .accessToken("demo-token")
                .refreshToken("demo-refresh-token")
                .userInfo(UserDto.UserInfo.builder()
                        .userId(0L)
                        .username("demo_user")
                        .email("demo@editodo.com")
                        .nickname("체험판 사용자")
                        .isAdmin(false)
                        .build())
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDto.UserInfo> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UserDto.UserInfo userInfo = userService.getUserInfoByUsername(username);
        return ResponseEntity.ok(userInfo);
    }
}
