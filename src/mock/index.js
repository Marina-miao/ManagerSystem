import Mock from 'mockjs'
import {
  courses,
  coursesDetail
} from './data.js'
// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})
// 登录
// Mock.mock(/\/loginUser/, loginUser)
// Mock.mock(/\/getUser/, getUser)
// 课程
Mock.mock(/\/courses\/\d+/, coursesDetail)
Mock.mock(/\/courses/, courses)
