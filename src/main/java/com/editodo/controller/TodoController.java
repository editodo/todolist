package com.editodo.controller;

import com.editodo.dto.TodoDto;
import com.editodo.service.TodoService;
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
@RequestMapping("/todos")
@RequiredArgsConstructor
public class TodoController {
    
    private final TodoService todoService;
    
    @PostMapping
    public ResponseEntity<TodoDto.Response> createTodo(@Valid @RequestBody TodoDto.CreateRequest request) {
        Long userId = getCurrentUserId();
        TodoDto.Response response = todoService.createTodo(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<TodoDto.Response>> getTodos(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Long userId = getCurrentUserId();
        List<TodoDto.Response> todos;
        
        if (date != null) {
            todos = todoService.getTodosByDate(userId, date);
        } else {
            todos = todoService.getTodosByUser(userId);
        }
        
        return ResponseEntity.ok(todos);
    }
    
    @GetMapping("/{todoId}")
    public ResponseEntity<TodoDto.Response> getTodo(@PathVariable Long todoId) {
        Long userId = getCurrentUserId();
        TodoDto.Response response = todoService.getTodoById(userId, todoId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{todoId}")
    public ResponseEntity<TodoDto.Response> updateTodo(
            @PathVariable Long todoId,
            @Valid @RequestBody TodoDto.UpdateRequest request) {
        if (todoId == null) {
            throw new IllegalArgumentException("Todo ID cannot be null");
        }
        Long userId = getCurrentUserId();
        TodoDto.Response response = todoService.updateTodo(userId, todoId, request);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{todoId}/complete")
    public ResponseEntity<TodoDto.Response> completeTodo(
            @PathVariable Long todoId,
            @RequestBody TodoDto.CompleteRequest request) {
        log.info("Complete todo request - todoId: {}, isCompleted: {}", todoId, request.getIsCompleted());
        Long userId = getCurrentUserId();
        TodoDto.Response response = todoService.completeTodo(userId, todoId, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{todoId}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long todoId) {
        Long userId = getCurrentUserId();
        todoService.deleteTodo(userId, todoId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<TodoDto.TodoStats> getTodoStats() {
        Long userId = getCurrentUserId();
        TodoDto.TodoStats stats = todoService.getTodoStats(userId);
        return ResponseEntity.ok(stats);
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // 체험판 사용자인 경우
        if ("demo_user".equals(username)) {
            return 0L;
        }
        
        // 실제 사용자인 경우 - UserService를 통해 userId를 가져와야 함
        // 여기서는 간단히 처리하기 위해 username을 기반으로 userId를 추출하는 로직을 추가할 수 있음
        return 1L; // 임시로 1L 반환
    }
}
