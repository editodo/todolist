import { createStore } from 'vuex'
import auth from './modules/auth'
import todo from './modules/todo'
import notice from './modules/notice'

export default createStore({
  modules: {
    auth,
    todo,
    notice
  }
})
