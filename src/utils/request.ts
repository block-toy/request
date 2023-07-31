/*
 * @Author: Mr.try
 * @Date: 2021-08-10 16:22:46
 */
import { message } from 'antd'
import $a, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { COOKIE_ACCOUNT_TOKEN, NEW_COOKIE_ACCOUNT_TOKEN } from './constants'
import { jumpToLogin } from './tools'

const axios = $a.create({ withCredentials: true })
axios.defaults.baseURL = '/api/'
const CancelToken = $a.CancelToken
const accountToken = Cookies?.get(NEW_COOKIE_ACCOUNT_TOKEN) ?? Cookies?.get(COOKIE_ACCOUNT_TOKEN)
axios.interceptors.request.use(
  (config: any) => {
    config.headers['content-type'] = 'application/json'
    config.headers['Blade-Auth'] = `bearer ${accountToken}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  (response) => {
    const data = response.data
    if (!data) return
    if (data.success) return data
    message.warn(data.msg)
    return Promise.reject(data)
  },
  (error) => {
    const { response } = error
    let res: any = {}
    if (response && response instanceof Object) {
      const { data } = response
      res = data
    }
    if (error.message !== 'axioscancel') {
      if (res.code === 401) {
        jumpToLogin()
      } else if (error?.response?.data?.msg) {
        message?.destroy?.()
        const msg = error?.response?.data?.msg
        const code = error?.response?.data?.code
        // if (code == 500) {
        //   console.warn('========>', msg)
        //   return
        // }
        // 英文开头的报错 默认屏蔽掉
        if (/^[a-zA-Z]/gi.test(msg)) {
          console.error('服务器异常，请稍后再试')
        } else {
          message.warn(error?.response?.data?.msg)
        }
      }
    }
    return Promise.reject(error)
  }
)

let tokens = new Map()

/**
 * @param {string} url 请求地址
 * @param {any} params 请求参数
 * @returns
 */
export const get = (url: string, params?: any) => {
  return axios.get(url, { params })
}
/**
 * @param {string} url 请求地址
 * @param {any} params 请求参数
 * @returns
 */
export const post = (url: string, params?: any, config?: any) => {
  return axios.post(url, params, config)
}

/**
 * @param {string} url 请求地址
 * @param {any} params 请求参数
 * @returns
 */
export const form = (url: string, data?: any, config?: any) => {
  const finalConfig = {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config,
  }
  let formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return axios.post(url, formData, finalConfig)
}
/**
 * get 请求，如果同一个key值正在请求中，则不发送请求
 * @param {string} url 请求地址
 * @param {any} params 请求参数
 * @param {string} key 取消唯一标记
 * @returns
 */
export const cget = (url: string, params = {}, key: string) => {
  if (tokens.has(key)) {
    tokens.get(key).cancel('axioscancel')
  }
  let source = CancelToken.source()
  tokens.set(key, source)
  return get(url, {
    ...params,
    cancelToken: source.token,
  })
}
/** 下载文件 */
export function downloadAjax(url: string, option: any = {}, fileName: any = '文件') {
  const downloadAxios = $a.create()
  downloadAxios({
    method: option?.method ?? 'get',
    url: option.noRandom ? url : `${url}?${Math.random()}`,
    responseType: 'blob',
    headers: {
      'Blade-Auth': `bearer ${accountToken}`,
      // 'Blade-Auth': Cookies.get(NEW_COOKIE_ACCOUNT_TOKEN),
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json',
    },
    ...option,
  }).then((response) => {
    const blob = response.data
    // let [title = 'xxx', suffix = 'xlsx'] = response.headers[
    //   'content-disposition'
    // ]
    //   ?.split(';')[1]
    //   ?.split('=')[1]
    //   ?.split('.');
    // title = decodeURIComponent(title);
    const a = document.createElement('a')
    a.download = `${fileName.replace(/\//g, '-')}.${'xls'}`
    a.href = URL.createObjectURL(blob)
    a.click()
    URL.revokeObjectURL(a.href)
  })
}

//  *! [使用umi/useRequest类型推导有问题](https://github.com/umijs/umi/issues/5872)
export default async function request<R, T>(url: string, method: any, data?: any, config?: AxiosRequestConfig) {
  try {
    return await axios
      .request<T, R>({
        url,
        method,
        data: method == 'post' ? data : {},
        params: method == 'post' ? {} : data,
        ...config,
      })
      .then((res: R) => {
        /** 特殊情况 需要获取原始返回对象时，额外传参数：needOrigin:true */
        if (data?.needOrigin) {
          return res
        }
        if ((res as any).data) {
          return (res as any).data as T
        }
        return (res as any).data as T
      })
  } catch (error) {
    /** 特殊情况 需要获取原始返回对象时，额外传参数：needOrigin:true */
    if (data?.needOrigin) return error as T
    console.warn(error)
    return Promise.reject(error)
  }
}
