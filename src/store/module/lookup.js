import {} from '@/api/data'

export default {
  namespaced: true,
  state: {},
  mutations: {
    setData(state, { key, data }) {
      state[key] = data
    },
  },
  actions: {
    getLookupData({ commit, state }) {},
  },
}
