package com.editodo.mapper;

import com.editodo.entity.Todo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Mapper
public interface TodoMapper {
    
    // 투두 생성
    void save(Todo todo);
    
    // 투두 조회
    Optional<Todo> findById(@Param("todoId") Long todoId);
    
    // 사용자별 투두 목록 조회 (생성일 내림차순)
    List<Todo> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    // 사용자별 특정 날짜 투두 목록 조회 (우선순위 내림차순, 생성일 오름차순)
    List<Todo> findByUserIdAndDueDateOrderByPriorityDescCreatedAtAsc(
            @Param("userId") Long userId, 
            @Param("dueDate") LocalDate dueDate);
    
    // 투두 수정
    void update(Todo todo);
    
    // 투두 삭제
    void deleteById(@Param("todoId") Long todoId);
}
