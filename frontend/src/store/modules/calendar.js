import api from '@/api'

const state = {
  events: [],
  loading: false,
  error: null
}

const mutations = {
  SET_EVENTS(state, events) {
    state.events = events
  },
  ADD_EVENT(state, event) {
    state.events.push(event)
  },
  UPDATE_EVENT(state, updatedEvent) {
    const index = state.events.findIndex(event => event.eventId === updatedEvent.eventId)
    if (index !== -1) {
      state.events.splice(index, 1, updatedEvent)
    }
  },
  REMOVE_EVENT(state, eventId) {
    state.events = state.events.filter(event => event.eventId !== eventId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchEvents({ commit }, { date, startDate, endDate } = {}) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const response = await api.get(`/calendar/events?${params.toString()}`)
      commit('SET_EVENTS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || '이벤트를 불러오는데 실패했습니다.')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createEvent({ commit }, eventData) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await api.post('/calendar/events', eventData)
      commit('ADD_EVENT', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || '이벤트 생성에 실패했습니다.')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateEvent({ commit }, { eventId, eventData }) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      const response = await api.put(`/calendar/events/${eventId}`, eventData)
      commit('UPDATE_EVENT', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || '이벤트 수정에 실패했습니다.')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteEvent({ commit }, eventId) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      
      await api.delete(`/calendar/events/${eventId}`)
      commit('REMOVE_EVENT', eventId)
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || '이벤트 삭제에 실패했습니다.')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  eventsByDate: (state) => (date) => {
    return state.events.filter(event => event.eventDate === date)
  },
  hasEventsOnDate: (state) => (date) => {
    return state.events.some(event => event.eventDate === date)
  },
  eventsInRange: (state) => (startDate, endDate) => {
    return state.events.filter(event => {
      const eventDate = new Date(event.eventDate)
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
