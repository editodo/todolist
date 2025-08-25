package com.editodo.mapper;

import com.editodo.entity.EmailVerification;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface EmailVerificationMapper {
    
    // 이메일 인증 정보 저장
    void save(EmailVerification emailVerification);
    
    // 이메일과 인증 코드로 조회 (미인증 상태)
    Optional<EmailVerification> findByEmailAndVerificationCodeAndIsVerifiedFalse(
            @Param("email") String email, 
            @Param("verificationCode") String verificationCode);
    
    // 이메일로 미인증 코드 삭제
    void deleteByEmailAndIsVerifiedFalse(@Param("email") String email);
    
    // 이메일 인증 정보 수정
    void update(EmailVerification emailVerification);
    
    // 이메일 인증 정보 삭제
    void deleteById(@Param("verificationId") Long verificationId);
}
