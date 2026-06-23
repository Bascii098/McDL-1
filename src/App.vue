<script setup></script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page">
      <component :is="Component" :key="$route.path" />
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
