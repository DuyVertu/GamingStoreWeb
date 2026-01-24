import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/Product/ProductGrid'
import { mockProducts, categories, brands } from '../data/products'
import './Products.css'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    priceRange: searchParams.get('priceRange') || '',
    search: searchParams.get('search') || '',
    sale: searchParams.get('sale') === 'true',
    new: searchParams.get('new') === 'true'
  })
  
  useEffect(() => {
    let result = [...mockProducts]
    
    // Filter by category
    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }
    
    // Filter by brand
    if (filters.brand) {
      result = result.filter(p => p.brand === filters.brand)
    }
    
    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      result = result.filter(p => {
        const price = p.salePrice || p.price
        return price >= min && (max ? price <= max : true)
      })
    }
    
    // Filter by search
    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      )
    }
    
    // Filter by sale
    if (filters.sale) {
      result = result.filter(p => p.salePrice)
    }
    
    // Filter by new
    if (filters.new) {
      result = result.filter(p => p.isNew)
    }
    
    setFilteredProducts(result)
  }, [filters])
  
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value }
    setFilters(newFilters)
    
    // Update URL params
    const params = {}
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params[key] = val
    })
    setSearchParams(params)
  }
  
  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      priceRange: '',
      search: '',
      sale: false,
      new: false
    })
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
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value="0-500"
                    checked={filters.priceRange === '0-500'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  <span>Dưới $500</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value="500-1000"
                    checked={filters.priceRange === '500-1000'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  <span>$500 - $1,000</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value="1000-2000"
                    checked={filters.priceRange === '1000-2000'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  <span>$1,000 - $2,000</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value="2000-"
                    checked={filters.priceRange === '2000-'}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  <span>Trên $2,000</span>
                </label>
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
                {filteredProducts.length} sản phẩm
              </p>
            </div>
            
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
