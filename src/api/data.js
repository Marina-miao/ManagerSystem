import axios from '@/libs/api.request'

/**
 * 业务接口
 */

// 基础管理
export const selectDictsByCodes = () => {
  return axios.request({
    url: `/dics/selectAll`
  })
}
// 教师管理
export const selectTeachersByCondition = (data) => {
  return axios.request({
    url: `/tmpTeacher/selectTmpTeacherByCondition`,
    method: 'post',
    data
  })
}

export const addOrUpdateTeacher = (data) => {
  return axios.request({
    url: `/tmpTeacher/saveTeacher`,
    method: 'post',
    data
  })
}

export const getTeacherDetailById = (id) => {
  return axios.request({
    url: `/tmpTeacher/detailst?id=${id}`,
    method: 'get'
  })
}

export const checkRepeatTel = (tel) => {
  console.log(tel)
  return axios.request({
    url: `/tmpTeacher/repeatTel?tel=${tel}`,
    method: 'get'
  })
}

export const startUseTeacher = (id) => {
  return axios.request({
    url: `/tmpTeacher/startTeacherById?id=${id}`,
    method: 'get'
  })
}

export const stopUseTeacher = (id) => {
  return axios.request({
    url: `/tmpTeacher/stopTeacherById?id=${id}`,
    method: 'get'
  })
}

// 课程管理
// export const
