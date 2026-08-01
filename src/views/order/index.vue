<script setup>
import { ref, onMounted } from 'vue'
import { getorderAPI } from '@/apis/order'

const orderList = ref([])
const loading = ref(true)

const formatItems = (items) => {
  if (!items) return ''
  return items.split('/').join('\n')
}

const getorder = async () => {
  try {
    const res = await getorderAPI()
    orderList.value = res.data
  } finally {
    loading.value = false
  }
}
onMounted(() => getorder())
</script>

<template>
  <div class="order-page">
    <h2 class="order-title">订单列表</h2>

    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="order-table-wrap skeleton-table">
          <div v-for="i in 4" :key="i" class="skeleton-row">
            <el-skeleton-item variant="text" class="skeleton-line w50" />
            <el-skeleton-item variant="text" class="skeleton-line w15" />
            <el-skeleton-item variant="text" class="skeleton-line w15" />
          </div>
        </div>
      </template>
      <template #default>
        <div class="order-table-wrap" v-if="orderList.length">
          <el-table
            :data="orderList"
            style="width: 100%"
            height="600"
            empty-text="暂无订单"
            :header-cell-style="{ background: '#fafafa', color: '#666', fontWeight: 500 }"
          >
            <el-table-column label="套餐内容" min-width="400">
              <template #default="scope">
                <div class="order-items">{{ formatItems(scope.row.items) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="价格" width="220" align="center">
              <template #default="scope">
                <span class="order-price">￥{{ scope.row.total_price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="下单时间" width="220" align="center">
              <template #default="scope">
                <span class="order-time">{{ scope.row.created_at?.slice(0, 10) || '-' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-else class="order-empty">
          <el-empty description="暂无订单">
            <el-button type="primary" @click="$router.push('/menu/1')">去点餐</el-button>
          </el-empty>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
.order-page {
  width: $mcMaxWidth;
  margin: 0 auto;
  padding: 30px 0 60px;
}

.order-title {
  font-size: 26px;
  font-weight: 700;
  color: $brandDark;
  margin-bottom: 24px;
}

.order-table-wrap {
  background: $mcBgWhite;
  border-radius: $mcRadius;
  box-shadow: $mcShadowSm;
  overflow: hidden;
}

.order-items {
  font-size: 14px;
  color: $mcText;
  line-height: 2;
  white-space: pre-line;
}

.order-price {
  font-size: 22px;
  font-weight: 700;
  color: $mcAccent;
  font-family: 'Trebuchet MS', sans-serif;
}

.order-time {
  font-size: 13px;
  color: $mcTextMuted;
}

.order-empty {
  background: $mcBgWhite;
  border-radius: $mcRadius;
  box-shadow: $mcShadowSm;
  padding: 100px 0;
}

.skeleton-table {
  padding: 16px 28px;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 80px;
  border-bottom: 1px solid $mcBorderLight;

  &:last-child {
    border-bottom: none;
  }
}

.skeleton-line {
  height: 18px;
  border-radius: 4px;

  &.w50 {
    width: 50%;
  }

  &.w15 {
    width: 15%;
  }
}
</style>
