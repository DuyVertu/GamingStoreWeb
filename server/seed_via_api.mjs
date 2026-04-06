/**
 * Seed sản phẩm lên API production (Render) — tiếp nối luồng Antigravity.
 *
 * Trên Render (Environment): thêm SETUP_SECRET = chuỗi ngẫu nhiên dài (trùng với local).
 *
 * Trong server/.env (local):
 *   API_BASE_URL=https://gaminggear-api.onrender.com   (tuỳ chọn)
 *   SETUP_SECRET=...
 *   SEED_ADMIN_EMAIL=...
 *   SEED_ADMIN_PASSWORD=...
 *   SEED_ADMIN_NAME=...   (tuỳ chọn)
 *
 * Chạy từ thư mục server:  node seed_via_api.mjs
 * Hoặc:                     npm run seed:api
 *
 * Đã có sản phẩm trên server: FORCE_SEED=1 node seed_via_api.mjs
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const BASE_URL = (process.env.API_BASE_URL || 'https://gaminggear-api.onrender.com').replace(/\/$/, '')
const SETUP_SECRET = process.env.SETUP_SECRET
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Store Admin'

const VND_RATE = Number(process.env.SEED_VND_RATE || 26000)

async function post(url, body, token, extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
  let data
  try {
    data = await res.json()
  } catch {
    data = {}
  }
  return { status: res.status, data }
}

async function get(url, token) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { headers })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

function buildProductsFromMock(mockProducts) {
  return mockProducts.map(({ id, ...p }) => {
    const row = {
      name: p.name,
      description: p.description,
      price: Math.max(0, Math.round(Number(p.price) * VND_RATE)),
      category: p.category,
      brand: p.brand,
      image: p.image,
      images: p.images?.length ? p.images : [p.image],
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      isNew: Boolean(p.isNew),
      colors: p.colors,
      storage: p.storage,
      specs: p.specs && typeof p.specs === 'object' ? p.specs : {},
    }
    if (p.salePrice != null && p.salePrice !== '') {
      row.salePrice = Math.max(0, Math.round(Number(p.salePrice) * VND_RATE))
    }
    return row
  })
}

async function run() {
  if (!SETUP_SECRET) {
    console.error('❌ Thiếu SETUP_SECRET trong server/.env (hoặc .env ở root repo).')
    console.error('   Thêm SETUP_SECRET trên Render + local rồi chạy lại.')
    process.exit(1)
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Thiếu SEED_ADMIN_EMAIL hoặc SEED_ADMIN_PASSWORD trong .env.')
    process.exit(1)
  }

  const productsPath = path.join(__dirname, '..', 'client', 'src', 'data', 'products.js')
  const { default: mockProducts } = await import(pathToFileURL(productsPath).href)
  const products = buildProductsFromMock(mockProducts)

  console.log('🔧 Bootstrap admin trên API...')
  const boot = await post(
    `${BASE_URL}/api/setup/bootstrap`,
    {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
      role: 'owner',
    },
    null,
    { 'X-Setup-Key': SETUP_SECRET }
  )
  if (boot.status !== 200 && boot.status !== 201) {
    console.error('❌ Bootstrap thất bại:', boot.status, boot.data)
    console.error('   Kiểm tra SETUP_SECRET trùng Render và server đã deploy bản có /api/setup.')
    process.exit(1)
  }
  console.log('✅', boot.data.message || 'Bootstrap OK')

  console.log('\n🔐 Đăng nhập...')
  const login = await post(`${BASE_URL}/api/auth/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  })
  const token = login.data?.token
  if (!token) {
    console.error('❌ Đăng nhập thất bại:', login.data)
    process.exit(1)
  }
  console.log('✅ Đăng nhập OK — role:', login.data.user?.role)

  const existing = await get(`${BASE_URL}/api/products`, token)
  const count = existing.data?.count ?? existing.data?.data?.length ?? 0
  if (count > 0 && process.env.FORCE_SEED !== '1') {
    console.log(`\nℹ️  Đã có ${count} sản phẩm trên server. Bỏ qua seed.`)
    console.log('   Muốn ép seed: FORCE_SEED=1 node seed_via_api.mjs')
    process.exit(0)
  }

  console.log(`\n📦 Đang tạo ${products.length} sản phẩm (VNĐ ×${VND_RATE})...`)
  let ok = 0
  let fail = 0
  for (const p of products) {
    const r = await post(`${BASE_URL}/api/products`, p, token)
    if (r.status === 201 || r.status === 200) {
      console.log(`  ✅ ${p.name}`)
      ok++
    } else {
      console.log(`  ❌ ${p.name}:`, r.data?.message || r.status)
      fail++
    }
  }
  console.log(`\n🎉 Xong: ${ok} thành công, ${fail} lỗi.`)
  console.log('\n💡 Có thể xóa SETUP_SECRET trên Render sau khi xong để khóa /api/setup.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
