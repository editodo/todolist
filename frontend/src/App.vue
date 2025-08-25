<template>
  <div id="app" :class="appTheme">
    <div class="app-content">
      <router-view />
    </div>
    <BottomNavigation v-if="showBottomNavigation" />
    <InstallPrompt />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import BottomNavigation from '@/components/BottomNavigation.vue'
import InstallPrompt from '@/components/InstallPrompt.vue'

export default {
  name: 'App',
  components: {
    BottomNavigation,
    InstallPrompt
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    
    const appTheme = computed(() => {
      const user = store.state.auth.user
      if (!user) return 'lightmode style_simple palette_simple'
      
      return `${user.modePreference || 'lightmode'} ${user.themePreference || 'style_simple'} ${user.colorPreference || 'palette_simple'}`
    })
    
    // 하단 네비게이션을 표시할 페이지들
    const showBottomNavigation = computed(() => {
      const authPages = ['/login', '/signup']
      const isAuthPage = authPages.includes(route.path)
      const isAuthenticated = store.getters['auth/isAuthenticated']
      
      return isAuthenticated && !isAuthPage
    })
    
    // 페이지 로드 시 인증 상태 복원
    onMounted(async () => {
      const token = store.state.auth.token
      if (token && !store.state.auth.user) {
        try {
          await store.dispatch('auth/getCurrentUser')
        } catch (error) {
          console.error('Failed to restore authentication state:', error)
          // 토큰이 유효하지 않으면 로그아웃
          store.dispatch('auth/logout')
        }
      }
    })
    
    return {
      appTheme,
      showBottomNavigation
    }
  }
}
</script>

<style>
#app {
  font-family: 'Noto Sans KR', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
  padding-bottom: 80px; /* 하단 네비게이션 높이만큼 패딩 */
}

/* 테마별 스타일 */
.lightmode {
  background-color: #ffffff;
  color: #333333;
}

.darkmode {
  background-color: #1a1a1a;
  color: #ffffff;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .app-content {
    padding: 10px;
    padding-bottom: 80px;
  }
}

/* 하이브리드 앱 스타일 */
@media (display-mode: standalone) {
  .app-content {
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }
}

/* iOS Safari 대응 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .app-content {
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }
}
</style>
