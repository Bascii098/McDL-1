import http from '@/utils/http'

export function addorderAPI({ order_no, items, total_price }) {
  return http({
    url: '/api/order/add',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: { order_no, items, total_price }
  })
}

export function getorderAPI() {
  return http({ url: '/api/order/list' })
}
