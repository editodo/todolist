package com.editodo.mapper;

import com.editodo.entity.UserFont;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserFontMapper {
    
    /**
     * 사용자 ID로 폰트 목록 조회 (생성일 내림차순)
     */
    List<UserFont> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    /**
     * 사용자 ID와 폰트 패밀리로 폰트 조회
     */
    Optional<UserFont> findByUserIdAndFontFamily(@Param("userId") Long userId, @Param("fontFamily") String fontFamily);
    
    /**
     * 사용자 ID로 모든 폰트 삭제
     */
    void deleteByUserId(@Param("userId") Long userId);
    
    /**
     * 폰트 저장
     */
    void save(UserFont userFont);
    
    /**
     * 폰트 수정
     */
    void update(UserFont userFont);
    
    /**
     * 폰트 ID로 조회
     */
    Optional<UserFont> findById(@Param("fontId") Long fontId);
}
