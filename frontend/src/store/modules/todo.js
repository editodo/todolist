import api from '@/api'

const state = {
  todos: [],
  stats: {
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0
  },
  loading: false,
  error: null
}

const mutations = {
  SET_TODOS(state, todos) {
    state.todos = todos
  },
  SET_STATS(state, stats) {
    state.stats = stats
  },
  ADD_TODO(state, todo) {
    state.todos.push(todo)
  },
  UPDATE_TODO(state, updatedTodo) {
    console.log('Updating todo in store:', updatedTodo)
    const index = state.todos.findIndex(todo => todo.todoId === updatedTodo.todoId)
    console.log('Found todo at index:', index)
    if (index !== -1) {
      state.todos.splice(index, 1, updatedTodo)
      console.log('Todo updated successfully')
    } else {
      console.warn('Todo not found for update:', updatedTodo.todoId)
    }
  },
  DELETE_TODO(state, todoId) {
    state.todos = state.todos.filter(todo => todo.todoId !== todoId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchTodos({ commit }, date) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get(`/todos?date=${date}`)
      commit('SET_TODOS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchStats({ commit }) {
    try {
      const response = await api.get('/todos/stats')
      commit('SET_STATS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    }
  },

  async addTodo({ commit }, todo) {
    commit('SET_LOADING', true)
    try {
      const response = await api.post('/todos', todo)
      commit('ADD_TODO', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateTodo({ commit }, { todoId, todo }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.put(`/todos/${todoId}`, todo)
      commit('UPDATE_TODO', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteTodo({ commit }, todoId) {
    commit('SET_LOADING', true)
    try {
      await api.delete(`/todos/${todoId}`)
      commit('DELETE_TODO', todoId)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async toggleTodo({ commit }, { todoId, completed }) {
    console.log('Store toggleTodo - todoId:', todoId, 'completed:', completed)
    commit('SET_LOADING', true)
    try {
      const payload = { isCompleted: completed }
      console.log('Sending payload:', payload)
      const response = await api.patch(`/todos/${todoId}/complete`, payload)
      console.log('Toggle response:', response.data)
      
      // 응답 데이터가 올바른지 확인
      if (response.data && response.data.todoId === todoId) {
        commit('UPDATE_TODO', response.data)
        console.log('Todo updated in store successfully')
      } else {
        console.error('Invalid response data:', response.data)
        throw new Error('Invalid response from server')
      }
      
      return response.data
    } catch (error) {
      console.error('Store toggleTodo error:', error)
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const getters = {
  todos: state => state.todos,
  stats: state => state.stats,
  loading: state => state.loading,
  error: state => state.error,
  completedTodos: state => state.todos.filter(todo => todo.isCompleted),
  pendingTodos: state => state.todos.filter(todo => !todo.isCompleted)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
