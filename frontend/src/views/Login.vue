<template>
  <div id="wrap" class="editodo_wrap editodo_login">
    <main id="main">
      <div class="container">
        <div class="editodo_inner side_pd">
          <div class="form_wrap">
            <form @submit.prevent="handleLogin">
              <dl class="form_dl">
                <dt><label for="user_Id" class="visuallyhidden">아이디</label></dt>
                <dd>
                  <input 
                    type="text" 
                    id="user_Id" 
                    class="form_input" 
                    placeholder="아이디"
                    v-model="loginForm.username"
                    :class="{ 'field_chk': errors.username }"
                  >
                  <div class="field_not" v-if="errors.username">{{ errors.username }}</div>
                </dd>
              </dl>
              <dl class="form_dl">
                <dt><label for="user_Pw" class="visuallyhidden">비밀번호</label></dt>
                <dd>
                  <input 
                    type="password" 
                    id="user_Pw" 
                    class="form_input" 
                    placeholder="비밀번호"
                    v-model="loginForm.password"
                    :class="{ 'field_chk': errors.password }"
                  >
                  <div class="field_not" v-if="errors.password">{{ errors.password }}</div>
                </dd>
              </dl>

              <div class="login_util">
                <div class="save_id checkbox">
                  <label for="saveID">
                    <input type="checkbox" id="saveID" v-model="saveId">
                    <span class="on"></span>
                    아이디 저장 
                  </label>
                </div>
                <a href="#" class="find_idpw" @click="goToFindIdPw">아이디/비밀번호 찾기</a>
              </div>
            </form>
          </div>

          <div class="bottom_btn_group">
            <button 
              type="button" 
              class="btn btn_main full"
              @click="handleLogin"
              :disabled="loading"
            >
              {{ loading ? '로그인 중...' : '로그인' }}
            </button>
            <button 
              type="button" 
              class="btn btn_sub full" 
              @click="$router.push('/signup')"
            >
              회원가입
            </button>
          </div>
          <div class="sns_group" style="display: none;">
            sns 추가
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    const saveId = ref(false)
    
    const loginForm = reactive({
      username: '',
      password: ''
    })
    
    const errors = reactive({
      username: '',
      password: ''
    })
    
    // 저장된 아이디 불러오기
    onMounted(() => {
      const savedUsername = localStorage.getItem('savedUsername')
      if (savedUsername) {
        loginForm.username = savedUsername
        saveId.value = true
      }
      
      // 테마 적용
      applyTheme()
    })
    
    const applyTheme = () => {
      const editodoWrap = document.querySelector('.editodo_wrap')
      if (editodoWrap) {
        const theme = sessionStorage.getItem('theme') || 'style_simple'
        const color = sessionStorage.getItem('color') || 'palette_simple'
        const mode = sessionStorage.getItem('mode') || 'lightmode'
        
        editodoWrap.className = `editodo_wrap editodo_login ${mode} ${theme} ${color}`
      }
    }
    
    const validateForm = () => {
      let isValid = true
      errors.username = ''
      errors.password = ''
      
      if (!loginForm.username.trim()) {
        errors.username = '아이디를 입력해주세요.'
        isValid = false
      }
      
      if (!loginForm.password.trim()) {
        errors.password = '비밀번호를 입력해주세요.'
        isValid = false
      }
      
      return isValid
    }
    
    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }
      
      try {
        loading.value = true
        
        // 아이디 저장 처리
        if (saveId.value) {
          localStorage.setItem('savedUsername', loginForm.username)
        } else {
          localStorage.removeItem('savedUsername')
        }
        
        // 로그인 처리
        await store.dispatch('auth/login', {
          username: loginForm.username,
          password: loginForm.password
        })
        
        // 성공 메시지 (간단한 알림)
        showMessage('로그인되었습니다!', 'success')
        router.push('/todos')
        
      } catch (error) {
        console.error('Login error:', error)
        showMessage('아이디 또는 비밀번호가 올바르지 않습니다.', 'error')
      } finally {
        loading.value = false
      }
    }
    
    const showMessage = (message, type) => {
      // 간단한 메시지 표시 (Element Plus 대신 커스텀)
      const messageDiv = document.createElement('div')
      messageDiv.className = `message ${type}`
      messageDiv.textContent = message
      messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-size: 14px;
        z-index: 9999;
        ${type === 'success' ? 'background-color: #67c23a;' : 'background-color: #f56c6c;'}
      `
      
      document.body.appendChild(messageDiv)
      
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv)
        }
      }, 3000)
    }
    
    const goToFindIdPw = () => {
      // 아이디/비밀번호 찾기 페이지로 이동
      router.push('/find-id')
    }
    
    return {
      loginForm,
      errors,
      loading,
      saveId,
      handleLogin,
      goToFindIdPw
    }
  }
}
</script>

<style scoped>
/* 로그인 페이지 특별 스타일만 유지 */
.editodo_login .form_wrap {
  margin-top: 0; 
  padding-top: 40px; 
}

.editodo_login .form_dl:first-child .form_input {
  border-bottom-left-radius: 0; 
  border-bottom-right-radius: 0; 
}

.editodo_login .form_dl:last-of-type .form_input {
  border-top-left-radius: 0; 
  border-top-right-radius: 0; 
}

.editodo_login .form_dl + .form_dl {
  margin-top: -1px; 
}

.editodo_login .login_util {
  position: relative; 
  margin-top: 16px; 
}

.editodo_login .login_util .find_idpw {
  position: absolute; 
  top: 3px; 
  right: 0; 
  font-size: 12px; 
  color: var(--guide-text-color); 
  text-align: right; 
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
}

.editodo_login .login_util .find_idpw:hover {
  text-decoration: underline;
}

/* 메시지 애니메이션 */
.message {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
