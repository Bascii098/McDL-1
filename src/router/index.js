import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const layout = () => import('@/views/Layout/index.vue')
const cart = () => import('@/views/cart/index.vue')
const Login = () => import('@/views/Login/index.vue')
const menu = () => import('@/views/menu/index.vue')
const order = () => import('@/views/order/index.vue')
const Home = () => import('@/views/Home/index.vue')
const foodsdetail = () => import('@/views/FoodsDetail/index.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: layout,
      children: [
        {
          path: '',
          component: Home
        },
        {
          path: '/menu/:id',
          component: menu
        },
        {
          path: '/foods/:id',
          component: foodsdetail
        },
        {
          path: '/cart',
          component: cart,
          meta: { requiresAuth: true }
        },
        {
          path: '/order',
          component: order,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

// 路由守卫：需要登录的页面先尝试用 refresh cookie 恢复会话，失败再跳登录页
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth) {
    const ok = userStore.token || (await userStore.restoreSession())
    if (!ok) return '/login'
  }
})

export default router
