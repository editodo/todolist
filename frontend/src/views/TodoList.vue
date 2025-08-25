<template>
  <div class="todo-list">
    <div class="header">
      <div class="date-header">
        <el-button 
          type="text" 
          @click="previousDate"
          :icon="ArrowLeft"
        />
        <h2 class="date-now">
          {{ currentDateFormatted }}
        </h2>
        <el-button 
          type="text" 
          @click="nextDate"
          :icon="ArrowRight"
        />
      </div>
      
      <div class="stats">
        <el-card class="stat-card">
          <div class="stat-item">
            <span class="stat-label">전체</span>
            <span class="stat-value">{{ stats?.totalTodos || 0 }}</span>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-item">
            <span class="stat-label">완료</span>
            <span class="stat-value completed">{{ stats?.completedTodos || 0 }}</span>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-item">
            <span class="stat-label">미완료</span>
            <span class="stat-value pending">{{ stats?.pendingTodos || 0 }}</span>
          </div>
        </el-card>
      </div>
    </div>

    <div class="todo-container">
      <div class="todo-list">
        <div 
          v-for="todo in todos" 
          :key="todo.todoId" 
          class="todo-item"
          :class="{ completed: todo.isCompleted, overdue: todo.isOverdue }"
        >
          <el-checkbox 
            :model-value="todo.isCompleted"
            @click="toggleTodo(todo)"
            :disabled="loading"
          />
          <div class="todo-content">
            <h3 class="todo-title">{{ todo.title }}</h3>
            <p v-if="todo.description" class="todo-description">{{ todo.description }}</p>
            <div class="todo-meta">
              <el-tag 
                v-if="todo.priority" 
                :type="getPriorityType(todo.priority)"
                size="small"
              >
                {{ getPriorityText(todo.priority) }}
              </el-tag>
              <span v-if="todo.dueDate" class="due-date">
                {{ formatDate(todo.dueDate) }}
              </span>
            </div>
          </div>
          <div class="todo-actions">
            <el-button 
              type="text" 
              @click="editTodo(todo)"
              :icon="Edit"
            />
            <el-button 
              type="text" 
              @click="deleteTodo(todo.todoId)"
              :icon="Delete"
              class="delete-btn"
            />
          </div>
        </div>
      </div>

      <div class="add-todo">
        <el-input
          v-model="newTodoTitle"
          placeholder="새로운 할 일을 입력하세요..."
          @keyup.enter="addTodo"
          :disabled="loading"
        >
          <template #append>
            <el-button @click="addTodo" :loading="loading">
              추가
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- Todo 편집 다이얼로그 -->
    <el-dialog
      v-model="editDialogVisible"
      title="할 일 편집"
      width="500px"
    >
      <el-form :model="editingTodo" label-width="80px">
        <el-form-item label="제목">
          <el-input v-model="editingTodo.title" />
        </el-form-item>
        <el-form-item label="설명">
          <el-input 
            v-model="editingTodo.description" 
            type="textarea" 
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="우선순위">
          <el-select v-model="editingTodo.priority">
            <el-option label="낮음" :value="1" />
            <el-option label="보통" :value="2" />
            <el-option label="높음" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="마감일">
          <el-date-picker
            v-model="editingTodo.dueDate"
            type="date"
            placeholder="마감일 선택"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">취소</el-button>
        <el-button type="primary" @click="saveTodo" :loading="loading">
          저장
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, ArrowRight, Edit, Delete } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

export default {
  name: 'TodoList',
  setup() {
    const store = useStore()
    const loading = ref(false)
    const newTodoTitle = ref('')
    const editDialogVisible = ref(false)
    const editingTodo = ref({})
    const currentDate = ref(dayjs())

    const todos = computed(() => store.state.todo.todos)
    const stats = computed(() => store.state.todo.stats || {
      totalTodos: 0,
      completedTodos: 0,
      pendingTodos: 0
    })

    const currentDateFormatted = computed(() => {
      return currentDate.value.format('YYYY.MM.DD (ddd)')
    })

    const loadTodos = async () => {
      try {
        loading.value = true
        await Promise.all([
          store.dispatch('todo/fetchTodos', currentDate.value.format('YYYY-MM-DD')),
          store.dispatch('todo/fetchStats')
        ])
      } catch (error) {
        ElMessage.error('투두리스트를 불러오는데 실패했습니다.')
      } finally {
        loading.value = false
      }
    }

    const addTodo = async () => {
      if (!newTodoTitle.value.trim()) return
      
      try {
        loading.value = true
        await store.dispatch('todo/addTodo', {
          title: newTodoTitle.value,
          dueDate: currentDate.value.format('YYYY-MM-DD')
        })
        newTodoTitle.value = ''
        ElMessage.success('할 일이 추가되었습니다.')
      } catch (error) {
        ElMessage.error('할 일 추가에 실패했습니다.')
      } finally {
        loading.value = false
      }
    }

    const toggleTodo = async (todo) => {
      console.log('Toggling todo:', todo.todoId, 'current state:', todo.isCompleted)
      
      // 로딩 중이면 무시
      if (loading.value) return
      
      // 현재 상태를 미리 변경 (즉시 반영)
      const newCompletedState = !todo.isCompleted
      todo.isCompleted = newCompletedState
      
      console.log('New state will be:', newCompletedState)
      
      try {
        await store.dispatch('todo/toggleTodo', {
          todoId: todo.todoId,
          completed: newCompletedState
        })
        console.log('Todo toggled successfully')
      } catch (error) {
        console.error('Toggle todo error:', error)
        ElMessage.error('상태 변경에 실패했습니다.')
        // 실패한 경우 원래 상태로 롤백
        todo.isCompleted = !newCompletedState
      }
    }

    const editTodo = (todo) => {
      console.log('Editing todo:', todo) // 디버깅 로그
      editingTodo.value = { 
        ...todo,
        todoId: todo.todoId // 명시적으로 todoId 복사
      }
      console.log('Editing todo value:', editingTodo.value) // 디버깅 로그
      editDialogVisible.value = true
    }

    const saveTodo = async () => {
      console.log('Saving todo:', editingTodo.value) // 디버깅 로그
      if (!editingTodo.value.todoId) {
        ElMessage.error('할 일 ID가 없습니다.')
        return
      }
      
      try {
        loading.value = true
        await store.dispatch('todo/updateTodo', {
          todoId: editingTodo.value.todoId,
          todo: editingTodo.value
        })
        editDialogVisible.value = false
        ElMessage.success('할 일이 수정되었습니다.')
        await loadTodos() // 수정 후 목록 새로고침
      } catch (error) {
        console.error('Save todo error:', error) // 디버깅 로그
        ElMessage.error('할 일 수정에 실패했습니다.')
      } finally {
        loading.value = false
      }
    }

    const deleteTodo = async (todoId) => {
      try {
        await ElMessageBox.confirm('정말 삭제하시겠습니까?', '확인', {
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
          type: 'warning'
        })
        
        await store.dispatch('todo/deleteTodo', todoId)
        ElMessage.success('할 일이 삭제되었습니다.')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('할 일 삭제에 실패했습니다.')
        }
      }
    }

    const previousDate = () => {
      currentDate.value = currentDate.value.subtract(1, 'day')
      loadTodos()
    }

    const nextDate = () => {
      currentDate.value = currentDate.value.add(1, 'day')
      loadTodos()
    }

    const getPriorityType = (priority) => {
      switch (priority) {
        case 1: return 'info'
        case 2: return 'warning'
        case 3: return 'danger'
        default: return 'info'
      }
    }

    const getPriorityText = (priority) => {
      switch (priority) {
        case 1: return '낮음'
        case 2: return '보통'
        case 3: return '높음'
        default: return '낮음'
      }
    }

    const formatDate = (date) => {
      return dayjs(date).format('MM/DD')
    }

    onMounted(() => {
      loadTodos()
    })

    return {
      loading,
      newTodoTitle,
      editDialogVisible,
      editingTodo,
      currentDate,
      todos,
      stats,
      currentDateFormatted,
      addTodo,
      toggleTodo,
      editTodo,
      saveTodo,
      deleteTodo,
      previousDate,
      nextDate,
      getPriorityType,
      getPriorityText,
      formatDate,
      ArrowLeft,
      ArrowRight,
      Edit,
      Delete
    }
  }
}
</script>

<style scoped>
.todo-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.date-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.date-now {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-value.completed {
  color: var(--el-color-success);
}

.stat-value.pending {
  color: var(--el-color-warning);
}

.todo-container {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: var(--el-text-color-placeholder);
}

.todo-item.overdue {
  border-left: 3px solid var(--el-color-danger);
  padding-left: 15px;
}

.todo-content {
  flex: 1;
}

.todo-title {
  margin: 0 0 5px 0;
  font-size: 1rem;
  font-weight: 500;
}

.todo-description {
  margin: 0 0 10px 0;
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
}

.todo-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.due-date {
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}

.todo-actions {
  display: flex;
  gap: 5px;
}

.delete-btn {
  color: var(--el-color-danger);
}

.add-todo {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

@media (max-width: 768px) {
  .todo-list {
    padding: 15px;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
  
  .date-header {
    gap: 10px;
  }
  
  .date-now {
    font-size: 1.2rem;
  }
}
</style>
