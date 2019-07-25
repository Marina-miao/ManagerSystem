import {
  getLoginInfo,
  logout,
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import router from '@/router'

export default {
  state: {
    token: getToken(),
    info: null,
    hasGetInfo: false,
    access: [],
  },
  mutations: {
    setInfo(state, info) {
      state.info = info
      state.hasGetInfo = !!info
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
  },
  actions: {
    getLoginInfo({ state, commit, dispatch }) {
      return new Promise((resolve, reject) => {
        getLoginInfo().then(res => {
          dispatch('lookup/getLookupData')
          commit('setAccess', [])
          commit('setInfo', res)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    handleLogOut({ dispatch }) {
      logout().then(_ => {
        dispatch('clearLoginInfo')
        router.replace('login')
      })
    },
    clearLoginInfo({ commit }) {
      commit('setToken', '')
      commit('setAccess', [])
      commit('setInfo', null)
    },
  },
}
