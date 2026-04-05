import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/Product/ProductGrid'
import { categories, brands } from '../data/products'
import { formatVND } from '../utils/format'
import api from '../services/api'
import './Products.css'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    priceRange: searchParams.get('priceRange') || '',
    search: searchParams.get('search') || '',
    sale: searchParams.get('sale') === 'true',
    new: searchParams.get('new') === 'true',
  })

  const fetchProducts = useCallback(async (currentFilters) => {
    try {
      setIsLoading(true)

      // Build query string từ filters để gửi lên API Backend
      const params = new URLSearchParams()
      if (currentFilters.category) params.set('category', currentFilters.category)
      if (currentFilters.brand) params.set('brand', currentFilters.brand)
      if (currentFilters.search) params.set('search', currentFilters.search)
      if (currentFilters.sale) params.set('sale', 'true')
      if (currentFilters.new) params.set('isNew', 'true')

      // Filter giá phía Client (vì API chỉ nhận min/max riêng)
      if (currentFilters.priceRange) {
        const [min, max] = currentFilters.priceRange.split('-')
        if (min) params.set('minPrice', min)
        if (max) params.set('maxPrice', max)
      }

      const res = await api.get(`/products?${params.toString()}`)
      setProducts(res.data.data)
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Gọi API mỗi khi filters thay đổi
  useEffect(() => {
    fetchProducts(filters)
  }, [filters, fetchProducts])

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value }
    setFilters(newFilters)

    // Đồng bộ URL params
    const params = {}
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params[key] = val
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    const empty = { category: '', brand: '', priceRange: '', search: '', sale: false, new: false }
    setFilters(empty)
    setSearchParams({})
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h3>Bộ lọc</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="clear-filters">
                  Xóa ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Search */}
            <div className="filter-section">
              <h4 className="filter-title">Tìm kiếm</h4>
              <input
                type="text"
                placeholder="Tên, thương hiệu..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Danh mục</h4>
              <div className="filter-options">
                {categories.map(cat => (
                  <label key={cat.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={filters.category === cat.id}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                    <span>{cat.icon} {cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Thương hiệu</h4>
              <div className="filter-options">
                {brands.map(brand => (
                  <label key={brand} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.brand === brand}
                      onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
              <h4 className="filter-title">Giá</h4>
              <div className="filter-options">
                {[
                  { value: '0-2000000', label: 'Dưới 2.000.000 ₫' },
                  { value: '2000000-5000000', label: '2 - 5 triệu ₫' },
                  { value: '5000000-15000000', label: '5 - 15 triệu ₫' },
                  { value: '15000000-', label: 'Trên 15 triệu ₫' },
                ].map((opt) => (
                  <label key={opt.value} className="filter-option">
                    <input
                      type="radio"
                      name="priceRange"
                      value={opt.value}
                      checked={filters.priceRange === opt.value}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Filters */}
            <div className="filter-section">
              <h4 className="filter-title">Đặc biệt</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.sale}
                    onChange={(e) => handleFilterChange('sale', e.target.checked)}
                  />
                  <span>🔥 Đang giảm giá</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.new}
                    onChange={(e) => handleFilterChange('new', e.target.checked)}
                  />
                  <span>✨ Sản phẩm mới</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-content">
            <div className="products-header">
              <h1 className="products-title">
                {filters.category
                  ? categories.find(c => c.id === filters.category)?.name
                  : 'Tất cả sản phẩm'}
              </h1>
              <p className="products-count">
                {isLoading ? '...' : `${products.length} sản phẩm`}
              </p>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                ⏳ Đang tải sản phẩm từ máy chủ...
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📦</div>
                <p>Không tìm thấy sản phẩm nào</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
