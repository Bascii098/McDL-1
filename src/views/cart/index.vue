<script setup>
import { getcartAPI, deletecartAPI, updatecartAPI, clearcartAPI } from '@/apis/cart'
import { addorderAPI } from '@/apis/order'
import { onMounted, ref, computed } from 'vue'
import { debounce } from 'lodash'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import { useCartStore } from '@/stores/cart'
import { Trash2 } from '@lucide/vue'

const cartStore = useCartStore()
const cartList = ref([])
const getcart = async () => {
  const res = await getcartAPI()
  cartList.value = res.data
}
const delCart = async (id) => {
  const idx = cartList.value.findIndex((item) => id === item.id)
  const removed = cartList.value[idx]
  cartList.value.splice(idx, 1)
  try {
    await deletecartAPI(id)
    cartStore.refresh()
  } catch {
    cartList.value.splice(idx, 0, removed)
    ElMessage({ type: 'error', message: '删除失败，请重试' })
  }
}
const handleChange = debounce(async (id, num) => {
  await updatecartAPI({ id, num })
  cartStore.refresh()
}, 300)
const allCount = computed(() => cartList.value.reduce((a, c) => a + c.num, 0))
const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.num * c.price, 0))
const clearCart = async () => {
  await clearcartAPI()
  getcart()
  cartStore.refresh()
}
const addOrder = async () => {
  const order_no = uuidv4()
  const items = cartList.value.map((item) => `${item.name}*${item.num}`).join('/')
  const total_price = allPrice.value
  const res = await addorderAPI({ order_no, items, total_price })
  if (res.status === 0) {
    clearCart()
  }
}
onMounted(() => getcart())
</script>

<template>
  <div class="cart-page">
    <div class="cart-container">
      <h2 class="cart-title">我的购物车</h2>

      <div class="cart-table-wrap" v-if="cartList.length">
        <table class="cart-table">
          <thead>
            <tr>
              <th class="col-goods">商品信息</th>
              <th class="col-price">单价</th>
              <th class="col-num">数量</th>
              <th class="col-subtotal">小计</th>
              <th class="col-action">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in cartList" :key="i.id">
              <td>
                <div class="goods-cell">
                  <RouterLink to="/" class="goods-img-link">
                    <img :src="i.imgurl" :alt="i.name" />
                  </RouterLink>
                  <div class="goods-name">{{ i.name }}</div>
                </div>
              </td>
              <td class="col-center">&yen;{{ i.price }}</td>
              <td class="col-center">
                <el-input-number
                  :min="1"
                  @change="handleChange(i.id, i.num)"
                  v-model="i.num"
                  size="small"
                />
              </td>
              <td class="col-center">
                <span class="subtotal-price">&yen;{{ (i.price * i.num).toFixed(2) }}</span>
              </td>
              <td class="col-center">
                <el-popconfirm
                  title="确认删除吗?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="delCart(i.id)"
                >
                  <template #reference>
                    <span class="delete-btn" title="删除"><Trash2 :size="16" /></span>
                  </template>
                </el-popconfirm>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="cart-empty">
        <el-empty description="购物车列表为空">
          <el-button type="primary" @click="$router.push('/menu/1')">随便逛逛</el-button>
        </el-empty>
      </div>

      <div class="cart-bar" v-if="cartList.length">
        <div class="bar-summary">
          共 <strong>{{ allCount }}</strong> 件商品，商品合计：
          <span class="bar-total-price">¥ {{ allPrice.toFixed(2) }}</span>
        </div>
        <div class="bar-actions">
          <el-button @click="clearCart">清空购物车</el-button>
          <el-button type="primary" class="btn-order" @click="addOrder">下单结算</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-page {
  width: $mcMaxWidth;
  margin: 0 auto;
  padding: 30px 0 60px;
}

.cart-title {
  font-size: 26px;
  font-weight: 700;
  color: $brandDark;
  margin-bottom: 24px;
}

.cart-table-wrap {
  background: $mcBgWhite;
  border-radius: $mcRadius;
  box-shadow: $mcShadowSm;
  overflow: hidden;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 16px 12px;
    border-bottom: 1px solid $mcBorderLight;
  }

  th {
    font-size: 14px;
    font-weight: 500;
    color: $mcTextSecondary;
    background: #fafafa;
    height: 52px;
  }

  td {
    vertical-align: middle;
  }

  .col-goods {
    width: 400px;
    padding-left: 28px;
  }

  .col-price,
  .col-num {
    width: 160px;
  }

  .col-subtotal {
    width: 160px;
  }

  .col-action {
    width: 100px;
  }

  .col-center {
    text-align: center;
  }
}

.goods-cell {
  display: flex;
  align-items: center;
  gap: 16px;

  img {
    width: 80px;
    height: 80px;
    border-radius: $mcRadiusSm;
    object-fit: cover;
  }

  .goods-name {
    font-size: 15px;
    font-weight: 500;
    color: $mcText;
  }
}

.subtotal-price {
  font-size: 16px;
  font-weight: 600;
  color: $mcAccent;
}

.delete-btn {
  color: $mcTextMuted;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: color $mcTransition;

  &:hover {
    color: $mcError;
  }
}

.cart-empty {
  background: $mcBgWhite;
  border-radius: $mcRadius;
  padding: 80px 0;
  box-shadow: $mcShadowSm;
}

.cart-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $mcBgWhite;
  border-radius: $mcRadius;
  box-shadow: $mcShadowSm;
  margin-top: 20px;
  padding: 0 28px;
  height: 76px;
}

.bar-summary {
  font-size: 15px;
  color: $mcTextSecondary;
}

.bar-total-price {
  font-size: 22px;
  font-weight: 700;
  color: $mcAccent;
  margin-left: 4px;
  font-family: 'Trebuchet MS', sans-serif;
}

.bar-actions {
  display: flex;
  gap: 12px;
}

.btn-order {
  font-size: 15px;
  letter-spacing: 2px;
  border-radius: $mcRadiusSm;
  padding: 0 28px;
}
</style>
