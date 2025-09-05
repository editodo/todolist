<template>
  <div class="home">
    <div class="onboarding">
      <div class="pic">
        <el-icon size="120" color="#409EFF">
          <Check />
        </el-icon>
      </div>
      <h1 class="tit">반가워요!</h1>
      <p class="txt">
        쉽게<strong>1분</strong>만 투자해서,<br>
        <strong>취향 저격</strong>인 <span class="font_main">나만의 EdiTodo</span>제작!
      </p>

      <div class="bottom_btn_group">
        <el-button 
          type="primary" 
          size="large" 
          class="btn btn_main full"
          @click="demoLogin"
        >
          취향저격 투두리스트 체험판
        </el-button>
        <el-button 
          type="default" 
          size="large" 
          class="btn btn_sub full"
          @click="$router.push('/login')"
        >
          로그인/회원가입
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

export default {
  name: 'Home',
  components: {
    Check
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const demoLogin = async () => {
      try {
        await store.dispatch('auth/demoLogin')
        ElMessage.success('체험판으로 로그인되었습니다!')
        router.push('/todos')
      } catch (error) {
        ElMessage.error('체험판 로그인에 실패했습니다.')
      }
    }
    
    return {
      demoLogin
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.onboarding {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.pic {
  margin-bottom: 30px;
}

.pic img {
  width: 120px;
  height: 120px;
}

.tit {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.txt {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 40px;
  color: var(--el-text-color-regular);
}

@media (max-width: 768px) {
  .home {
    padding: 15px;
  }
  
  .tit {
    font-size: 1.5rem;
  }
  
  .txt {
    font-size: 1rem;
  }
}
</style>
