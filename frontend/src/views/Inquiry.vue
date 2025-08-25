<template>
  <div class="inquiry">
    <div class="header">
      <h2>문의사항</h2>
      <p>궁금한 점이나 개선사항을 알려주세요!</p>
    </div>

    <div class="form-container">
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="120px"
        class="inquiry-form"
      >
        <el-form-item label="답변 받을 이메일" prop="email">
          <el-input 
            v-model="form.email" 
            placeholder="답변을 받으실 이메일을 입력하세요"
            type="email"
          />
        </el-form-item>

        <el-form-item label="문의 유형" prop="inquiryType">
          <el-select v-model="form.inquiryType" placeholder="문의 유형을 선택하세요">
            <el-option label="이용 문의" value="general" />
            <el-option label="오류 신고" value="bug" />
            <el-option label="서비스 제안" value="feature" />
            <el-option label="기타" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="제목" prop="title">
          <el-input 
            v-model="form.title" 
            placeholder="문의 제목을 입력하세요"
          />
        </el-form-item>

        <el-form-item label="문의 내용" prop="content">
          <el-input 
            v-model="form.content" 
            type="textarea" 
            :rows="6"
            placeholder="문의 내용을 자세히 입력해주세요"
          />
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            @click="submitInquiry"
            :loading="loading"
          >
            문의하기
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 내 문의 내역 -->
    <div class="my-inquiries" v-if="myInquiries.length > 0">
      <h3>내 문의 내역</h3>
      <div class="inquiries-list">
        <el-card 
          v-for="inquiry in myInquiries" 
          :key="inquiry.inquiryId"
          class="inquiry-card"
        >
          <div class="inquiry-header">
            <div class="inquiry-meta">
              <span class="inquiry-type" :class="getInquiryTypeClass(inquiry.inquiryType)">
                {{ getInquiryTypeText(inquiry.inquiryType) }}
              </span>
              <span class="inquiry-date">{{ formatDate(inquiry.createdAt) }}</span>
            </div>
            <span class="inquiry-status" :class="getStatusClass(inquiry.status)">
              {{ getStatusText(inquiry.status) }}
            </span>
          </div>
          
          <h4 class="inquiry-title">{{ inquiry.title }}</h4>
          <p class="inquiry-content">{{ inquiry.content }}</p>
          
          <div v-if="inquiry.adminResponse" class="admin-response">
            <h5>답변</h5>
            <p>{{ inquiry.adminResponse }}</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import api from '@/api'
import dayjs from 'dayjs'

export default {
  name: 'Inquiry',
  setup() {
    const store = useStore()
    const formRef = ref()
    const loading = ref(false)
    const myInquiries = ref([])
    
    const form = ref({
      email: '',
      inquiryType: '',
      title: '',
      content: ''
    })

    const rules = {
      email: [
        { required: true, message: '이메일을 입력해주세요', trigger: 'blur' },
        { type: 'email', message: '올바른 이메일 형식을 입력해주세요', trigger: 'blur' }
      ],
      inquiryType: [
        { required: true, message: '문의 유형을 선택해주세요', trigger: 'change' }
      ],
      title: [
        { required: true, message: '제목을 입력해주세요', trigger: 'blur' },
        { min: 2, max: 100, message: '제목은 2-100자 사이로 입력해주세요', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '문의 내용을 입력해주세요', trigger: 'blur' },
        { min: 10, max: 2000, message: '문의 내용은 10-2000자 사이로 입력해주세요', trigger: 'blur' }
      ]
    }

    const loadMyInquiries = async () => {
      try {
        const response = await api.get('/inquiries/my')
        myInquiries.value = response.data
      } catch (error) {
        console.error('문의 내역 로드 실패:', error)
      }
    }

    const submitInquiry = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        loading.value = true
        
        await api.post('/inquiries', form.value)
        
        ElMessage.success('문의가 성공적으로 등록되었습니다!')
        
        // 폼 초기화
        form.value = {
          email: '',
          inquiryType: '',
          title: '',
          content: ''
        }
        formRef.value.resetFields()
        
        // 문의 내역 새로고침
        await loadMyInquiries()
      } catch (error) {
        if (error.response?.data?.message) {
          ElMessage.error(error.response.data.message)
        } else {
          ElMessage.error('문의 등록에 실패했습니다.')
        }
      } finally {
        loading.value = false
      }
    }

    const getInquiryTypeText = (type) => {
      const types = {
        general: '이용 문의',
        bug: '오류 신고',
        feature: '서비스 제안',
        other: '기타'
      }
      return types[type] || type
    }

    const getInquiryTypeClass = (type) => {
      return `type-${type}`
    }

    const getStatusText = (status) => {
      const statuses = {
        pending: '대기중',
        in_progress: '처리중',
        completed: '답변완료'
      }
      return statuses[status] || status
    }

    const getStatusClass = (status) => {
      return `status-${status}`
    }

    const formatDate = (date) => {
      return dayjs(date).format('YYYY.MM.DD HH:mm')
    }

    onMounted(() => {
      // 사용자 이메일로 기본 설정
      const user = store.state.auth.user
      if (user?.email) {
        form.value.email = user.email
      }
      
      loadMyInquiries()
    })

    return {
      formRef,
      loading,
      form,
      rules,
      myInquiries,
      submitInquiry,
      getInquiryTypeText,
      getInquiryTypeClass,
      getStatusText,
      getStatusClass,
      formatDate
    }
  }
}
</script>

<style scoped>
.inquiry {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.header p {
  color: var(--el-text-color-regular);
}

.form-container {
  background: var(--el-bg-color);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.inquiry-form {
  max-width: 600px;
  margin: 0 auto;
}

.my-inquiries {
  margin-top: 40px;
}

.my-inquiries h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.inquiries-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.inquiry-card {
  border-radius: 8px;
}

.inquiry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.inquiry-meta {
  display: flex;
  gap: 15px;
  align-items: center;
}

.inquiry-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.type-general {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.type-bug {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.type-feature {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.type-other {
  background: var(--el-color-info-light-9);
  color: var(--el-color-info);
}

.inquiry-date {
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}

.inquiry-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-pending {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.status-in_progress {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.status-completed {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.inquiry-title {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.inquiry-content {
  margin: 0 0 15px 0;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.admin-response {
  margin-top: 15px;
  padding: 15px;
  background: var(--el-color-success-light-9);
  border-radius: 4px;
  border-left: 4px solid var(--el-color-success);
}

.admin-response h5 {
  margin: 0 0 10px 0;
  color: var(--el-color-success);
  font-weight: 500;
}

.admin-response p {
  margin: 0;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .inquiry {
    padding: 15px;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .inquiry-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
