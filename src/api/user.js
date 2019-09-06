import { axiosLogin } from '@/libs/api.request'

export const login = (data) => {
  return axiosLogin.request({
    url: `login/loginUser`,
    method: 'post',
    data
  })
}

export const getLoginInfo = () => {
  return axiosLogin.request({
    url: `login/getUser`
  })
}

export const changePassword = (data) => {
  return axiosLogin.request({
    url: `login/changePassword`,
    method: 'post',
    data
  })
}

export const logout = () => {
  return axiosLogin.request({
    url: `login/logOut`
  })
}
