import { axios } from '@/libs/api.request'
// 查询所有课程
export const getCourses = (data) => {
  return axios.request({
    url: `/courses`,
    params: data
  })
}
// 编辑查询当前课程
export const _getCourseDetail = (courseId) => {
  return axios.request({
    url: `/courses/${courseId}`
  })
}

// 获取所有学段
export const _getPeriodList = () => {
  return axios.request({
    url: `/study-stages`
  })
}

// 删除当前学段
export const _deletePeriod = (data) => {
  return axios.request({
    url: `/study-stages`,
    method: 'delete',
    params: data
  })
}
