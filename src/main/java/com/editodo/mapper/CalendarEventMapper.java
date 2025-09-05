package com.editodo.mapper;

import com.editodo.entity.CalendarEvent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Mapper
public interface CalendarEventMapper {
    
    // 이벤트 생성
    void save(CalendarEvent event);
    
    // 이벤트 조회
    Optional<CalendarEvent> findById(@Param("eventId") Long eventId);
    
    // 사용자별 이벤트 목록 조회 (날짜순)
    List<CalendarEvent> findByUserIdOrderByEventDateAsc(@Param("userId") Long userId);
    
    // 사용자별 특정 날짜 이벤트 목록 조회 (시간순)
    List<CalendarEvent> findByUserIdAndEventDateOrderByStartTimeAsc(
            @Param("userId") Long userId, 
            @Param("eventDate") LocalDate eventDate);
    
    // 사용자별 특정 기간 이벤트 목록 조회
    List<CalendarEvent> findByUserIdAndEventDateBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
    
    // 이벤트 수정
    void update(CalendarEvent event);
    
    // 이벤트 삭제
    void deleteById(@Param("eventId") Long eventId);
    
    // 사용자별 이벤트 삭제
    void deleteByUserId(@Param("userId") Long userId);
}
