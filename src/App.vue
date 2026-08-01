<script setup></script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page">
      <!-- key 用路由模板而非完整路径，避免 /menu/1 → /menu/2 只改参数时把整页（含侧边栏）重挂载重拉分类 -->
      <component :is="Component" :key="$route.matched.map((r) => r.path).join('/')" />
    </Transition>
  </RouterView>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
