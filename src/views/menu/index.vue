<script setup>
import MenuNav from './components/MenuNav.vue'
import { getfoodsAPI, getCategoryAPI } from '@/apis/foods'
import { addcartAPI, getcartAPI, updatecartAPI, deletecartAPI } from '@/apis/cart'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { onMounted, ref, reactive, computed } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Minus, Plus } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()
const foodsList = ref([])
const isLogin = computed(() => userStore.token)

const categories = ref([])
const categoryName = computed(() => {
  const cat = categories.value.find((c) => c.id === Number(route.params.id))
  return cat?.name || '菜单'
})

const cartMap = reactive({})

const loadCart = async () => {
  if (!isLogin.value) return
  try {
    const res = await getcartAPI()
    res.data.forEach((item) => {
      cartMap[item.food_id] = { cartId: item.id, num: item.num }
    })
  } catch {
    /* ignore */
  }
}

const getFood = async (categoryId = route.params.id) => {
  const res = await getfoodsAPI(categoryId)
  foodsList.value = res.data
}
onMounted(async () => {
  const [catRes] = await Promise.all([getCategoryAPI(), loadCart()])
  categories.value = catRes.data
  getFood()
})
onBeforeRouteUpdate((to) => getFood(to.params.id))

const getQty = (foodId) => cartMap[foodId]?.num || 0

const addItem = async (item) => {
  if (!isLogin.value) {
    ElMessage({ type: 'warning', message: '请先登录' })
    return router.push('/login')
  }
  const res = await addcartAPI({
    food_id: item.id,
    name: item.name,
    num: 1,
    price: item.price,
    imgurl: item.imgurl
  })
  if (res.status === 1) {
    userStore.setToken(null)
    return router.push('/login')
  }
  // 重新加载购物车以获取正确的 cartId
  await loadCart()
  cartStore.refresh()
}

const increase = async (item) => {
  const entry = cartMap[item.id]
  if (!entry) return addItem(item)
  const newNum = entry.num + 1
  await updatecartAPI({ id: entry.cartId, num: newNum })
  entry.num = newNum
  cartStore.refresh()
}

const decrease = async (item) => {
  const entry = cartMap[item.id]
  if (!entry) return
  const newNum = entry.num - 1
  if (newNum <= 0) {
    await deletecartAPI(entry.cartId)
    delete cartMap[item.id]
  } else {
    await updatecartAPI({ id: entry.cartId, num: newNum })
    entry.num = newNum
  }
  cartStore.refresh()
}
</script>

<template>
  <div class="menu-page">
    <div class="menu-layout">
      <MenuNav />
      <div class="menu-main">
        <h2 class="category-title">{{ categoryName }}</h2>
        <ul class="food-grid">
          <li v-for="item in foodsList" :key="item.id">
            <div class="food-card">
              <RouterLink :to="`/foods/${item.id}`" class="food-img-wrap">
                <img class="food-img" :src="item.imgurl" :alt="item.name" />
              </RouterLink>
              <div class="food-body">
                <RouterLink :to="`/foods/${item.id}`" class="food-name">
                  {{ item.name }}
                </RouterLink>
                <div class="food-bottom">
                  <p class="food-price"><span class="price-symbol">￥</span>{{ item.price }}</p>
                  <div class="cart-controls" @click.stop>
                    <template v-if="getQty(item.id) > 0">
                      <button class="ctrl-btn" @click="decrease(item)" aria-label="减少">
                        <Minus :size="16" />
                      </button>
                      <span class="ctrl-qty">{{ getQty(item.id) }}</span>
                    </template>
                    <button class="ctrl-btn plus" @click="increase(item)" aria-label="增加">
                      <Plus :size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu-page {
  width: $mcMaxWidth;
  margin: 0 auto;
  padding: 30px 0 60px;
}

.menu-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.menu-main {
  flex: 1;
  min-width: 0;
}

.category-title {
  font-size: 24px;
  font-weight: 700;
  color: $brandDark;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid $brandGold;
}

.food-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.food-card {
  display: flex;
  flex-direction: column;
  background: $mcBgWhite;
  border-radius: $mcRadius;
  overflow: hidden;
  box-shadow: $mcShadowSm;
  transition: all $mcTransition;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $mcShadow;

    .food-img {
      transform: scale(1.06);
    }
  }
}

.food-img-wrap {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #fafafa;
}

.food-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.food-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.food-name {
  font-size: 15px;
  font-weight: 500;
  color: $mcText;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
  min-height: 45px;
  margin-bottom: 10px;

  &:hover {
    color: $brandRed;
  }
}

.food-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.food-price {
  font-size: 22px;
  font-weight: 700;
  color: $mcAccent;
  font-family: 'Trebuchet MS', sans-serif;

  .price-symbol {
    font-size: 13px;
    font-weight: 400;
  }
}

.cart-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.ctrl-btn {
  width: 36px;
  height: 36px;
  border: 1.5px solid $brandRed;
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
    transform: scale(0.9);
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

.ctrl-qty {
  min-width: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: $mcText;
}
</style>
