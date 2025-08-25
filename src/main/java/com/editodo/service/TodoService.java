package com.editodo.service;

import com.editodo.dto.TodoDto;
import com.editodo.entity.Todo;
import com.editodo.entity.User;
import com.editodo.mapper.TodoMapper;
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
public class TodoService {
    
    private final TodoMapper todoMapper;
    private final UserMapper userMapper;
    
    @Transactional
    public TodoDto.Response createTodo(Long userId, TodoDto.CreateRequest request) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Todo todo = Todo.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : 1)
                .dueDate(request.getDueDate())
                .build();
        
        todoMapper.save(todo);
        return convertToResponse(todo);
    }
    
    public List<TodoDto.Response> getTodosByUser(Long userId) {
        List<Todo> todos = todoMapper.findByUserIdOrderByCreatedAtDesc(userId);
        return todos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<TodoDto.Response> getTodosByDate(Long userId, LocalDate date) {
        List<Todo> todos = todoMapper.findByUserIdAndDueDateOrderByPriorityDescCreatedAtAsc(userId, date);
        return todos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public TodoDto.Response getTodoById(Long userId, Long todoId) {
        Todo todo = todoMapper.findById(todoId)
                .orElseThrow(() -> new RuntimeException("투두를 찾을 수 없습니다."));
        
        if (!todo.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        return convertToResponse(todo);
    }
    
    @Transactional
    public TodoDto.Response updateTodo(Long userId, Long todoId, TodoDto.UpdateRequest request) {
        Todo todo = todoMapper.findById(todoId)
                .orElseThrow(() -> new RuntimeException("투두를 찾을 수 없습니다."));
        
        if (!todo.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        if (request.getTitle() != null) {
            todo.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            todo.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            todo.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            todo.setDueDate(request.getDueDate());
        }
        if (request.getIsCompleted() != null) {
            if (request.getIsCompleted()) {
                todo.complete();
            } else {
                todo.uncomplete();
            }
        }
        
        todoMapper.update(todo);
        return convertToResponse(todo);
    }
    
    @Transactional
    public TodoDto.Response completeTodo(Long userId, Long todoId, TodoDto.CompleteRequest request) {
        log.info("Complete todo request - userId: {}, todoId: {}, isCompleted: {}", userId, todoId, request.getIsCompleted());
        
        Todo todo = todoMapper.findById(todoId)
                .orElseThrow(() -> new RuntimeException("투두를 찾을 수 없습니다."));
        
        if (!todo.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        // isCompleted가 null인 경우 기본값 false로 처리
        Boolean isCompleted = request.getIsCompleted();
        if (isCompleted == null) {
            isCompleted = false;
        }
        
        log.info("Current todo state: {}, New state: {}", todo.getIsCompleted(), isCompleted);
        
        if (isCompleted) {
            todo.complete();
            log.info("Todo marked as completed");
        } else {
            todo.uncomplete();
            log.info("Todo marked as uncompleted");
        }
        
        todoMapper.update(todo);
        TodoDto.Response response = convertToResponse(todo);
        log.info("Todo updated successfully - final state: {}", response.getIsCompleted());
        return response;
    }
    
    @Transactional
    public void deleteTodo(Long userId, Long todoId) {
        Todo todo = todoMapper.findById(todoId)
                .orElseThrow(() -> new RuntimeException("투두를 찾을 수 없습니다."));
        
        if (!todo.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("접근 권한이 없습니다.");
        }
        
        todoMapper.deleteById(todoId);
    }
    
    public TodoDto.TodoStats getTodoStats(Long userId) {
        List<Todo> allTodos = todoMapper.findByUserIdOrderByCreatedAtDesc(userId);
        
        long totalTodos = allTodos.size();
        long completedTodos = allTodos.stream().filter(Todo::getIsCompleted).count();
        long pendingTodos = totalTodos - completedTodos;
        long overdueTodos = allTodos.stream().filter(Todo::isOverdue).count();
        
        return TodoDto.TodoStats.builder()
                .totalTodos(totalTodos)
                .completedTodos(completedTodos)
                .pendingTodos(pendingTodos)
                .overdueTodos(overdueTodos)
                .build();
    }
    
    private TodoDto.Response convertToResponse(Todo todo) {
        return TodoDto.Response.builder()
                .todoId(todo.getTodoId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .isCompleted(todo.getIsCompleted())
                .priority(todo.getPriority())
                .dueDate(todo.getDueDate())
                .completedAt(todo.getCompletedAt())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .isOverdue(todo.isOverdue())
                .build();
    }
}
