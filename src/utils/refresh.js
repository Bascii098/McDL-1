import axios from 'axios'
import { API_BASE_URL } from '@/utils/config'

// 独立的裸 axios：不走 http.js 的拦截器，避免刷新请求再触发 401 → 死循环
const bare = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  withCredentials: true // 发送/接收 HttpOnly refresh cookie
})

// 并发 401 时只发一次 refresh，其余请求复用同一个 promise
let pending = null

export function requestRefreshToken() {
  if (!pending) {
    pending = bare
      .post('/api/user/refresh')
      .then((res) => {
        if (res.data.status === 0) return res.data.token
        throw new Error(res.data.message || '刷新登录失败')
      })
      .finally(() => {
        pending = null
      })
  }
  return pending
}
