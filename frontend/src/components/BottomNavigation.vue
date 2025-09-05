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
/* BottomNavigation 컴포넌트 특별 스타일만 유지 */
.fnb_notice {
  background-image: url('@/assets/images/common/fnb_notice.svg');
}
</style>
