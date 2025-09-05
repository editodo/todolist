package com.editodo.controller;

import com.editodo.dto.CalendarEventDto;
import com.editodo.service.CalendarEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarEventController {
    
    private final CalendarEventService calendarEventService;
    
    @PostMapping("/events")
    public ResponseEntity<CalendarEventDto.Response> createEvent(@Valid @RequestBody CalendarEventDto.CreateRequest request) {
        Long userId = getCurrentUserId();
        CalendarEventDto.Response response = calendarEventService.createEvent(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/events")
    public ResponseEntity<List<CalendarEventDto.Response>> getEvents(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long userId = getCurrentUserId();
        List<CalendarEventDto.Response> events;
        
        if (date != null) {
            events = calendarEventService.getEventsByDate(userId, date);
        } else if (startDate != null && endDate != null) {
            events = calendarEventService.getEventsByDateRange(userId, startDate, endDate);
        } else {
            events = calendarEventService.getEventsByUser(userId);
        }
        
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/events/{eventId}")
    public ResponseEntity<CalendarEventDto.Response> getEvent(@PathVariable Long eventId) {
        Long userId = getCurrentUserId();
        CalendarEventDto.Response response = calendarEventService.getEventById(userId, eventId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/events/{eventId}")
    public ResponseEntity<CalendarEventDto.Response> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody CalendarEventDto.UpdateRequest request) {
        Long userId = getCurrentUserId();
        CalendarEventDto.Response response = calendarEventService.updateEvent(userId, eventId, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        Long userId = getCurrentUserId();
        calendarEventService.deleteEvent(userId, eventId);
        return ResponseEntity.ok().build();
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            org.springframework.security.core.userdetails.User user = 
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            // 사용자 ID를 가져오는 로직 (실제 구현에 따라 수정 필요)
            return Long.parseLong(user.getUsername());
        }
        throw new RuntimeException("인증된 사용자를 찾을 수 없습니다.");
    }
}
