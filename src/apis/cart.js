import http from '@/utils/http'

export function addcartAPI({ food_id, name, num, price, imgurl }) {
  return http({
    url: '/api/cart/add',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: { food_id, name, num, price, imgurl }
  })
}

export function getcartAPI() {
  return http({ url: '/api/cart/list' })
}

export function deletecartAPI(id) {
  return http({
    url: '/api/cart/delete',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: { id }
  })
}

export function updatecartAPI({ id, num }) {
  return http({
    url: '/api/cart/update',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: { id, num }
  })
}

export function clearcartAPI() {
  return http({ url: '/api/cart/clear', method: 'POST' })
}
