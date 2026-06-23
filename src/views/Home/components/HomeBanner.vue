<script setup>
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const carouselRef = ref(null)
const list = [
  { imgUrl: '/img/banner/1.jpg', urlString: '1' },
  { imgUrl: '/img/banner/2.jpg', urlString: '2' },
  { imgUrl: '/img/banner/3.jpg', urlString: '3' },
  { imgUrl: '/img/banner/4.jpg', urlString: '4' }
]

const prev = () => carouselRef.value?.prev()
const next = () => carouselRef.value?.next()
</script>

<template>
  <div class="banner">
    <el-carousel ref="carouselRef" height="360px" :interval="5000" arrow="never">
      <el-carousel-item v-for="item in list" :key="item.urlString">
        <div class="banner-slide" @click="$router.push(`/menu/${item.urlString}`)">
          <img :src="item.imgUrl" class="banner-img" alt="" />
        </div>
      </el-carousel-item>
    </el-carousel>

    <button class="carousel-btn prev" @click="prev" aria-label="上一张">
      <ChevronLeft :size="24" />
    </button>
    <button class="carousel-btn next" @click="next" aria-label="下一张">
      <ChevronRight :size="24" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.banner {
  width: $mcMaxWidth;
  margin: 30px auto 0;
  position: relative;

  :deep(.el-carousel__container) {
    border-radius: $mcRadius;
  }

  :deep(.el-carousel__indicator .el-carousel__button) {
    background: $mcTextMuted;
  }
}

.banner-slide {
  width: 100%;
  height: 100%;
  border-radius: $mcRadius;
  overflow: hidden;
  cursor: pointer;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.03);
  }
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: $mcText;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $mcShadowSm;
  transition: all $mcTransition;
  z-index: 2;

  &:hover {
    background: #fff;
    box-shadow: $mcShadow;
    color: $brandRed;
  }

  &.prev {
    left: 16px;
  }

  &.next {
    right: 16px;
  }
}
</style>
