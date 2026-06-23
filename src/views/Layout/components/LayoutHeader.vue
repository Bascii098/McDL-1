<script setup>
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { clearcartAPI } from '@/apis/cart'
import { useRouter, useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { UtensilsCrossed, ShoppingCart, ClipboardList } from '@lucide/vue'

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()

const isMenuActive = computed(() => route.path.startsWith('/menu/'))

watch(
  () => userStore.token,
  (token) => {
    if (token) cartStore.refresh()
    else cartStore.reset()
  },
  { immediate: true }
)

const navItems = [
  { to: '/menu/1', text: '菜单' },
  { to: '/cart', text: '购物车' },
  { to: '/order', text: '订单' }
]

const logout = () => {
  clearcartAPI().finally(() => {})
  userStore.setToken(null)
  router.replace('/login')
}
</script>

<template>
  <el-affix :offset="0">
    <header class="app-header">
      <div class="container">
        <RouterLink to="/" class="logo">
          <img src="@/assets/images/logo.png" alt="McDL" />
        </RouterLink>

        <nav class="nav">
          <RouterLink :to="navItems[0].to" class="nav-item" :class="{ active: isMenuActive }">
            <UtensilsCrossed :size="20" />
            <span class="nav-text">{{ navItems[0].text }}</span>
          </RouterLink>

          <RouterLink to="/cart" class="nav-item cart-link">
            <span class="cart-icon-wrap">
              <ShoppingCart :size="20" />
              <span v-if="cartStore.count" class="badge">{{ cartStore.count }}</span>
            </span>
            <span class="nav-text">购物车</span>
          </RouterLink>

          <RouterLink to="/order" class="nav-item">
            <ClipboardList :size="20" />
            <span class="nav-text">订单</span>
          </RouterLink>
        </nav>

        <div class="actions">
          <el-button v-if="userStore.token" class="btn-logout" @click="logout">
            退出登录
          </el-button>
          <el-button v-else class="btn-login" type="primary" @click="$router.push('/login')">
            登录
          </el-button>
        </div>
      </div>
    </header>
  </el-affix>
</template>

<style scoped lang="scss">
.app-header {
  height: $mcHeaderHeight;
  background: $mcBgWhite;
  border-bottom: 1px solid $mcBorder;

  .container {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .logo {
    flex-shrink: 0;
    width: 160px;
    height: 100%;
    display: flex;
    align-items: center;

    img {
      width: 100%;
      height: 48px;
      object-fit: contain;
    }
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 40px;
    height: 100%;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
    padding: 0 28px;
    font-size: 15px;
    font-weight: 500;
    color: $mcTextSecondary;
    position: relative;
    transition: all $mcTransition;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 100%;
      height: 3px;
      background: $brandRed;
      border-radius: 3px 3px 0 0;
      transition: transform $mcTransition;
    }

    &:hover {
      color: $brandRed;
    }

    &.router-link-active,
    &.active {
      color: $brandRed;

      &::after {
        transform: translateX(-50%) scaleX(1);
      }
    }
  }

  .cart-icon-wrap {
    position: relative;
    display: inline-flex;
  }

  .badge {
    position: absolute;
    top: -8px;
    right: -12px;
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    background: $brandRed;
    border-radius: 10px;
    padding: 0 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .actions {
    margin-left: auto;
  }

  .btn-login {
    background: $brandRed;
    border-color: $brandRed;
    border-radius: $mcRadiusSm;

    &:hover {
      background: #c6281a;
      border-color: #c6281a;
    }
  }

  .btn-logout {
    border-radius: $mcRadiusSm;
    color: $mcTextSecondary;

    &:hover {
      color: $brandRed;
      border-color: $brandRed;
    }
  }
}
</style>
