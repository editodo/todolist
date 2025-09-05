<template>
  <div id="wrap" class="editodo_wrap editodo_join">
    <main id="main">
      <div class="container">
        <!-- S: editodo_inner -->
        <div class="editodo_inner">
          <div class="tab_group">
            <ul class="tab_list">
              <li class="active">
                <button 
                  type="button" 
                  class="btn_tab tab_id" 
                  @click="$router.push('/find-id')"
                >
                  아이디 찾기
                </button>
              </li>
              <li>
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
            <div class="form_wrap" v-show="!showResult">
              <form @submit.prevent="handleFindId">
                <dl class="form_dl">
                  <dt><label for="userId" class="form_label">아이디</label></dt>
                  <dd>
                    <input 
                      type="text" 
                      id="userId" 
                      class="form_input" 
                      placeholder="8-16 자리 영문, 숫자 조합"
                      v-model="findIdForm.username"
                      :class="{ 'field_chk': errors.username }"
                    >
                    <div class="field_not" v-if="errors.username">{{ errors.username }}</div>
                  </dd>
                </dl>
                <dl class="form_dl">
                  <dt><label for="userCall" class="form_label">휴대폰번호</label></dt>
                  <dd>
                    <input 
                      type="text" 
                      id="userCall" 
                      class="form_input" 
                      placeholder="휴대폰 번호 '-' 없이 입력"
                      v-model="findIdForm.phone"
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
                  @click="handleFindId"
                  :disabled="loading"
                >
                  {{ loading ? '조회 중...' : '조회하기' }}
                </button>
              </div>
            </div>

            <!-- form_wrap //조회 결과 -->
            <div class="result" v-show="showResult">
              <p>조회하신 가입 내역입니다.</p>
              <ul class="list-dot">
                <li v-for="email in foundEmails" :key="email">{{ email }}</li>
              </ul>

              <div class="bottom_btn_group">
                <button 
                  type="button" 
                  class="btn btn_main full" 
                  @click="$router.push('/login')"
                >
                  로그인
                </button>
                <button 
                  type="button" 
                  class="btn btn_sub full" 
                  @click="$router.push('/find-pw')"
                >
                  비밀번호 찾기
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
  name: 'FindId',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const showResult = ref(false)
    
    const findIdForm = reactive({
      username: '',
      phone: ''
    })
    
    const errors = reactive({
      username: '',
      phone: ''
    })
    
    // 임시 데이터 (실제로는 API 호출)
    const foundEmails = ref(['mine@email.com', 'mine@naver.com'])
    
    const validateForm = () => {
      let isValid = true
      errors.username = ''
      errors.phone = ''
      
      if (!findIdForm.username.trim()) {
        errors.username = '아이디를 입력하세요.'
        isValid = false
      }
      
      if (!findIdForm.phone.trim()) {
        errors.phone = '휴대폰 번호를 입력하세요.'
        isValid = false
      }
      
      return isValid
    }
    
    const handleFindId = async () => {
      if (!validateForm()) {
        return
      }
      
      try {
        loading.value = true
        
        // 실제로는 API 호출
        // const response = await api.findId(findIdForm)
        
        // 임시로 결과 표시
        setTimeout(() => {
          showResult.value = true
          loading.value = false
        }, 1000)
        
      } catch (error) {
        console.error('Find ID error:', error)
        showMessage('아이디 찾기에 실패했습니다.', 'error')
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
      showResult,
      findIdForm,
      errors,
      foundEmails,
      handleFindId
    }
  }
}
</script>

<style scoped>
/* FindId 페이지 특별 스타일 */
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

.result {
  text-align: center;
  padding: 20px 0;
}

.result p {
  margin-bottom: 20px;
  font-size: 16px;
  color: var(--text-color);
}

.list-dot {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
}

.list-dot li {
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--main-color);
  font-weight: 500;
}

.list-dot li:last-child {
  border-bottom: none;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .btn_tab {
    padding: 12px 15px;
    font-size: 14px;
  }
  
  .result p {
    font-size: 14px;
  }
}
</style>
