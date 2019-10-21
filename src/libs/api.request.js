import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const axios = new HttpRequest(baseUrl)
const axiosLogin = new HttpRequest(config.baseUrl.center)
const axiosNick = new HttpRequest(config.baseUrl.Nicknames)
const axiosFour = new HttpRequest(config.baseUrl.axiosFour)
const axiosThree = new HttpRequest(config.baseUrl.axiosThree)
export { axios, axiosLogin, axiosNick, axiosFour, axiosThree }
