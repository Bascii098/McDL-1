<script setup>
import { getCategoryAPI } from '@/apis/foods'
import { onMounted, ref } from 'vue'

const foodsList = ref([])
const getBanner = async () => {
  const res = await getCategoryAPI()
  foodsList.value = res.data
}
onMounted(() => getBanner())
</script>

<template>
  <nav class="menu-nav">
    <h2 class="nav-title">美食菜单</h2>
    <ul>
      <li v-for="item in foodsList" :key="item.id">
        <RouterLink class="nav-link" active-class="active" :to="`/menu/${item.id}`">
          <img class="nav-img" :src="item.imgurl" :alt="item.name" />
          <span class="nav-name">{{ item.name }}</span>
          <span class="nav-arrow">›</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.menu-nav {
  width: 220px;
  flex-shrink: 0;
  background: $mcBgWhite;
  border-radius: $mcRadius;
  box-shadow: $mcShadowSm;
  overflow: hidden;
  position: sticky;
  top: 100px;
}

.nav-title {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  background: $brandDark;
  letter-spacing: 3px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 72px;
  padding: 0 14px;
  border-bottom: 1px solid $mcBorderLight;
  transition: all $mcTransition;

  &:hover {
    background: #fafafa;

    .nav-img {
      transform: scale(1.1);
    }
  }

  &.active {
    background: #fff8e8;
    border-right: 4px solid $brandGold;

    .nav-name {
      color: $brandRed;
      font-weight: 600;
    }
  }
}

.nav-img {
  width: 48px;
  height: 48px;
  border-radius: $mcRadiusSm;
  object-fit: cover;
  flex-shrink: 0;
  transition: transform $mcTransition;
}

.nav-name {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 500;
  color: $mcText;
  transition: color $mcTransition;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-arrow {
  font-size: 20px;
  color: $mcTextMuted;
  flex-shrink: 0;
  transition: transform $mcTransition;

  .nav-link:hover & {
    transform: translateX(3px);
  }
}
</style>
