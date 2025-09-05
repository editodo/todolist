package com.editodo.controller;

import com.editodo.dto.CalendarEventDto;
import com.editodo.service.CalendarEventService;
import com.editodo.mapper.UserMapper;
import com.editodo.entity.User;
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
@RequestMapping("/calendar")
@RequiredArgsConstructor
public class CalendarEventController {
    
    private final CalendarEventService calendarEventService;
    private final UserMapper userMapper;
    
    @PostMapping("/events")
    public ResponseEntity<CalendarEventDto.Response> createEvent(@Valid @RequestBody CalendarEventDto.CreateRequest request) {
        log.info("[Calendar] POST /calendar/events - request: {}", request);
        Long userId = getCurrentUserId();
        log.debug("[Calendar] currentUserId: {}", userId);
        CalendarEventDto.Response response = calendarEventService.createEvent(userId, request);
        log.info("[Calendar] created eventId: {}", response.getEventId());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/events")
    public ResponseEntity<List<CalendarEventDto.Response>> getEvents(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("[Calendar] GET /calendar/events - date: {}, startDate: {}, endDate: {}", date, startDate, endDate);
        Long userId = getCurrentUserId();
        List<CalendarEventDto.Response> events;
        
        if (date != null) {
            events = calendarEventService.getEventsByDate(userId, date);
        } else if (startDate != null && endDate != null) {
            events = calendarEventService.getEventsByDateRange(userId, startDate, endDate);
        } else {
            events = calendarEventService.getEventsByUser(userId);
        }
        
        log.info("[Calendar] fetched events: {}", events.size());
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/events/{eventId}")
    public ResponseEntity<CalendarEventDto.Response> getEvent(@PathVariable Long eventId) {
        log.info("[Calendar] GET /calendar/events/{}", eventId);
        Long userId = getCurrentUserId();
        CalendarEventDto.Response response = calendarEventService.getEventById(userId, eventId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/events/{eventId}")
    public ResponseEntity<CalendarEventDto.Response> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody CalendarEventDto.UpdateRequest request) {
        log.info("[Calendar] PUT /calendar/events/{} - request: {}", eventId, request);
        Long userId = getCurrentUserId();
        CalendarEventDto.Response response = calendarEventService.updateEvent(userId, eventId, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        log.info("[Calendar] DELETE /calendar/events/{}", eventId);
        Long userId = getCurrentUserId();
        calendarEventService.deleteEvent(userId, eventId);
        return ResponseEntity.ok().build();
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("인증된 사용자를 찾을 수 없습니다.");
        }

        Object principal = authentication.getPrincipal();
        String username;
        if (principal instanceof org.springframework.security.core.userdetails.User) {
            username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
        } else if (principal instanceof String) {
            username = (String) principal;
        } else {
            throw new RuntimeException("지원하지 않는 인증 주체 유형입니다: " + principal.getClass().getName());
        }

        try {
            return Long.parseLong(username);
        } catch (NumberFormatException ignore) {
            // username이 숫자가 아닌 경우, 사용자명으로 조회하여 userId 반환
            return userMapper.findByUsername(username)
                    .map(User::getUserId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        }
    }
}
