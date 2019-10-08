import Mock from 'mockjs'
import {

} from './data.js'
// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})
// 登录
// Mock.mock(/\/loginUser/, loginUser)
// Mock.mock(/\/getUser/, getUser)
// 课程删除、课程详情
// Mock.mock(/\/courses\/\d+/, coursesDetail)
// 课程列表
// Mock.mock(/\/courses/, courses)
// Mock.mock(/\/comments\/1/, commentDetail)
// Mock.mock(/\/comments/, commentList)
