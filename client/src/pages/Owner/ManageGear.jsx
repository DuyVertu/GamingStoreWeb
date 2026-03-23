import { useState } from 'react'
import { mockProducts, categories } from '../../data/products'
import './ManageGear.css'

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  salePrice: '',
  category: '',
  brand: '',
  image: '',
  stock: '',
}

function ManageGear() {
  const [products, setProducts] = useState([...mockProducts])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(emptyProduct)

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData(emptyProduct)
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice || '',
      category: product.category,
      brand: product.brand,
      image: product.image,
      stock: product.stock,
    })
    setShowModal(true)
  }

  const handleDelete = (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter((p) => p.id !== productId))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingProduct) {
      // Update
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...formData, price: Number(formData.price), stock: Number(formData.stock), salePrice: formData.salePrice ? Number(formData.salePrice) : undefined }
            : p
        )
      )
    } else {
      // Add new
      const newProduct = {
        ...formData,
        id: String(Date.now()),
        price: Number(formData.price),
        stock: Number(formData.stock),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        rating: 0,
        reviewCount: 0,
        isNew: true,
        colors: [],
        specs: {},
        images: [],
      }
      setProducts([newProduct, ...products])
    }

    setShowModal(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="manage-gear">
      {/* Toolbar */}
      <div className="manage-gear-toolbar">
        <div className="toolbar-search">
          <input
            type="text"
            className="toolbar-search-input"
            placeholder="🔍 Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>
          ➕ Thêm sản phẩm
        </button>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="table-empty">
                    <div className="table-empty-icon">📦</div>
                    <p>Không tìm thấy sản phẩm nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="table-product">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="table-product-img"
                      />
                      <div>
                        <div className="table-product-name">{product.name}</div>
                        <div className="table-product-brand">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">
                      {categories.find((c) => c.id === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td>
                    <span className="table-price">
                      ${product.salePrice || product.price}
                    </span>
                    {product.salePrice && (
                      <span className="table-price-sale">${product.price}</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`stock-badge ${product.stock <= 10 ? 'stock-low' : 'stock-ok'}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    ⭐ {product.rating} ({product.reviewCount})
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn"
                        title="Sửa"
                        onClick={() => handleEdit(product)}
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        title="Xóa"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VD: Logitech G Pro X Superlight 2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-input"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Mô tả chi tiết sản phẩm..."
                    rows="3"
                    style={{ resize: 'vertical', minHeight: '80px' }}
                    required
                  />
                </div>

                <div className="modal-row">
                  <div className="form-group">
                    <label className="form-label">Giá (USD)</label>
                    <input
                      type="number"
                      className="form-input"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="199"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giá sale (USD)</label>
                    <input
                      type="number"
                      className="form-input"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      placeholder="Để trống nếu không sale"
                    />
                  </div>
                </div>

                <div className="modal-row">
                  <div className="form-group">
                    <label className="form-label">Danh mục</label>
                    <select
                      className="form-input"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thương hiệu</label>
                    <input
                      type="text"
                      className="form-input"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="VD: Logitech"
                      required
                    />
                  </div>
                </div>

                <div className="modal-row">
                  <div className="form-group">
                    <label className="form-label">Link ảnh</label>
                    <input
                      type="text"
                      className="form-input"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tồn kho</label>
                    <input
                      type="number"
                      className="form-input"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="50"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageGear
