import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/todos',
    name: 'TodoList',
    component: () => import('../views/TodoList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/diary',
    name: 'Diary',
    component: () => import('../views/Diary.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: () => import('../views/MyPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/font-modify',
    name: 'FontModify',
    component: () => import('../views/FontModify.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inquiry',
    name: 'Inquiry',
    component: () => import('../views/Inquiry.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/notices',
    name: 'NoticeList',
    component: () => import('../views/NoticeList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notices/:id',
    name: 'NoticeDetail',
    component: () => import('../views/NoticeDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notices/write',
    name: 'NoticeWrite',
    component: () => import('../views/NoticeWrite.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notices/edit/:id',
    name: 'NoticeEdit',
    component: () => import('../views/NoticeEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/find-id',
    name: 'FindId',
    component: () => import('../views/FindId.vue')
  },
  {
    path: '/find-pw',
    name: 'FindPw',
    component: () => import('../views/FindPw.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  console.log('Router guard - navigating to:', to.path)
  
  const token = store.state.auth.token
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const user = store.state.auth.user
  
  console.log('Router guard - token:', !!token, 'isAuthenticated:', isAuthenticated, 'user:', !!user)
  
  // 토큰이 있지만 사용자 정보가 없는 경우 사용자 정보 가져오기
  if (token && !user) {
    console.log('Router guard - fetching user info...')
    try {
      await store.dispatch('auth/getCurrentUser')
      console.log('Router guard - user info fetched successfully')
    } catch (error) {
      console.error('Failed to get current user:', error)
      store.dispatch('auth/logout')
      next('/login')
      return
    }
  }
  
  // 업데이트된 인증 상태 확인
  const updatedIsAuthenticated = store.getters['auth/isAuthenticated']
  const updatedUser = store.state.auth.user
  
  console.log('Router guard - updated isAuthenticated:', updatedIsAuthenticated, 'updatedUser:', !!updatedUser)
  
  if (to.meta.requiresAuth && !updatedIsAuthenticated) {
    console.log('Router guard - redirecting to login (requiresAuth)')
    next('/login')
  } else if (to.meta.requiresAdmin && (!updatedUser || !updatedUser.isAdmin)) {
    console.log('Router guard - redirecting to todos (requiresAdmin)')
    next('/todos')
  } else {
    console.log('Router guard - proceeding to:', to.path)
    next()
  }
})

export default router
