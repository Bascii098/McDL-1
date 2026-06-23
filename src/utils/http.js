import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: 'http://127.0.0.1:3007',
  timeout: 5000
})

// 请求拦截器：统一注入 token
http.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (e) => Promise.reject(e)
)

// 响应拦截器：统一错误处理
http.interceptors.response.use(
  (res) => {
    return res.data
  },
  (e) => {
    ElMessage({ type: 'error', message: '网络请求失败，请稍后重试' })
    return Promise.reject(e)
  }
)

export default http
