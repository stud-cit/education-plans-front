import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import plans from "./modules/plans";

export default new Vuex.Store({
  state: {
    errors: {}
  },
  getters: {
    errors: state => state.errors
  },
  mutations: {
    setErrors(state, errors) {
      state.errors = errors;
    }
  },
  actions: {
  },
  modules: {
      plans
  }
})
