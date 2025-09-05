<template>
  <div id="wrap" class="editodo_wrap editodo_join">
    <main id="main">
      <div class="container">
        <!-- S: editodo_inner -->
        <div class="editodo_inner">
          <div class="tab_group">
            <ul class="tab_list">
              <li>
                <button 
                  type="button" 
                  class="btn_tab tab_id" 
                  @click="$router.push('/find-id')"
                >
                  아이디 찾기
                </button>
              </li>
              <li class="active">
                <button 
                  type="button" 
                  class="btn_tab tab_pw" 
                  @click="$router.push('/find-pw')"
                >
                  비밀번호 찾기
                </button>
              </li>
            </ul>
          </div>

          <div class="side_pd">
            <!-- form_wrap -->
            <div class="form_wrap" v-show="!showPasswordChange">
              <form @submit.prevent="handleFindPw">
                <dl class="form_dl">
                  <dt><label for="userId" class="form_label">아이디</label></dt>
                  <dd>
                    <input 
                      type="text" 
                      id="userId" 
                      class="form_input" 
                      placeholder="8-16 자리 영문, 숫자 조합"
                      v-model="findPwForm.username"
                      :class="{ 'field_chk': errors.username }"
                    >
                    <div class="field_not" v-if="errors.username">{{ errors.username }}</div>
                  </dd>
                </dl>
                <dl class="form_dl">
                  <dt><label for="userEmail" class="form_label">이메일</label></dt>
                  <dd>
                    <input 
                      type="email" 
                      id="userEmail" 
                      class="form_input" 
                      placeholder="email@email.com"
                      v-model="findPwForm.email"
                      :class="{ 'field_chk': errors.email }"
                    >
                    <div class="field_not" v-if="errors.email">{{ errors.email }}</div>
                  </dd>
                </dl>
                <dl class="form_dl"> 
                  <dt><label for="userCall" class="form_label">휴대폰번호</label></dt>
                  <dd>
                    <input 
                      type="text" 
                      id="userCall" 
                      class="form_input" 
                      placeholder="휴대폰 번호 '-'없이 입력"
                      v-model="findPwForm.phone"
                      :class="{ 'field_chk': errors.phone }"
                    >
                    <div class="field_not" v-if="errors.phone">{{ errors.phone }}</div>
                  </dd>
                </dl>
              </form>
              <div class="bottom_btn_group">
                <button 
                  type="button" 
                  class="btn btn_main full"
                  @click="handleFindPw"
                  :disabled="loading"
                >
                  {{ loading ? '조회 중...' : '비밀번호 수정' }}
                </button>
              </div>
            </div>

            <!-- form_wrap //비밀번호 변경 -->
            <div class="form_wrap result pw" v-show="showPasswordChange">
              <form @submit.prevent="handlePasswordChange">
                <dl class="form_dl">
                  <dt><label for="userPw_change" class="form_label">비밀번호 수정</label></dt>
                  <dd>
                    <input 
                      type="password" 
                      id="userPw_change" 
                      class="form_input"
                      v-model="passwordForm.newPassword"
                      :class="{ 'field_chk': errors.newPassword }"
                      :readonly="passwordChanged"
                    >
                    <div class="field_not" v-if="errors.newPassword">{{ errors.newPassword }}</div>
                  </dd>
                </dl>
                <dl class="form_dl"> 
                  <dt><label for="userPw_change_chk" class="form_label">비밀번호 확인</label></dt>
                  <dd>
                    <input 
                      type="password" 
                      id="userPw_change_chk" 
                      class="form_input"
                      v-model="passwordForm.confirmPassword"
                      :class="{ 'field_chk': errors.confirmPassword }"
                      :readonly="passwordChanged"
                    >
                    <div class="field_not" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
                  </dd>
                </dl>
              </form>

              <div class="bottom_btn_group">
                <button 
                  type="button" 
                  class="btn btn_main full"
                  @click="handlePasswordChange"
                  :disabled="loading || passwordChanged"
                  v-show="!passwordChanged"
                >
                  {{ loading ? '수정 중...' : '비밀번호 수정' }}
                </button>
                <button 
                  type="button" 
                  class="btn btn_main full" 
                  @click="$router.push('/login')"
                  v-show="passwordChanged"
                >
                  로그인
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- E: editodo_inner -->
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'FindPw',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const showPasswordChange = ref(false)
    const passwordChanged = ref(false)
    
    const findPwForm = reactive({
      username: '',
      email: '',
      phone: ''
    })
    
    const passwordForm = reactive({
      newPassword: '',
      confirmPassword: ''
    })
    
    const errors = reactive({
      username: '',
      email: '',
      phone: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const validateFindPwForm = () => {
      let isValid = true
      errors.username = ''
      errors.email = ''
      errors.phone = ''
      
      if (!findPwForm.username.trim()) {
        errors.username = '아이디를 입력하세요.'
        isValid = false
      }
      
      if (!findPwForm.email.trim()) {
        errors.email = '이메일을 입력하세요.'
        isValid = false
      } else if (!isValidEmail(findPwForm.email)) {
        errors.email = '올바른 이메일 형식을 입력하세요.'
        isValid = false
      }
      
      if (!findPwForm.phone.trim()) {
        errors.phone = '휴대폰 번호를 입력하세요.'
        isValid = false
      }
      
      return isValid
    }
    
    const validatePasswordForm = () => {
      let isValid = true
      errors.newPassword = ''
      errors.confirmPassword = ''
      
      if (!passwordForm.newPassword.trim()) {
        errors.newPassword = '비밀번호를 입력하세요.'
        isValid = false
      } else if (passwordForm.newPassword.length < 8) {
        errors.newPassword = '비밀번호는 8자 이상 입력하세요.'
        isValid = false
      }
      
      if (!passwordForm.confirmPassword.trim()) {
        errors.confirmPassword = '비밀번호 확인을 입력하세요.'
        isValid = false
      } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
        isValid = false
      }
      
      return isValid
    }
    
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
    
    const handleFindPw = async () => {
      if (!validateFindPwForm()) {
        return
      }
      
      try {
        loading.value = true
        
        // 실제로는 API 호출
        // const response = await api.findPw(findPwForm)
        
        // 임시로 비밀번호 변경 폼 표시
        setTimeout(() => {
          showPasswordChange.value = true
          loading.value = false
        }, 1000)
        
      } catch (error) {
        console.error('Find PW error:', error)
        showMessage('비밀번호 찾기에 실패했습니다.', 'error')
        loading.value = false
      }
    }
    
    const handlePasswordChange = async () => {
      if (!validatePasswordForm()) {
        return
      }
      
      try {
        loading.value = true
        
        // 실제로는 API 호출
        // const response = await api.changePassword(passwordForm)
        
        // 임시로 성공 처리
        setTimeout(() => {
          passwordChanged.value = true
          loading.value = false
          showMessage('비밀번호가 성공적으로 변경되었습니다.', 'success')
        }, 1000)
        
      } catch (error) {
        console.error('Password change error:', error)
        showMessage('비밀번호 변경에 실패했습니다.', 'error')
        loading.value = false
      }
    }
    
    const showMessage = (message, type) => {
      // 간단한 메시지 표시
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
    
    return {
      loading,
      showPasswordChange,
      passwordChanged,
      findPwForm,
      passwordForm,
      errors,
      handleFindPw,
      handlePasswordChange
    }
  }
}
</script>

<style scoped>
/* FindPw 페이지 특별 스타일 */
.tab_group {
  margin-bottom: 20px;
}

.tab_list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--border-color);
}

.tab_list li {
  flex: 1;
}

.btn_tab {
  width: 100%;
  padding: 15px 20px;
  border: none;
  background: transparent;
  color: var(--sub-text-color);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}

.btn_tab:hover {
  color: var(--main-color);
}

.btn_tab.active,
.tab_list li.active .btn_tab {
  color: var(--main-color);
  border-bottom-color: var(--main-color);
}

.result.pw {
  padding: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .btn_tab {
    padding: 12px 15px;
    font-size: 14px;
  }
}
</style>
