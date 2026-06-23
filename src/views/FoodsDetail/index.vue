<script setup>
import { getfoodsdetailAPI } from '@/apis/foods'
import { addcartAPI, getcartAPI, updatecartAPI, deletecartAPI } from '@/apis/cart'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'
import { Minus, Plus, Flame } from '@lucide/vue'

const userStore = useUserStore()
const cartStore = useCartStore()
const isLogin = computed(() => userStore.token)
const router = useRouter()
const route = useRoute()
const foodsDetail = ref({})
const qty = ref(0)
let cartId = null

const getDetail = async () => {
  const res = await getfoodsdetailAPI(route.params.id)
  foodsDetail.value = res.data
}

const loadCartQty = async () => {
  if (!isLogin.value) return
  try {
    const res = await getcartAPI()
    const match = res.data.find((item) => item.food_id === foodsDetail.value.id)
    if (match) {
      qty.value = match.num
      cartId = match.id
    }
  } catch {
    /* ignore */
  }
}

const addToCart = async () => {
  if (!isLogin.value) {
    ElMessage({ type: 'warning', message: '请先登录' })
    return router.push('/login')
  }
  const res = await addcartAPI({
    food_id: foodsDetail.value.id,
    name: foodsDetail.value.name,
    num: 1,
    price: foodsDetail.value.price,
    imgurl: foodsDetail.value.imgurl
  })
  if (res.status === 1) {
    userStore.setToken(null)
    return router.push('/login')
  }
  qty.value = 1
  await loadCartQty()
  cartStore.refresh()
}

const increase = async () => {
  await updatecartAPI({ id: cartId, num: qty.value + 1 })
  qty.value++
  cartStore.refresh()
}

const decrease = async () => {
  if (qty.value <= 1) {
    await deletecartAPI(cartId)
    qty.value = 0
    cartId = null
  } else {
    await updatecartAPI({ id: cartId, num: qty.value - 1 })
    qty.value--
  }
  cartStore.refresh()
}

onMounted(async () => {
  await getDetail()
  await loadCartQty()
})
</script>

<template>
  <div class="detail-page">
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/menu/1' }">菜单</el-breadcrumb-item>
      <el-breadcrumb-item>{{ foodsDetail.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="detail-card">
      <div class="detail-img-wrap">
        <img class="detail-img" :src="foodsDetail.imgurl" :alt="foodsDetail.name" />
      </div>
      <div class="detail-body">
        <h1 class="detail-name">{{ foodsDetail.name }}</h1>
        <p class="detail-desc">{{ foodsDetail.description }}</p>
        <div v-if="foodsDetail.calories" class="detail-calories">
          <Flame :size="18" />
          <span>{{ foodsDetail.calories }}</span>
        </div>
        <div class="detail-price">
          <span class="price-symbol">￥</span>
          <span class="price-value">{{ foodsDetail.price }}</span>
        </div>
        <div class="detail-cart" @click.stop>
          <template v-if="qty > 0">
            <button class="dc-btn" @click="decrease" aria-label="减少">
              <Minus :size="18" />
            </button>
            <span class="dc-qty">{{ qty }}</span>
          </template>
          <button class="dc-btn plus" @click="qty > 0 ? increase() : addToCart()" aria-label="增加">
            <Plus :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-page {
  width: $mcMaxWidth;
  margin: 0 auto;
  padding: 20px 0 60px;
}

.breadcrumb {
  margin-bottom: 28px;
}

.detail-card {
  display: flex;
  gap: 48px;
  background: $mcBgWhite;
  border-radius: $mcRadiusLg;
  box-shadow: $mcShadowSm;
  padding: 40px;
}

.detail-img-wrap {
  width: 440px;
  height: 440px;
  flex-shrink: 0;
  border-radius: $mcRadius;
  overflow: hidden;
  background: #fafafa;
}

.detail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.detail-name {
  font-size: 32px;
  font-weight: 700;
  color: $brandDark;
  margin-bottom: 16px;
}

.detail-desc {
  font-size: 15px;
  color: $mcTextSecondary;
  line-height: 1.8;
  margin-bottom: 20px;
}

.detail-calories {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #e67e22;
  background: #fff7ed;
  padding: 6px 14px;
  border-radius: 20px;
  width: fit-content;
  margin-bottom: 24px;
}

.detail-price {
  color: $mcAccent;
  margin-bottom: 36px;
  display: flex;
  align-items: baseline;
  gap: 4px;

  .price-symbol {
    font-size: 22px;
    font-weight: 500;
  }

  .price-value {
    font-size: 40px;
    font-weight: 700;
    font-family: 'Trebuchet MS', sans-serif;
  }
}

.detail-cart {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dc-btn {
  width: 44px;
  height: 44px;
  border: 2px solid $brandRed;
  border-radius: 50%;
  background: #fff;
  color: $brandRed;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: $brandRed;
    color: #fff;
  }

  &:active {
    transform: scale(0.93);
  }

  &.plus {
    background: $brandRed;
    color: #fff;

    &:hover {
      background: #c6281a;
      border-color: #c6281a;
    }
  }
}

.dc-qty {
  min-width: 28px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: $mcText;
}
</style>
