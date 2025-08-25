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
/* CSS 변수 정의 */
:root {
  --main-color: #409EFF;
  --main-color-hover: #337ecc;
  --text-color: #303133;
  --sub-text-color: #606266;
  --guide-text-color: #909399;
  --border-color: #DCDFE6;
  --body-color: #FFFFFF;
  --fnb: #666666;
  --fnb-text: #666666;
  --calendar-colr: #666666;
  --checkbox-label: #666666;
  --checkbox-checked-label: #999999;
  --dominant: #f5f5f5;
  --accent: #409EFF;
  --base: #ffffff;
  --base-color: #ffffff;
  --style: 6px;
}

/* 다크모드 변수 */
.darkmode {
  --main-color: #409EFF;
  --main-color-hover: #337ecc;
  --text-color: #E5EAF3;
  --sub-text-color: #A3A6AD;
  --guide-text-color: #6C6E72;
  --border-color: #4C4D4F;
  --body-color: #1D1E1F;
  --fnb: #A3A6AD;
  --fnb-text: #A3A6AD;
  --calendar-colr: #A3A6AD;
  --checkbox-label: #A3A6AD;
  --checkbox-checked-label: #6C6E72;
  --dominant: #2C2C2C;
  --accent: #409EFF;
  --base: #1D1E1F;
  --base-color: #1D1E1F;
}

/* 기존 CSS 스타일 적용 */
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

/* Form 스타일 */
.form_wrap {
  margin-top: 20px;
}

.form_wrap .form_dl .form_label {
  display: block; 
  margin-bottom: 5px; 
  color: var(--sub-text-color); 
  font-size: 12px; 
}

.form_wrap .form_dl .form_input {
  width: 100%; 
  height: 40px; 
  padding: 0 16px;  
  box-sizing: border-box; 
  border-radius: 5px; 
  border: 1px solid var(--border-color); 
  background-color: var(--body-color); 
  font-size: 14px; 
  color: var(--text-color); 
  line-height: 38px; 
  outline: none; 
}

.form_wrap .form_dl .field_not {
  display: none;  
  margin-top: 5px; 
  font-size: 12px; 
  color: #FF3030; 
  text-align: left; 
}

.form_wrap .form_dl .form_input.field_chk {
  border-color: #FF3030;
}

.form_wrap .form_dl .form_input.field_chk + .field_not {
  display: block;
}

.form_wrap .form_dl + .form_dl {
  margin-top: 16px; 
}

/* Checkbox 스타일 */
.checkbox {
  position: relative; 
  display: block; 
  padding-left: 26px; 
  cursor: pointer;  
  -webkit-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
  user-select: none; 
}

.checkbox label {
  font-size: 13px; 
  color: var(--calendar-colr); 
  font-weight: 500; 
}

.checkbox input[type="checkbox"] {
  display: none; 
} 

.checkbox .on {
  position: absolute; 
  top: 2px; 
  left: 0; 
  width: 18px; 
  height: 18px; 
  box-sizing: border-box; 
  border: 1px solid var(--fnb); 
  border-radius: 100%; 
  background: #fff;  
}

.checkbox .on:after {
  content: ''; 
  position: absolute; 
  top: 4px; 
  left: 3px; 
  width: 8px; 
  height: 4px; 
  border: 1px solid var(--fnb); 
  border-top: 0; 
  border-right: 0; 
  transform: rotate(-45deg);
}

.checkbox input[type="checkbox"]:checked + .on {
  border-color: var(--main-color); 
  background: var(--main-color); 
}

.checkbox input[type="checkbox"]:checked + .on:after {
  border-color: #fff; 
}

/* Button 스타일 */
.bottom_btn_group {
  margin-top: 20px;
}

.bottom_btn_group .btn {
  display: block; 
  height: 50px; 
  box-sizing: border-box; 
  border: 1px solid var(--main-color); 
  border-radius: 6px; 
  font-size: 16px; 
  text-align: center; 
  font-weight: 400; 
  line-height: 48px; 
  letter-spacing: -0.33px; 
  cursor: pointer;
  transition: all 0.3s ease;
}

.bottom_btn_group .btn + .btn {
  margin-top: 10px; 
}

.bottom_btn_group .btn_main {
  background-color: var(--main-color); 
  color: #fff;
}

.bottom_btn_group .btn_main:hover {
  background-color: var(--main-color-hover);
}

.bottom_btn_group .btn_sub {
  background-color: var(--body-color); 
  color: var(--main-color); 
}

.bottom_btn_group .btn_sub:hover {
  background-color: var(--main-color);
  color: #fff;
}

.bottom_btn_group .btn:disabled {
  opacity: 0.6; 
  cursor: not-allowed; 
}

.bottom_btn_group .btn.full {
  width: 100%; 
}

/* Utility 클래스 */
.visuallyhidden {
  position: absolute; 
  width: 1px; 
  height: 1px; 
  margin: -1px; 
  padding: 0; 
  border: 0; 
  white-space: nowrap; 
  clip-path: inset(100%); 
  clip: rect(0,0,0,0); 
  overflow: hidden; 
}

/* Container 스타일 */
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.editodo_inner {
  padding: 20px;
}

.side_pd {
  padding-left: 20px;
  padding-right: 20px;
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

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .editodo_inner {
    padding: 10px;
  }
  
  .side_pd {
    padding-left: 10px;
    padding-right: 10px;
  }
}

/* 전역 스타일 */
.editodo_wrap {
  min-height: 100vh;
  background-color: var(--body-color);
  color: var(--text-color);
  font-family: 'Noto Sans KR', sans-serif;
  transition: all 0.3s ease;
}

#main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
