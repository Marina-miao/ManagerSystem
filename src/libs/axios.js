import axios from 'axios'
import store from '@/store'
import { Spin, Message } from 'iview'
import router from '@/router'

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  
  getInsideConfig() {
    return {
      baseURL: this.baseUrl,
      headers: {},
    }
  }
  
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      
      if (config.url.charAt(0) !== '/') config.url = `${ /login/i.test(config.url) ? window.APP_CONFIG.loginPath : window.APP_CONFIG.appPath }/${ config.url }`
      if (window.APP_CONFIG.appID) config.headers['appID'] = window.APP_CONFIG.appId
      if (store.state.user.token) config.headers['Token'] = store.state.user.token
      
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(({ data: { sysCode, msg, data } }) => {
      this.destroy(url)
      
      if (/logOut/i.test(url)) {
        store.dispatch('clearLoginInfo')
        return router.replace('login')
      }
      
      switch (sysCode) {
        case 1000:
          return data !== null ? data : { data: [], sysCode }
        case 1001:
          Message.warning('登录信息失效，请重新登录')
          store.dispatch('handleLogOut')
          return Promise.reject('notLogin')
        case 1002:
          Message.warning('用户名不存在')
          return Promise.reject({ sysCode, msg })
        case 1003:
          Message.warning('密码不正确')
          return Promise.reject({ sysCode, msg })
        case 4000:
        case 500:
          Message.warning('数据请求错误，请稍后重试')
          return Promise.reject({ sysCode, msg })
        default:
          Message.warning(msg)
          return Promise.reject({ sysCode, msg })
      }
    }, error => {
      this.destroy(url)
      return Promise.reject(error)
    })
  }
  
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
