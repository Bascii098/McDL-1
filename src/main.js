import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/styles/common.scss'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useUserStore } from '@/stores/user'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

// 页面刷新后用 HttpOnly refresh cookie 恢复登录态（放内存的 access token 已随刷新丢失）
useUserStore(pinia).restoreSession()
router.afterEach(() => {
  window.scrollTo(0, 0)
})
app.use(pinia)
app.use(router)

app.mount('#app')
