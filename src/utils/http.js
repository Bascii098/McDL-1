import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { requestRefreshToken } from '@/utils/refresh'
import { API_BASE_URL } from '@/utils/config'
import { ElMessage } from 'element-plus'

// 前端与 API 必须同站，否则 SameSite=Lax 的 refresh cookie 不会发送，刷新登录态会失效
if (window.location.hostname !== 'localhost') {
  console.warn('[McDL] 请通过 http://localhost:5173 访问，与 API 保持同站，否则刷新登录态会失效')
}

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  // 凭证请求：允许浏览器携带/接收 HttpOnly refresh cookie
  withCredentials: true
})

// 请求拦截器：统一注入 access token
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

// 响应拦截器：401 时用 refresh token 换新 access token 并重试一次
http.interceptors.response.use(
  (res) => {
    return res.data
  },
  async (error) => {
    const { response, config } = error

    // 网络层错误（无响应）
    if (!response) {
      ElMessage.error('网络请求失败，请稍后重试')
      return Promise.reject(error)
    }

    // access token 过期/无效：刷新后重试
    const isAuthFree =
      config.url.includes('/user/login') ||
      config.url.includes('/user/refresh') ||
      config.url.includes('/user/logout')
    if (response.status === 401 && !config._retry && !isAuthFree) {
      config._retry = true
      const userStore = useUserStore()
      try {
        const newToken = await requestRefreshToken()
        userStore.setToken(newToken)
        config.headers.Authorization = newToken
        return http(config)
      } catch (refreshError) {
        userStore.clearUserInfo()
        if (window.location.pathname !== '/login') {
          ElMessage.error('登录已过期，请重新登录')
          window.location.replace('/login')
        }
        return Promise.reject(refreshError)
      }
    }

    // 其余情况交给调用方处理，避免与页面自身的错误提示重复
    return Promise.reject(error)
  }
)

export default http
