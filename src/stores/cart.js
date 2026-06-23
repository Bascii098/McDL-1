import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getcartAPI } from '@/apis/cart'

export const useCartStore = defineStore('cart', () => {
  const count = ref(0)

  const refresh = async () => {
    try {
      const res = await getcartAPI()
      count.value = res.data.reduce((sum, item) => sum + item.num, 0)
    } catch {
      count.value = 0
    }
  }

  const reset = () => {
    count.value = 0
  }

  return { count, refresh, reset }
})
