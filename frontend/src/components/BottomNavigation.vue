<template>
  <nav class="bottom-navigation" :class="{ 'standalone': isStandalone }">
    <ul class="fnb_list">
      <li v-for="item in menuItems" :key="item.path">
        <button 
          type="button" 
          @click="navigateTo(item.path)" 
          class="btn_fnb"
          :class="{ active: isActive(item.path) }"
          :disabled="loading"
        >
          <i :class="['fnb_icon', item.icon]"></i>
          <span class="fnb_tit">{{ item.title }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'BottomNavigation',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const loading = ref(false)

    const menuItems = [
      {
        path: '/todos',
        title: '투두리스트',
        icon: 'fnb_todolist'
      },
      {
        path: '/calendar',
        title: '캘린더',
        icon: 'fnb_calendar'
      },
      {
        path: '/notices',
        title: '공지사항',
        icon: 'fnb_notice'
      },
      {
        path: '/diary',
        title: '하루일기',
        icon: 'fnb_daily'
      },
      {
        path: '/mypage',
        title: '마이페이지',
        icon: 'fnb_mypage'
      }
    ]

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const isStandalone = computed(() => window.matchMedia('(display-mode: standalone)').matches)

    const navigateTo = async (path) => {
      if (!isAuthenticated.value) {
        router.push('/login')
        return
      }
      
      if (route.path === path) {
        return // 이미 해당 페이지에 있으면 이동하지 않음
      }
      
      loading.value = true
      try {
        await router.push(path)
      } catch (error) {
        console.error('Navigation error:', error)
      } finally {
        loading.value = false
      }
    }

    const isActive = (path) => {
      return route.path === path
    }

    return {
      menuItems,
      navigateTo,
      isActive,
      isAuthenticated,
      isStandalone,
      loading
    }
  }
}
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-lighter);
  z-index: 1000;
  padding: 8px 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.bottom-navigation.standalone {
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
}

.fnb_list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: space-around;
  align-items: center;
}

.fnb_list li {
  flex: 1;
  text-align: center;
}

.btn_fnb {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--el-text-color-regular);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn_fnb:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: var(--el-color-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
  opacity: 0.1;
}

.btn_fnb:hover:before {
  width: 40px;
  height: 40px;
}

.btn_fnb:hover {
  color: var(--el-color-primary);
  transform: translateY(-2px);
}

.btn_fnb.active {
  color: var(--el-color-primary);
}

.btn_fnb.active .fnb_icon {
  transform: scale(1.1);
}

.btn_fnb:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.fnb_icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: var(--icon-filter, none);
}

.fnb_todolist {
  background-image: url('@/assets/images/common/fnb_todolist.svg');
}

.fnb_calendar {
  background-image: url('@/assets/images/common/fnb_calendar.svg');
}

.fnb_daily {
  background-image: url('@/assets/images/common/fnb_daily.svg');
}

.fnb_mypage {
  background-image: url('@/assets/images/common/fnb_mypage.svg');
}

.fnb_tit {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
  transition: color 0.3s ease;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .bottom-navigation {
    padding: 6px 0;
  }
  
  .btn_fnb {
    padding: 6px 2px;
  }
  
  .fnb_icon {
    width: 20px;
    height: 20px;
  }
  
  .fnb_tit {
    font-size: 11px;
  }
}

/* 다크모드 대응 */
.darkmode .bottom-navigation {
  background: var(--el-bg-color);
  border-top-color: var(--el-border-color);
  --icon-filter: invert(1);
}

/* 하이브리드 앱 스타일 */
@media (display-mode: standalone) {
  .bottom-navigation {
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
  }
}

/* iOS Safari 대응 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .bottom-navigation {
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
  }
}

/* 터치 디바이스 최적화 */
@media (hover: none) and (pointer: coarse) {
  .btn_fnb:hover {
    transform: none;
  }
  
  .btn_fnb:active {
    transform: scale(0.95);
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .btn_fnb,
  .fnb_icon {
    transition: none;
  }
}

/* 고대비 모드 */
@media (prefers-contrast: high) {
  .bottom-navigation {
    border-top-width: 2px;
  }
  
  .btn_fnb.active {
    font-weight: bold;
  }
}
</style>
