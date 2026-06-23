import http from '@/utils/http'

export function getCategoryAPI() {
  return http({ url: '/api/foods/category' })
}

export function getfoodsAPI(categoryId) {
  return http({ url: `/api/foods/list/${categoryId}` })
}

export function getfoodsdetailAPI(id) {
  return http({ url: `/api/foods/detail/${id}` })
}
