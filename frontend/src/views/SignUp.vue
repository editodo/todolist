<template>
  <div class="signup-container">
    <el-card class="signup-card">
      <template #header>
        <h2>회원가입</h2>
      </template>
      
      <el-form :model="signupForm" :rules="signupRules" ref="signupFormRef" label-width="80px">
        <el-form-item label="사용자명" prop="username">
          <el-input v-model="signupForm.username" placeholder="사용자명을 입력하세요" />
        </el-form-item>
        
        <el-form-item label="이메일" prop="email">
          <el-input v-model="signupForm.email" placeholder="이메일을 입력하세요" />
        </el-form-item>
        
        <el-form-item label="비밀번호" prop="password">
          <el-input 
            v-model="signupForm.password" 
            type="password" 
            placeholder="비밀번호를 입력하세요"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="비밀번호 확인" prop="confirmPassword">
          <el-input 
            v-model="signupForm.confirmPassword" 
            type="password" 
            placeholder="비밀번호를 다시 입력하세요"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="닉네임" prop="nickname">
          <el-input v-model="signupForm.nickname" placeholder="닉네임을 입력하세요" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSignup" :loading="loading" class="signup-btn">
            회원가입
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="links">
        <router-link to="/login">이미 계정이 있으신가요? 로그인</router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'SignUp',
  setup() {
    const store = useStore()
    const router = useRouter()
    const signupFormRef = ref()
    const loading = ref(false)
    
    const signupForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      nickname: ''
    })
    
    const signupRules = {
      username: [
        { required: true, message: '사용자명을 입력해주세요', trigger: 'blur' },
        { min: 3, max: 20, message: '사용자명은 3-20자 사이여야 합니다', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '이메일을 입력해주세요', trigger: 'blur' },
        { type: 'email', message: '올바른 이메일 형식을 입력해주세요', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '비밀번호를 입력해주세요', trigger: 'blur' },
        { min: 6, message: '비밀번호는 최소 6자 이상이어야 합니다', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '비밀번호 확인을 입력해주세요', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== signupForm.password) {
              callback(new Error('비밀번호가 일치하지 않습니다'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ],
      nickname: [
        { required: true, message: '닉네임을 입력해주세요', trigger: 'blur' }
      ]
    }
    
    const handleSignup = async () => {
      try {
        await signupFormRef.value.validate()
        loading.value = true
        
        await store.dispatch('auth/signUp', signupForm)
        ElMessage.success('회원가입이 완료되었습니다!')
        router.push('/login')
      } catch (error) {
        console.error('회원가입 오류:', error)
        ElMessage.error(error.response?.data?.message || '회원가입에 실패했습니다.')
      } finally {
        loading.value = false
      }
    }
    
    return {
      signupForm,
      signupFormRef,
      signupRules,
      loading,
      handleSignup
    }
  }
}
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.signup-card {
  width: 100%;
  max-width: 400px;
}

.signup-card :deep(.el-card__header) {
  text-align: center;
  padding: 20px;
}

.signup-card h2 {
  margin: 0;
  color: #303133;
}

.signup-btn {
  width: 100%;
  height: 40px;
}

.links {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.links a {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.links a:hover {
  text-decoration: underline;
}
</style>
