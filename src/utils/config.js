// 后端 API 地址。前端与 API 必须同站（同为 localhost 或同为 127.0.0.1）：
// 跨站时 SameSite=Lax 的 refresh cookie 不会随请求发送，刷新登录态会失效。
// 本地开发请用 http://localhost:5173 打开前端（Vite 默认只绑 localhost）
export const API_BASE_URL = 'http://localhost:3007'
