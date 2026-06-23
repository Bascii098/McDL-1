import { defineStore } from 'pinia'
import { ref } from 'vue'

const TOKEN_KEY = 'mcdl_token'

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : ''
}

function setCookie(name, value, days = 7) {
  const d = new Date()
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`
}

function removeCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

export const useUserStore = defineStore('user', () => {
  const token = ref(getCookie(TOKEN_KEY))

  const setToken = (t) => {
    token.value = t
    if (t) setCookie(TOKEN_KEY, t)
    else removeCookie(TOKEN_KEY)
  }

  const clearUserInfo = () => {
    token.value = ''
    removeCookie(TOKEN_KEY)
  }

  return { token, setToken, clearUserInfo }
})
