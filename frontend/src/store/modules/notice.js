import api from '@/api'

const state = {
  notices: [],
  currentNotice: null,
  loading: false,
  error: null
}

const mutations = {
  SET_NOTICES(state, notices) {
    state.notices = notices
  },
  SET_CURRENT_NOTICE(state, notice) {
    state.currentNotice = notice
  },
  ADD_NOTICE(state, notice) {
    state.notices.unshift(notice)
  },
  UPDATE_NOTICE(state, updatedNotice) {
    const index = state.notices.findIndex(notice => notice.noticeId === updatedNotice.noticeId)
    if (index !== -1) {
      state.notices.splice(index, 1, updatedNotice)
    }
  },
  DELETE_NOTICE(state, noticeId) {
    state.notices = state.notices.filter(notice => notice.noticeId !== noticeId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchNotices({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/notices')
      commit('SET_NOTICES', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchNoticeDetail({ commit }, noticeId) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get(`/notices/${noticeId}`)
      commit('SET_CURRENT_NOTICE', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createNotice({ commit }, noticeData) {
    commit('SET_LOADING', true)
    try {
      const response = await api.post('/notices', noticeData)
      commit('ADD_NOTICE', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateNotice({ commit }, { noticeId, noticeData }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.put(`/notices/${noticeId}`, noticeData)
      commit('UPDATE_NOTICE', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteNotice({ commit }, noticeId) {
    commit('SET_LOADING', true)
    try {
      await api.delete(`/notices/${noticeId}`)
      commit('DELETE_NOTICE', noticeId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async uploadFile({ commit }, file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  }
}

const getters = {
  notices: state => state.notices,
  currentNotice: state => state.currentNotice,
  loading: state => state.loading,
  error: state => state.error,
  noticeNotices: state => state.notices.filter(notice => notice.isNotice),
  regularNotices: state => state.notices.filter(notice => !notice.isNotice)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
