import { defineStore } from 'pinia'
import { ref } from 'vue'
import { requestRefreshToken } from '@/utils/refresh'
import { logoutAPI } from '@/apis/user'

export const useUserStore = defineStore('user', () => {
  // access token 只放内存，不落任何可被 JS 读取的存储（localStorage/cookie），XSS 偷不到持久凭证
  const token = ref('')

  const setToken = (t) => {
    token.value = t || ''
  }

  // 页面刷新后用 HttpOnly refresh cookie 换新的 access token，恢复登录态
  // 内部对并发调用做了去重，可被主流程 + 路由守卫重复调用
  const restoreSession = async () => {
    if (token.value) return true
    try {
      token.value = await requestRefreshToken()
      return true
    } catch {
      token.value = ''
      return false
    }
  }

  const logout = () => {
    token.value = ''
    // HttpOnly cookie 无法用 JS 删除，必须调后端清
    logoutAPI().catch(() => {})
  }

  const clearUserInfo = () => {
    token.value = ''
  }

  return { token, setToken, restoreSession, logout, clearUserInfo }
})
