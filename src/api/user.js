import axios from '@/libs/api.request'

export const login = (data) => {
  return axios.request({
    url: `/login/loginUser`,
    method: 'post',
    data,
  })
}

export const getLoginInfo = () => {
  return axios.request({
    url: `/login/getUser`,
  })
}

export const logout = () => {
  return axios.request({
    url: `/login/logOut`,
  })
}
