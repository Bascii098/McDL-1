import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import layout from '@/views/Layout/index.vue'
import cart from '@/views/cart/index.vue'
import Login from '@/views/Login/index.vue'
import menu from '@/views/menu/index.vue'
import order from '@/views/order/index.vue'
import Home from '@/views/Home/index.vue'
import foodsdetail from '@/views/FoodsDetail/index.vue'

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

// 路由守卫：需要登录的页面未登录时跳转到登录页
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.token) {
    return '/login'
  }
})

export default router
