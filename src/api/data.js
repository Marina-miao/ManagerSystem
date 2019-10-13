import { axios, axiosNick, axiosWheel } from '@/libs/api.request'
// 查询所有课程
export const _getCourses = (data) => {
  return axios.request({
    url: `/courses_pages`,
    params: data
  })
}
// 删除当前课程
export const _deleteCourse = (data) => {
  return axios.request({
    url: `/courses/${data.courseId}`,
    method: 'delete'
  })
}
// 上下线当前课程
export const _offlineCourse = (data) => {
  return axios.request({
    url: `/courses:status/${data.courseId}?status=${data.status}`,
    method: 'put'
  })
}
// 保存面授课程
export const _addOfflineCourse = (data) => {
  return axios.request({
    url: `/courses:lecture`,
    method: 'post',
    data
  })
}
// 更新面授课程
export const _updateOfflineCourse = (data, courseId) => {
  return axios.request({
    url: `/courses:lecture/${courseId}`,
    method: 'put',
    data
  })
}
// 保存线上课程
export const _addOnlineCourse = (data) => {
  return axios.request({
    url: `/courses:replay`,
    method: 'post',
    data
  })
}
// 更新线上课程
export const _updateOnlineCourse = (data, courseId) => {
  return axios.request({
    url: `/courses:replay/${courseId}`,
    method: 'put',
    data
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
    url: `/stages`
  })
}

// 删除当前学段
export const _deletePeriod = (data) => {
  return axios.request({
    url: `/stages/${data.id}`,
    method: 'delete'
  })
}

// 保存学段
export const _savePeriod = (data) => {
  return axios.request({
    url: `/stages`,
    method: 'post',
    params: data
  })
}

// 更新当前学段
export const _saveCurrentPeriod = (data) => {
  return axios.request({
    url: `/stages/${data.id}?name=${data.name}`,
    method: 'put'
  })
}

// 查询项目树
export const _getProject = () => {
  return axios.request({
    url: `/projects_trees`
  })
}

// 添加子父类
export const _saveAdd = (data) => {
  return axios.request({
    url: `/projects`,
    method: 'post',
    params: data
  })
}

// 更新子父类
export const _update = (id, data) => {
  return axios.request({
    url: `/projects/${id}`,
    method: 'put',
    params: data
  })
}

// 删除子父类
export const _delete = (data) => {
  return axios.request({
    url: `/projects/${data.id}`,
    method: 'delete'
  })
}
// 保存课程表
export const _addTimetable = (data, courseId) => {
  return axios.request({
    url: `/courses/${courseId}/tables`,
    method: 'post',
    data
  })
}
// 获取课程表列表
export const _getTimetable = (courseId) => {
  return axios.request({
    url: `/courses/${courseId}/tables`
  })
}
// 删除课程表
export const _deleteTimetable = (courseId, id) => {
  return axios.request({
    url: `/courses/${courseId}/tables/${id}`,
    method: 'delete'
  })
}
// 获取课程目录列表
export const _getCatalogs = (courseId) => {
  return axios.request({
    url: `/courses/${courseId}/catalogs`
  })
}
// 保存课程目录
export const _saveCatalog = (data, courseId) => {
  return axios.request({
    url: `/courses/${courseId}/catalogs`,
    method: 'post',
    data
  })
}
// 删除课程目录
export const _deleteCatalog = (courseId, catalogsId) => {
  return axios.request({
    url: `/courses/${courseId}/catalogs/${catalogsId}`,
    method: 'delete'
  })
}
// 查询目录详情
export const _getCatalogDetail = (courseId, catalogsId) => {
  return axios.request({
    url: `/courses/${courseId}/catalogs/${catalogsId}`
  })
}
// 更新目录详情
export const _updateCatalog = (data, courseId, catalogsId) => {
  return axios.request({
    url: `/courses/${courseId}/catalogs/${catalogsId}`,
    method: 'put',
    data
  })
}
// 查询课程标题
export const _getTitleList = (data) => {
  return axios.request({
    url: `/courses:titles`,
    params: data
  })
}
// 获取评论昵称列表
export const _getNicknames = (appId) => {
  return axiosNick.request({
    url: `/user/findAllUserByAppId/${appId}`
  })
}
// 保存新建评论
export const _saveComment = (data) => {
  return axios.request({
    url: `/comments`,
    method: 'post',
    data
  })
}
// 查询评论
export const _getCommentlist = (data) => {
  return axios.request({
    url: `/comments_pages`,
    params: data
  })
}
// 查询评论详情
export const _getCommentDetail = (commentId) => {
  return axios.request({
    url: `/comments/${commentId}`
  })
}
// 更新评论
export const _updateComment = (data, commentId) => {
  return axios.request({
    url: `/comments/${commentId}`,
    method: 'put',
    data
  })
}
// 删除评论
export const _deleteComment = (commentId) => {
  return axios.request({
    url: `/comments/${commentId}`,
    method: 'delete'
  })
}
// 更新评论公开未公开状态
export const _updateOpenStatus = (commentId, data) => {
  return axios.request({
    url: `/comments:status/${commentId}`,
    method: 'put',
    params: data
  })
}
// 评论排序
export const _updateSort = (commentId, data) => {
  return axios.request({
    url: `/comments:order/${commentId}`,
    method: 'put',
    params: data
  })
}
// 查询优惠券列表
export const _getCouponList = (data) => {
  return axios.request({
    url: `/coupons_pages`,
    params: data
  })
}
// 保存优惠券
export const _saveCoupon = (data) => {
  return axios.request({
    url: `/coupons`,
    method: 'post',
    data
  })
}
// 查询优惠券
export const _getCouponDetail = (couponId) => {
  return axios.request({
    url: `/coupons/${couponId}`
  })
}
// 删除优惠券
export const _deleteCoupon = (couponId) => {
  return axios.request({
    url: `/coupons/${couponId}`,
    method: 'delete'
  })
}
// 更新优惠券
export const _updateCoupon = (data, couponId) => {
  return axios.request({
    url: `/coupons/${couponId}`,
    method: 'put',
    data
  })
}
// 查询轮播图列表
export const _getPictureList = (data) => {
  return axiosWheel.request({
    url: `/pictures_pages`,
    params: data
  })
}
// 删除轮播图
export const _deletePicture = (pictureId) => {
  return axiosWheel.request({
    url: `/pictures/${pictureId}`,
    method: 'delete'
  })
}
// 查询轮播图
export const _getPictureDetail = (pictureId) => {
  return axiosWheel.request({
    url: `/pictures/${pictureId}`
  })
}
// 保存轮播图
export const _savePicture = (data) => {
  return axiosWheel.request({
    url: `/pictures`,
    method: 'post',
    data
  })
}
// 更新轮播图
export const _updatePicture = (data) => {
  return axiosWheel.request({
    url: `/pictures`,
    method: 'post',
    data
  })
}
// 保存文字广告
export const _saveNotice = (data) => {
  return axiosWheel.request({
    url: `/notices`,
    method: 'post',
    data
  })
}
// 查询文字广告列表
export const _getNoticeList = (data) => {
  return axiosWheel.request({
    url: `/notices_pages`,
    params: data
  })
}
// 删除文字广告
export const _deleteNotice = (noticeId) => {
  return axiosWheel.request({
    url: `/notices/${noticeId}`,
    method: 'delete'
  })
}
// 查询文字广告
export const _getNoticeDetail = (noticeId) => {
  return axiosWheel.request({
    url: `/notices/${noticeId}`
  })
}
// 更新文字广告
export const _updateNotice = (data, noticeId) => {
  return axiosWheel.request({
    url: `/notices/${noticeId}`,
    method: 'put',
    data
  })
}
// 查询活动列表
export const _getActiveList = (data) => {
  return axiosWheel.request({
    url: `/activity/list/pagination`,
    params: data
  })
}
// 删除活动
export const _deleteActive = (activeId) => {
  return axiosWheel.request({
    url: `/activity/${activeId}`,
    method: 'delete'
  })
}
