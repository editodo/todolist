package com.editodo.service;

import com.editodo.dto.CalendarEventDto;
import com.editodo.entity.CalendarEvent;
import com.editodo.entity.User;
import com.editodo.mapper.CalendarEventMapper;
import com.editodo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarEventService {
    
    private final CalendarEventMapper calendarEventMapper;
    private final UserMapper userMapper;
    
    @Transactional
    public CalendarEventDto.Response createEvent(Long userId, CalendarEventDto.CreateRequest request) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        CalendarEvent event = CalendarEvent.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
        
        calendarEventMapper.save(event);
        return convertToResponse(event);
    }
    
    public List<CalendarEventDto.Response> getEventsByUser(Long userId) {
        List<CalendarEvent> events = calendarEventMapper.findByUserIdOrderByEventDateAsc(userId);
        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CalendarEventDto.Response> getEventsByDate(Long userId, LocalDate date) {
        List<CalendarEvent> events = calendarEventMapper.findByUserIdAndEventDateOrderByStartTimeAsc(userId, date);
        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CalendarEventDto.Response> getEventsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        List<CalendarEvent> events = calendarEventMapper.findByUserIdAndEventDateBetween(userId, startDate, endDate);
        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public CalendarEventDto.Response getEventById(Long userId, Long eventId) {
        CalendarEvent event = calendarEventMapper.findById(eventId)
                .orElseThrow(() -> new RuntimeException("이벤트를 찾을 수 없습니다."));
        
        // 사용자 권한 확인
        if (!event.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("이벤트에 접근할 권한이 없습니다.");
        }
        
        return convertToResponse(event);
    }
    
    @Transactional
    public CalendarEventDto.Response updateEvent(Long userId, Long eventId, CalendarEventDto.UpdateRequest request) {
        CalendarEvent event = calendarEventMapper.findById(eventId)
                .orElseThrow(() -> new RuntimeException("이벤트를 찾을 수 없습니다."));
        
        // 사용자 권한 확인
        if (!event.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("이벤트를 수정할 권한이 없습니다.");
        }
        
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        
        calendarEventMapper.update(event);
        return convertToResponse(event);
    }
    
    @Transactional
    public void deleteEvent(Long userId, Long eventId) {
        CalendarEvent event = calendarEventMapper.findById(eventId)
                .orElseThrow(() -> new RuntimeException("이벤트를 찾을 수 없습니다."));
        
        // 사용자 권한 확인
        if (!event.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("이벤트를 삭제할 권한이 없습니다.");
        }
        
        calendarEventMapper.deleteById(eventId);
    }
    
    private CalendarEventDto.Response convertToResponse(CalendarEvent event) {
        return CalendarEventDto.Response.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
