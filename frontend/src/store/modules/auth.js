import api from '@/api'

const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token') // 토큰이 있으면 인증된 상태로 초기화
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = !!user
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },
  LOGOUT(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    localStorage.removeItem('token')
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      const { accessToken, userInfo } = response.data
      
      commit('SET_TOKEN', accessToken)
      commit('SET_USER', userInfo)
      
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  async signUp({ commit }, userData) {
    try {
      const response = await api.post('/auth/signup', userData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  async demoLogin({ commit }) {
    try {
      const response = await api.post('/auth/demo-login')
      const { accessToken, userInfo } = response.data
      
      commit('SET_TOKEN', accessToken)
      commit('SET_USER', userInfo)
      
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  async getCurrentUser({ commit }) {
    try {
      console.log('Auth store - getting current user...')
      const response = await api.get('/auth/me')
      console.log('Auth store - current user response:', response.data)
      commit('SET_USER', response.data)
      return response.data
    } catch (error) {
      console.error('Auth store - getCurrentUser error:', error)
      commit('LOGOUT')
      throw error
    }
  },
  
  logout({ commit }) {
    commit('LOGOUT')
  },
  
  async updateUser({ commit }, userData) {
    try {
      const response = await api.put('/users/profile', userData)
      commit('SET_USER', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  currentUser: state => state.user,
  token: state => state.token
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
