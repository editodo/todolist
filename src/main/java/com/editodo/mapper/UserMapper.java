package com.editodo.mapper;

import com.editodo.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    
    /**
     * 사용자 ID로 조회
     */
    Optional<User> findById(@Param("userId") Long userId);
    
    /**
     * 사용자명으로 조회
     */
    Optional<User> findByUsername(@Param("username") String username);
    
    /**
     * 이메일로 조회
     */
    Optional<User> findByEmail(@Param("email") String email);
    
    /**
     * 사용자 저장
     */
    void save(User user);
    
    /**
     * 사용자 수정
     */
    void update(User user);
    
    /**
     * 사용자 삭제
     */
    void deleteById(@Param("userId") Long userId);
    
    /**
     * 모든 사용자 조회
     */
    List<User> findAll();
}
