<template>
  <div class="calendar-container">
    <el-card class="calendar-card">
      <template #header>
        <div class="calendar-header">
          <h2>캘린더</h2>
          <el-button type="primary" @click="addEvent">
            <el-icon><Plus /></el-icon>
            일정 추가
          </el-button>
        </div>
      </template>
      
      <div class="calendar-content">
        <div class="calendar-sidebar">
          <el-calendar v-model="currentDate" class="calendar-main">
            <template #dateCell="{ data }">
              <div class="calendar-day" :class="{ 'has-events': hasEvents(data.day) }">
                <span>{{ data.day.split('-').slice(2).join('') }}</span>
                <div v-if="hasEvents(data.day)" class="event-indicator"></div>
              </div>
            </template>
          </el-calendar>
        </div>
        
        <div class="calendar-events">
          <h3>{{ formatDate(currentDate) }} 일정</h3>
          <div class="events-list">
            <el-empty v-if="!getEventsForDate(currentDate).length" description="일정이 없습니다" />
            <el-card 
              v-for="event in getEventsForDate(currentDate)" 
              :key="event.eventId" 
              class="event-card"
              shadow="hover"
            >
              <div class="event-content">
                <h4>{{ event.title }}</h4>
                <p>{{ event.description }}</p>
                <div class="event-time">
                  <el-icon><Clock /></el-icon>
                  {{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}
                </div>
                <div class="event-actions">
                  <el-button size="small" type="primary" @click="editEvent(event)">
                    수정
                  </el-button>
                  <el-button size="small" type="danger" @click="deleteEvent(event.eventId)">
                    삭제
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 일정 추가/수정 다이얼로그 -->
    <el-dialog 
      v-model="eventDialogVisible" 
      :title="isEditing ? '일정 수정' : '일정 추가'"
      width="500px"
    >
      <el-form :model="eventForm" :rules="eventRules" ref="eventFormRef" label-width="80px">
        <el-form-item label="제목" prop="title">
          <el-input v-model="eventForm.title" placeholder="일정 제목을 입력하세요" />
        </el-form-item>
        <el-form-item label="설명" prop="description">
          <el-input 
            v-model="eventForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="일정 설명을 입력하세요" 
          />
        </el-form-item>
        <el-form-item label="날짜" prop="eventDate">
          <el-date-picker
            v-model="eventForm.eventDate"
            type="date"
            placeholder="날짜를 선택하세요"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="시작 시간" prop="startTime">
          <el-time-picker
            v-model="eventForm.startTime"
            placeholder="시작 시간"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="종료 시간" prop="endTime">
          <el-time-picker
            v-model="eventForm.endTime"
            placeholder="종료 시간"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="eventDialogVisible = false">취소</el-button>
          <el-button type="primary" @click="saveEvent">
            {{ isEditing ? '수정' : '추가' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Clock } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

export default {
  name: 'Calendar',
  components: {
    Plus,
    Clock
  },
  setup() {
    const store = useStore()
    const currentDate = ref(new Date())
    const eventDialogVisible = ref(false)
    const isEditing = ref(false)
    const eventFormRef = ref()
    
    const eventForm = reactive({
      eventId: null,
      title: '',
      description: '',
      eventDate: '',
      startTime: '',
      endTime: ''
    })
    
    const eventRules = {
      title: [
        { required: true, message: '제목을 입력해주세요', trigger: 'blur' }
      ],
      eventDate: [
        { required: true, message: '날짜를 선택해주세요', trigger: 'change' }
      ],
      startTime: [
        { required: true, message: '시작 시간을 선택해주세요', trigger: 'change' }
      ],
      endTime: [
        { required: true, message: '종료 시간을 선택해주세요', trigger: 'change' }
      ]
    }
    
    // Vuex store에서 상태 가져오기
    const events = computed(() => store.state.calendar.events)
    const loading = computed(() => store.state.calendar.loading)
    
    const formatDate = (date) => {
      return dayjs(date).format('YYYY년 MM월 DD일')
    }
    
    const formatTime = (time) => {
      return dayjs(`2000-01-01 ${time}`).format('HH:mm')
    }
    
    const hasEvents = (date) => {
      console.log("hasEvents", date)
      return events.value.some(event => event.eventDate === date)
    }
    
    const getEventsForDate = (date) => {
      const dateStr = dayjs(date).format('YYYY-MM-DD')
      return events.value.filter(event => event.eventDate === dateStr)
    }
    
    const addEvent = () => {
      console.log("addEvent")
      isEditing.value = false
      resetEventForm()
      eventForm.eventDate = dayjs(currentDate.value).format('YYYY-MM-DD')
      eventDialogVisible.value = true
    }
    
    const editEvent = (event) => {
      isEditing.value = true
      Object.assign(eventForm, {
        eventId: event.eventId,
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime
      })
      eventDialogVisible.value = true
    }
    
    const saveEvent = async () => {
      console.log("saveEvent", eventForm)
      try {
        await eventFormRef.value.validate()
        
        const eventData = {
          title: eventForm.title,
          description: eventForm.description,
          eventDate: eventForm.eventDate,
          startTime: eventForm.startTime,
          endTime: eventForm.endTime
        }
        
        if (isEditing.value) {
          console.log("update", eventData)
          await store.dispatch('calendar/updateEvent', {
            eventId: eventForm.eventId,
            eventData
          })
        } else {
          console.log("create", eventData)
          await store.dispatch('calendar/createEvent', eventData)
        }
        
        eventDialogVisible.value = false
        ElMessage.success(isEditing.value ? '일정이 수정되었습니다' : '일정이 추가되었습니다')
        resetEventForm()
      } catch (error) {
        console.error('일정 저장 실패:', error)
        ElMessage.error('일정 저장에 실패했습니다.')
      }
    }
    
    const deleteEvent = async (eventId) => {
      try {
        await ElMessageBox.confirm('정말로 이 일정을 삭제하시겠습니까?', '확인', {
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
          type: 'warning'
        })
        
        await store.dispatch('calendar/deleteEvent', eventId)
        ElMessage.success('일정이 삭제되었습니다')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('일정 삭제에 실패했습니다')
        }
      }
    }
    
    const resetEventForm = () => {
      Object.assign(eventForm, {
        eventId: null,
        title: '',
        description: '',
        eventDate: '',
        startTime: '',
        endTime: ''
      })
    }
    
    const loadEvents = async () => {
      try {
        await store.dispatch('calendar/fetchEvents')
      } catch (error) {
        console.error('이벤트 로드 실패:', error)
      }
    }
    
    onMounted(() => {
      loadEvents()
    })
    
    return {
      currentDate,
      events,
      loading,
      eventDialogVisible,
      isEditing,
      eventForm,
      eventFormRef,
      eventRules,
      formatDate,
      formatTime,
      hasEvents,
      getEventsForDate,
      addEvent,
      editEvent,
      saveEvent,
      deleteEvent
    }
  }
}
</script>

<style scoped>
.calendar-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-card {
  margin-bottom: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-header h2 {
  margin: 0;
  color: #303133;
}

.calendar-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.calendar-main {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.calendar-day {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.calendar-day:hover {
  background-color: #f5f7fa;
}

.calendar-day.has-events {
  font-weight: bold;
  color: #409eff;
}

.event-indicator {
  position: absolute;
  bottom: 2px;
  width: 6px;
  height: 6px;
  background-color: #409eff;
  border-radius: 50%;
}

.calendar-events {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  height: fit-content;
}

.calendar-events h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-card {
  margin-bottom: 10px;
}

.event-content h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.event-content p {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
}

.event-time {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #909399;
  font-size: 12px;
  margin-bottom: 12px;
}

.event-actions {
  display: flex;
  gap: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .calendar-content {
    grid-template-columns: 1fr;
  }
  
  .calendar-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .calendar-header h2 {
    text-align: center;
  }
}
</style>
