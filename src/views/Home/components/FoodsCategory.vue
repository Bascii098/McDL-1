<script setup>
import { getCategoryAPI } from '@/apis/foods'
import { onMounted, ref } from 'vue'

const foodsList = ref([])
const getFood = async () => {
  const res = await getCategoryAPI()
  foodsList.value = res.data
}
onMounted(() => getFood())
</script>

<template>
  <section class="category-section">
    <h2 class="section-title">
      <span class="title-line"></span>
      美食分类
      <span class="title-line"></span>
    </h2>
    <ul class="category-grid">
      <li v-for="item in foodsList" :key="item.id">
        <RouterLink :to="`/menu/${item.id}`" class="category-card">
          <div class="card-img-wrap">
            <img class="card-img" :src="item.imgurl" :alt="item.name" />
            <div class="card-gradient"></div>
            <div class="card-overlay">
              <span class="overlay-text">点击查看</span>
            </div>
          </div>
          <div class="card-name">{{ item.name }}</div>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.category-section {
  width: $mcMaxWidth;
  margin: 50px auto 40px;
}

.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: $brandDark;
  margin-bottom: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  letter-spacing: 2px;

  .title-line {
    display: inline-block;
    width: 60px;
    height: 2px;
    background: $brandGold;
    border-radius: 1px;
  }
}

.category-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.category-card {
  display: block;
  width: 228px;
  border-radius: $mcRadius;
  overflow: hidden;
  background: $mcBgWhite;
  box-shadow: $mcShadowSm;
  transition: all $mcTransition;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $mcShadowLg;

    .card-img {
      transform: scale(1.1);
    }

    .card-overlay {
      opacity: 1;
      background: rgba(0, 0, 0, 0.25);
    }

    .card-name {
      color: $brandRed;
    }
  }
}

.card-img-wrap {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  background: #fafafa;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
  pointer-events: none;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all $mcTransition;

  .overlay-text {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    padding: 10px 28px;
    border: 2px solid #fff;
    border-radius: 24px;
    letter-spacing: 2px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
}

.card-name {
  height: 64px;
  line-height: 64px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: $mcText;
  transition: color $mcTransition;
  letter-spacing: 2px;
  background: $mcBgWhite;
  position: relative;
}
</style>
